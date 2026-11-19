/* Kiểm tra thư viện SVG thật; fixture DOM nhỏ chỉ mô phỏng ranh giới mount(). */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../ui-icons.js', import.meta.url), 'utf8');
function load(document) {
  const context = vm.createContext(document ? { document } : {});
  vm.runInContext(source, context, { filename: 'ui-icons.js' });
  return context.MuseumIcons;
}

test('registered icons inherit color and remain decorative, nonfocusable SVGs', () => {
  const icons = load();
  const required = ['logo', 'robot', 'search', 'route', 'qr', 'camera', 'volume',
    'pin', 'settings', 'share', 'flash', 'chevron', 'arrowExternal', 'trophy',
    'copy', 'download', 'close', 'check', 'info', 'microphone', 'layers',
    'zoomIn', 'expand', 'play', 'pause'];
  assert.ok(Object.isFrozen(icons));
  assert.ok(Object.isFrozen(icons.names));
  assert.equal(new Set(icons.names).size, icons.names.length);
  for (const name of required) assert.equal(icons.has(name), true, name);
  for (const name of icons.names) {
    assert.equal(icons.has(name), true, name);
    const svg = icons.svg(name);
    assert.match(svg, /^<svg\s[^>]*>.+<\/svg>$/, name);
    assert.match(svg, /\bclass="ui-icon"/, name);
    assert.match(svg, /\bviewBox="0 0 24 24"/, name);
    assert.match(svg, /\baria-hidden="true"/, name);
    assert.match(svg, /\bfocusable="false"/, name);
    assert.match(svg, /\bfill="none"/, name);
    assert.match(svg, /\bstroke="currentColor"/, name);
    assert.match(svg, /\bstroke-linecap="round"/, name);
    assert.match(svg, /\bstroke-linejoin="round"/, name);
    assert.match(svg, /<(?:path|circle|rect)\b/, name);
    assert.doesNotMatch(svg, /<(?:script|foreignObject|image|use|a|title)\b|\b(?:href|style|on\w+)\s*=/i, name);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,8}\b|\b(?:tabindex|aria-label)\s*=/i, name);
  }
  assert.notEqual(icons.svg('chevron'), icons.svg('arrowExternal'));
});

test('aliases resolve to known glyphs and inherited object names are not registry entries', () => {
  const icons = load();
  assert.equal(icons.svg('thumbsUp'), icons.svg('like'));
  assert.equal(icons.svg('thumbsDown'), icons.svg('dislike'));
  for (const value of ['constructor', '__proto__', 'toString', 'missing', '', null, 4]) {
    assert.equal(icons.has(value), false);
    assert.equal(icons.svg(value), icons.svg('info'));
  }
  const hostile = { toString() { throw new Error('untrusted coercion'); } };
  assert.equal(icons.has(hostile), false);
  assert.equal(icons.svg(hostile), icons.svg('info'));
});

test('untrusted icon names and class input cannot inject markup or SVG attributes', () => {
  const icons = load();
  const injection = '\"><image href="https://invalid.example/" onload="alert(1)">';
  assert.equal(icons.svg(injection), icons.svg('info'));
  const svg = icons.svg('search', 'ui-icon ui-icon-back safe_class safe-2 \" onload="alert(1)" <script> bad/class');
  assert.match(svg, /class="ui-icon ui-icon-back safe_class safe-2"/);
  assert.doesNotMatch(svg, /onload|alert|script|bad\/class|<image|href=/);
  assert.equal(icons.svg('search', { className: injection }), icons.svg('search'));
});

// Fixture chỉ giữ danh tính nút, thuộc tính, bộ chọn mục tiêu và SVG từ template;
// không mô phỏng bố cục hay thay thế kiểm thử bằng trình duyệt.
function domFixture() {
  const document = { createElement: tag => tag === 'template' ? new Template() : new Element(tag) };
  class Element {
    constructor(tag, attributes = {}, children = []) {
      this.tagName = tag;
      this.attributes = new Map(Object.entries(attributes));
      this.children = children;
      this.ownerDocument = document;
      this.replacements = 0;
    }
    getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    matches(selector) {
      assert.equal(selector, 'span[data-ui-icon]');
      return this.tagName === 'span' && this.attributes.has('data-ui-icon');
    }
    querySelectorAll(selector) {
      const result = [];
      for (const child of this.children) {
        if (!(child instanceof Element)) continue;
        if (child.matches(selector)) result.push(child);
        result.push(...child.querySelectorAll(selector));
      }
      return result;
    }
    replaceChildren(...children) { this.children = children; this.replacements++; }
  }
  class Template {
    set innerHTML(markup) {
      assert.match(markup, /^<svg\b[^>]*>.+<\/svg>$/);
      this.content = { firstElementChild: { tagName: 'svg', outerHTML: markup } };
    }
  }
  return { document, Element };
}

test('mount updates known slots only, preserving text, unknown slots and native labels', () => {
  const { document, Element } = domFixture();
  const known = new Element('span', { 'data-ui-icon': 'camera' }, ['old camera']);
  const unknown = new Element('span', { 'data-ui-icon': 'missing' }, ['keep custom content']);
  const plain = new Element('span', {}, ['visible button label']);
  const nonSpan = new Element('button', { 'data-ui-icon': 'close', 'aria-label': 'Close dialog' }, ['Close']);
  const button = new Element('button', { 'aria-label': 'Choose photo' }, [known, plain]);
  const surrounding = ['before', button, unknown, nonSpan, 'after'];
  document.querySelectorAll = selector => new Element('main', {}, surrounding).querySelectorAll(selector);
  const icons = load(document);
  assert.equal(icons.mount(), 1);
  assert.deepEqual(surrounding, ['before', button, unknown, nonSpan, 'after']);
  assert.equal(button.getAttribute('aria-label'), 'Choose photo');
  assert.equal(button.children[0], known);
  assert.equal(button.children[1], plain);
  assert.equal(known.getAttribute('aria-hidden'), 'true');
  assert.equal(known.children[0].outerHTML, icons.svg('camera'));
  assert.deepEqual(plain.children, ['visible button label']);
  assert.deepEqual(unknown.children, ['keep custom content']);
  assert.equal(unknown.getAttribute('aria-hidden'), null);
  assert.deepEqual(nonSpan.children, ['Close']);
  assert.equal(nonSpan.getAttribute('aria-label'), 'Close dialog');
  assert.equal(unknown.replacements, 0);
  assert.equal(nonSpan.replacements, 0);
  assert.equal(button.replacements, 0);
});

test('mount accepts a slot as scope and works safely without a document', () => {
  const { Element } = domFixture();
  const icons = load();
  const known = new Element('span', { 'data-ui-icon': 'thumbsUp' }, ['placeholder']);
  assert.equal(icons.mount(known), 1);
  assert.equal(known.children[0].outerHTML, icons.svg('like'));
  assert.equal(icons.mount(), 0);
  assert.equal(icons.mount(null), 0);
  assert.equal(icons.mount({}), 0);
});
