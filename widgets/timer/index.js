// A widget exports mount(container, api). `api.send(msg)` broadcasts to all peers,
// `api.on(fn)` receives messages. No network access besides the local WebRTC channel.
export function mount(container, api) {
  let left = 60;
  const el = document.createElement('div');
  el.style.cssText = 'font:700 6rem system-ui;text-align:center';
  container.appendChild(el);
  const draw = () => { el.textContent = String(left); };
  api.on(m => { if (m.type === 'set') { left = m.value; draw(); } });
  draw();
  setInterval(() => { if (left > 0) { left--; draw(); } }, 1000);
}
