(function (root) {
  "use strict";

  // Đường nét dùng chung, nhận màu từ thành phần cha.
  const paths = Object.freeze({
    logo: '<path d="M4 5.5h2a5.5 6.5 0 0 1 0 13H4zM13.5 18.5v-13l7 13v-13"/>',
    sparkles: '<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3ZM20 3v4M18 5h4M4 18v4M2 20h4"/>',
    locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    audio: '<path d="M4 13v-2a8 8 0 0 1 16 0v2M4 12H3v7h4v-7H4ZM20 12h1v7h-4v-7h3Z"/>',
    warning: '<path d="m12 3 10 18H2L12 3ZM12 9v5M12 17h.01"/>',
    send: '<path d="m22 2-7 20-4-9-9-4L22 2ZM11 13 22 2"/>',
    robot: '<rect x="4" y="7" width="16" height="14" rx="4"/><path d="M12 3v4M10 3h4M1 12v5M23 12v5M9 17h6"/><circle cx="8.5" cy="12" r=".7"/><circle cx="15.5" cy="12" r=".7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    ticket: '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6ZM15 6v2M15 11v2M15 16v2"/>',
    phone: '<path d="m7 3 3 5-3 2a15 15 0 0 0 7 7l2-3 5 3v3a2 2 0 0 1-2 2A19 19 0 0 1 2 5a2 2 0 0 1 2-2h3Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
    flash: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
    flashOff: '<path d="m3 3 18 18M10 10l-6 4h7l-1 8 6-8M13 8l1-6-5 6M17 9h3l-2 3"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    arrowExternal: '<path d="M14 3h7v7M21 3 10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
    trophy: '<path d="M7 3h10v5a5 5 0 0 1-10 0V3ZM7 5H3v2a5 5 0 0 0 5 5M17 5h4v2a5 5 0 0 1-5 5M12 13v5M8 21h8M9 18h6v3H9z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
    settings: '<path d="m10 3-.5 2.2-2 .9-2-.7-2 3.4L5 10.3v2.4l-1.5 1.5 2 3.4 2-.7 2 .9.5 2.2h4l.5-2.2 2-.9 2 .7 2-3.4-1.5-1.5v-2.4l1.5-1.5-2-3.4-2 .7-2-.9L14 3h-4Z"/><circle cx="12" cy="11.5" r="3"/>',
    route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h10a4 4 0 0 1 0 8H7a3 3 0 0 0 0 6h10"/>',
    camera: '<path d="m8 5 1.5-2h5L16 5h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4Z"/><circle cx="12" cy="13" r="4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
    volume: '<path d="m11 4-6 5H2v6h3l6 5V4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
    like: '<path d="M7 10v11H3V10h4ZM7 10l5-7a2 2 0 0 1 2 2v5h5a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2H7"/>',
    dislike: '<path d="M7 14V3H3v11h4ZM7 14l5 7a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2l-1-7a2 2 0 0 0-2-2H7"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
    microphone: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2l1 4M4 12l1 4a8 8 0 0 0 13 2"/>',
    map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16M15 5v16"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    home: '<path d="m3 10 9-8 9 8M5 9v12h14V9M9 21v-8h6v8"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    qr: '<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM21 15v3h-3v3M15 21h1M21 21h.01M12 3v3M3 12h3M9 12h3v3M12 21v-3M18 12h3"/>',
    layers: '<path d="m12 3 10 6-10 6L2 9l10-6ZM2 13l10 6 10-6M2 17l10 6 10-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    zoomIn: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5M10.5 7v7M7 10.5h7"/>',
    expand: '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5M3 3l6 6M21 3l-6 6M21 21l-6-6M3 21l6-6"/>',
    play: '<path d="m8 4 12 8-12 8V4Z"/>',
    pause: '<path d="M7 4v16M17 4v16"/>',
  });

  // Tên thay thế dùng cùng một hình vẽ.
  const aliases = Object.freeze({ thumbsUp: "like", thumbsDown: "dislike" });
  const names = Object.freeze(Object.keys(paths).concat(Object.keys(aliases)));
  const has = (name) =>
    typeof name === "string" &&
    (Object.prototype.hasOwnProperty.call(paths, name) ||
      Object.prototype.hasOwnProperty.call(aliases, name));

  function svg(name, optionalClass) {
    const iconName = has(name) ? aliases[name] || name : "info";
    // Chỉ chấp nhận tên lớp đơn giản để tránh chèn thuộc tính HTML.
    const extraClasses = typeof optionalClass === "string"
      ? optionalClass.split(/\s+/).filter((token) => /^[a-zA-Z0-9_-]+$/.test(token) && token !== "ui-icon")
      : [];
    const className = ["ui-icon"].concat(extraClasses).join(" ");
    return '<svg class="' + className + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths[iconName] + '</svg>';
  }

  function mount(scope = root.document) {
    if (!scope || typeof scope.querySelectorAll !== "function") return 0;
    const elements = Array.from(scope.querySelectorAll("span[data-ui-icon]"));
    if (typeof scope.matches === "function" && scope.matches("span[data-ui-icon]")) elements.unshift(scope);
    let count = 0;
    elements.forEach((element) => {
      const name = element.getAttribute("data-ui-icon");
      if (!has(name)) return;
      const document = element.ownerDocument;
      if (!document || typeof document.createElement !== "function") return;
      // Chỉ phân tích mã SVG do chính thư viện tạo ra.
      const template = document.createElement("template");
      template.innerHTML = svg(name);
      element.replaceChildren(template.content.firstElementChild);
      element.setAttribute("aria-hidden", "true");
      count += 1;
    });
    return count;
  }

  root.MuseumIcons = Object.freeze({ svg, has, names, mount });
})(globalThis);
