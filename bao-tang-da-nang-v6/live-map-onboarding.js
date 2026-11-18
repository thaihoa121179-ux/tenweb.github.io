/* Hướng dẫn 3 bước. Chỉ lưu lựa chọn hoàn tất/bỏ qua, không lưu cảm biến hay vị trí.
   Lời gọi sensors.start() nằm trực tiếp trong click để giữ user activation trên iOS. */
((root) => {
  'use strict';
  const KEY = 'museum_map_onboarding_v1';
  const words = {
    title: ['Đi bộ để khám phá', 'Walk to explore', '걸으며 탐험하기', '边走边探索'],
    steps: ['Ba bước bắt đầu', 'Three steps to begin', '시작하는 세 단계', '三个入门步骤'],
    step: ['Bước {n} / 3', 'Step {n} / 3', '{n} / 3단계', '第{n}步 / 共3步'],
    intro: ['Cùng Mây mở những câu chuyện.', 'Discover stories with Mây.', '마이와 함께 이야기를 만나세요.', '与小云一起发现故事。'],
    introText: ['Đi vài bước để điều khiển chấm Bạn trên sơ đồ bảo tàng mô phỏng. Bạn cũng có thể dùng cần điều khiển hoặc Tự đi bất cứ lúc nào.', 'Take a few steps to move your dot on the simulated museum plan. You can use the joystick or Auto walk at any time.', '몇 걸음 걸으면 박물관 모의 평면도의 내 점이 움직입니다. 언제든 조이스틱이나 자동 걷기로 전환할 수 있어요.', '走几步即可移动模拟博物馆平面图上的位置点。您也可以随时使用摇杆或自动漫游。'],
    simulated: ['Định vị mô phỏng · Sơ đồ minh họa', 'Simulated position · Illustrative plan', '모의 위치 · 예시 평면도', '模拟定位 · 示意平面图'],
    disclaimer: ['Cảm biến không xác định vị trí thật của bạn trong bảo tàng. Dữ liệu chuyển động được xử lý trên thiết bị.', 'Sensors do not establish your real position in the museum. Motion data is processed on your device.', '센서는 박물관 안의 실제 위치를 확인하지 않습니다. 동작 데이터는 기기에서 처리됩니다.', '传感器不代表您在博物馆中的真实位置。运动数据仅在设备上处理。'],
    next: ['Tiếp tục', 'Continue', '계속', '继续'],
    back: ['Quay lại', 'Back', '뒤로', '返回'],
    skip: ['Bỏ qua hướng dẫn', 'Skip guide', '안내 건너뛰기', '跳过引导'],
    permissionTitle: ['Cho Mây nhận bước chân', 'Let Mây detect your steps', '마이가 걸음을 감지하도록 허용', '让小云检测您的步伐'],
    permissionText: ['Bấm nút bên dưới để xin quyền chuyển động và hướng điện thoại. Trên iPhone, chọn Cho phép khi Safari hỏi.', 'Tap below to request motion and orientation access. On iPhone, choose Allow when Safari asks.', '아래 버튼을 눌러 동작 및 방향 접근 권한을 요청하세요. iPhone에서 Safari가 물으면 허용을 선택하세요.', '点击下方按钮申请运动和方向访问权限。在iPhone上，Safari询问时请选择允许。'],
    request: ['Cho phép cảm biến', 'Allow sensors', '센서 허용', '允许传感器'],
    waiting: ['Đang chờ bạn cấp quyền…', 'Waiting for permission…', '권한 허용 대기 중…', '正在等待授权…'],
    denied: ['Chưa bật được cảm biến. Bạn có thể thử lại hoặc bỏ qua để dùng cần điều khiển/Tự đi.', 'Sensors could not start. Retry, or skip to use the joystick or Auto walk.', '센서를 시작하지 못했습니다. 다시 시도하거나 건너뛰고 조이스틱 또는 자동 걷기를 이용하세요.', '未能启动传感器。您可以重试，或跳过后使用摇杆或自动漫游。'],
    browserHint: ['Cảm biến cần HTTPS và Safari/Chrome; trình duyệt trong Zalo/Facebook có thể không hỗ trợ.', 'Sensors need HTTPS and Safari/Chrome; in-app browsers may not support them.', '센서에는 HTTPS와 Safari/Chrome이 필요합니다. 앱 내 브라우저는 지원하지 않을 수 있어요.', '传感器需要HTTPS和Safari/Chrome；应用内浏览器可能不支持。'],
    retry: ['Thử lại cảm biến', 'Retry sensors', '센서 다시 시도', '重试传感器'],
    calibrationTitle: ['Đặt hướng bạn sẽ đi', 'Set your walking direction', '걸어갈 방향 설정', '设定行走方向'],
    calibrationText: ['Quay mặt về hướng bạn sẽ đi, giữ điện thoại ổn định rồi bấm Đặt hướng. Hướng đó sẽ đi vào hành lang trên sơ đồ.', 'Face the direction you will walk, hold your phone steady, then tap Set direction. That direction becomes the corridor direction on this plan.', '걸어갈 방향을 바라보고 휴대전화를 안정적으로 든 뒤 방향 설정을 누르세요. 그 방향이 평면도의 복도 방향이 됩니다.', '面向即将行走的方向，拿稳手机，然后点击设定方向。该方向将对应平面图上的走廊方向。'],
    headingReady: ['Đã nhận hướng điện thoại.', 'Phone direction received.', '휴대전화 방향을 받았습니다.', '已收到手机方向。'],
    noHeading: ['Chưa nhận được la bàn. Bạn vẫn đặt được hướng mô phỏng, rồi dùng ±90° trong cài đặt nếu cần.', 'No compass heading yet. You can set a simulated direction and use ±90° in settings if needed.', '나침반 방향을 아직 받지 못했습니다. 모의 방향을 설정하고 필요하면 설정의 ±90°를 이용하세요.', '尚未收到指南针方向。您仍可设定模拟方向，必要时在设置中使用±90°。'],
    lostSensors: ['Cảm biến chưa có tín hiệu hoặc đã dừng. Thử lại ở bước trước, hoặc tiếp tục bằng cần điều khiển/Tự đi.', 'Sensors have no signal or have stopped. Retry the previous step, or continue with the joystick or Auto walk.', '센서 신호가 없거나 중지되었습니다. 이전 단계에서 다시 시도하거나 조이스틱 또는 자동 걷기로 계속하세요.', '传感器没有信号或已停止。请返回上一步重试，或继续使用摇杆或自动漫游。'],
    calibrate: ['Đặt hướng và bắt đầu', 'Set direction and begin', '방향 설정 후 시작', '设定方向并开始'],
    fallback: ['Dùng cần điều khiển', 'Use joystick', '조이스틱 사용', '使用摇杆'],
  };
  const index = M => ({vi:0,en:1,ko:2,zh:3}[M?.state?.lang] ?? 0);
  const isFinished = value => value?.version === 1 && ['completed','skipped'].includes(value.status);

  /* ctx: M (sv/persist/esc/state), sensors (start/stop/active/heading),
     calibrate(), isActive(), onFinish(result), onClose().
     Tạo một lần cho mỗi màn bản đồ; gọi close() khi rời màn. */
  function create(ctx) {
    const M = ctx.M || root.Museum;
    const t = key => words[key]?.[index(M)] || key;
    const esc = value => M.esc(String(value ?? ''));
    let remembered = false;
    try { remembered = isFinished(JSON.parse(M.sv(KEY, 'null'))); } catch {}
    const dialog = document.createElement('dialog');
    dialog.className = 'map-onboarding';
    dialog.setAttribute('aria-labelledby', 'map-onboarding-title');
    dialog.setAttribute('aria-describedby', 'map-onboarding-description');
    document.body.appendChild(dialog);
    let step = 0, busy = false, failed = false, generation = 0, headingTimer = 0, ownsSensors = false, previousFocus = null;

    function clearTimer() { clearTimeout(headingTimer); headingTimer = 0; }
    function active() { return ctx.isActive?.() !== false; }
    function closeDialog(stopSensors) {
      generation++;
      clearTimer();
      if (stopSensors && (busy || ownsSensors)) ctx.sensors.stop();
      busy = false;
      ownsSensors = false;
      if (dialog.open) dialog.close();
      if (previousFocus?.isConnected && active()) previousFocus.focus({preventScroll:true});
    }
    function finish(status, calibrated = false) {
      const preserve = !busy && ctx.sensors.active;
      const value = {version:1,status};
      let stored = false;
      try { stored = M.persist(KEY, JSON.stringify(value)) !== false; } catch {}
      remembered = true;
      closeDialog(!preserve);
      ctx.onFinish?.({completed:status==='completed',skipped:status==='skipped',calibrated,mode:preserve?'walking':'joystick',stored});
    }
    function close() {
      const wasOpen = dialog.open || busy;
      closeDialog(true);
      if (wasOpen) ctx.onClose?.();
    }
    function pollHeading() {
      if (!dialog.open || step !== 2) return;
      const status = dialog.querySelector('[data-onboarding-status]');
      const button = dialog.querySelector('[data-onboarding-finish]');
      const message=t(!ctx.sensors.active ? 'lostSensors' : Number.isFinite(ctx.sensors.heading) ? 'headingReady' : 'noHeading');
      if (status && status.textContent!==message) status.textContent=message;
      const buttonText=t(ctx.sensors.active ? 'calibrate' : 'fallback');
      if (button && button.textContent!==buttonText) button.textContent=buttonText;
      headingTimer = setTimeout(pollHeading, 350);
    }
    function paint() {
      clearTimer();
      const description = ['introText','permissionText','calibrationText'][step];
      const title = ['title','permissionTitle','calibrationTitle'][step];
      dialog.innerHTML = `<div class="map-onboarding-top"><span>${esc(t('step').replace('{n}',step+1))}</span><button type="button" class="map-onboarding-skip" data-onboarding-skip>${esc(t('skip'))}</button></div><ol class="map-onboarding-steps" aria-label="${esc(t('steps'))}">${[0,1,2].map(n=>`<li ${n===step?'aria-current="step"':''} class="${n<=step?'reached':''}">${n+1}</li>`).join('')}</ol><div class="map-onboarding-body"><div class="map-onboarding-art" aria-hidden="true"><img src="ai-robot.webp" width="96" height="96" alt=""><svg viewBox="0 0 180 90" focusable="false"><rect x="10" y="12" width="160" height="66" rx="12"/><path d="M30 45h90V26"/><circle cx="120" cy="26" r="7"/><path d="m120 16-7-10h14Z"/></svg></div><p class="map-onboarding-chip">${esc(t('simulated'))}</p><h2 id="map-onboarding-title" tabindex="-1">${esc(t(title))}</h2><p id="map-onboarding-description">${esc(t(description))}</p>${step===0?`<p class="map-onboarding-note">${esc(t('disclaimer'))}</p>`:step===1?`<p class="map-onboarding-note">${esc(t('browserHint'))}</p><p class="map-onboarding-status" data-onboarding-status role="status">${esc(busy?t('waiting'):failed?t('denied'):'')}</p>`:`<p class="map-onboarding-status" data-onboarding-status role="status"></p>`}</div><div class="map-onboarding-actions">${step>0?`<button type="button" class="map-onboarding-back" data-onboarding-back>${esc(t('back'))}</button>`:''}${step===0?`<button type="button" class="map-onboarding-primary" data-onboarding-next>${esc(t('next'))}</button>`:step===1?`<button type="button" class="map-onboarding-primary" data-onboarding-request ${busy?'disabled':''}>${esc(t(busy?'waiting':failed?'retry':'request'))}</button>`:`<button type="button" class="map-onboarding-primary" data-onboarding-finish>${esc(t(ctx.sensors.active?'calibrate':'fallback'))}</button>`}</div>`;
      dialog.querySelector('[data-onboarding-skip]').onclick = () => finish('skipped');
      dialog.querySelector('[data-onboarding-next]')?.addEventListener('click', () => {step=1;paint();});
      dialog.querySelector('[data-onboarding-back]')?.addEventListener('click', () => {
        generation++;
        if (busy) {ctx.sensors.stop();ownsSensors=false;}
        busy=false;failed=false;step=Math.max(0,step-1);paint();
      });
      dialog.querySelector('[data-onboarding-request]')?.addEventListener('click', requestSensors);
      dialog.querySelector('[data-onboarding-finish]')?.addEventListener('click', () => {
        let calibrated=false;
        if(ctx.sensors.active){ctx.calibrate();calibrated=true;}
        finish('completed',calibrated);
      });
      dialog.querySelector('#map-onboarding-title').focus({preventScroll:true});
      if(step===2)pollHeading();
    }
    async function requestSensors() {
      if (busy) return;
      const token=++generation;
      busy=true;failed=false;ownsSensors=true;
      // Không đưa await hoặc setTimeout lên trước lời gọi này.
      let request;
      try { request=ctx.sensors.start(); } catch { request=Promise.resolve(false); }
      paint();
      let granted=false;
      try { granted=await request; } catch {}
      if(token!==generation || !dialog.open || !active()) return;
      busy=false;
      if(granted && ctx.sensors.active){step=2;failed=false;}else{failed=true;ownsSensors=false;}
      paint();
    }
    function shouldShow() { return !remembered; }
    function open({force=false}={}) {
      if(!active() || (!force && !shouldShow()))return false;
      if(dialog.open)return true;
      generation++;step=0;busy=false;failed=false;ownsSensors=false;previousFocus=document.activeElement;
      dialog.showModal();paint();return true;
    }
    function reset() {
      close();if(ctx.sensors.active)ctx.sensors.stop();remembered=false;
      try { M.persist(KEY,''); } catch {}
      return open({force:true});
    }
    dialog.addEventListener('keydown', e => {if(e.key==='Escape')e.stopPropagation();});
    dialog.addEventListener('cancel', e => {e.preventDefault();finish('skipped');});
    return {open,close,reset,shouldShow,isOpen:()=>dialog.open};
  }
  root.MuseumMapOnboarding=Object.freeze({create,KEY,words,isFinished});
})(globalThis);
