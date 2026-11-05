// 仅用于 scripts/make-posters.mjs：渲染透明背景的静态海报
import { Viewer } from './viewer';
import type { Ver } from './data/mascots';
const q = new URLSearchParams(location.search);
const v = new Viewer(document.getElementById('h') as HTMLElement, { poster: true });
v.setAutoRotate(false);
(async () => {
  await v.show(q.get('id') as string, (q.get('ver') || 'v1') as Ver);
  await new Promise((r) => setTimeout(r, 1200));
  v.renderNow();
  (window as unknown as { __posterReady: boolean }).__posterReady = true;
})();
