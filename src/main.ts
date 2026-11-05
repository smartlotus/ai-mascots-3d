import './style.css';
import { MASCOTS, MODEL_META, PRINT_NOTES, VERSION_EXTRA, find, modelKey, partHex, posterUrl, type Lang, type MascotDef, type Ver } from './data/mascots';
import { t } from './i18n';
import type { Viewer } from './viewer';

const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
const qs = new URLSearchParams(location.search);

// ---------- 状态 ----------
const state = {
  id: 'claude', ver: 'v1' as Ver, lang: ((): Lang => {
    const s = localStorage.getItem('lang'); if (s === 'zh' || s === 'en') return s;
    return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  })(),
  compare: false, explode: false, hidden: new Set<string>(),
};
const hash = location.hash.replace(/^#\/?/, '').split('/');
if (MASCOTS.some((m) => m.id === hash[0])) state.id = hash[0];
if (hash[1] === 'pixel' || hash[1] === 'v1') state.ver = hash[1];
if (qs.get('lang') === 'en' || qs.get('lang') === 'zh') state.lang = qs.get('lang') as Lang;

let viewer: Viewer | null = null;
let glFailed = false;
const L = () => state.lang;
const cur = () => find(state.id);

// ---------- i18n ----------
function applyI18n() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n as string, L()); });
  document.querySelectorAll<HTMLElement>('[data-tip]').forEach((e) => { const s = t(e.dataset.tip as string, L()); e.setAttribute('aria-label', s); e.title = s; });
  $('#lang').textContent = state.lang === 'zh' ? 'EN' : '中';
  $('#lang').setAttribute('aria-label', state.lang === 'zh' ? 'Switch to English' : '切换到中文');
  document.title = state.lang === 'zh' ? 'AI 编程吉祥物 · 3D 展示' : 'AI Coding Mascots · 3D Showcase';
  $('#disclaimer').textContent = t('foot.disclaimer', L());
  $('#credit').textContent = t('foot.credit', L());
  renderAbout(); renderRail(); renderDetail(); renderGrid(); renderFamily();
}

// ---------- 渲染：选择条 ----------
function renderRail() {
  const rail = $('#rail');
  rail.innerHTML = '';
  for (const m of MASCOTS) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'rail-item'; b.role = 'tab';
    b.dataset.id = m.id; b.style.setProperty('--accent', m.accent);
    b.setAttribute('aria-selected', String(m.id === state.id));
    b.innerHTML = `<span class="rail-img"><img src="${posterUrl(m.id, state.ver, 'sm')}" alt="" width="96" height="96" loading="lazy" decoding="async"></span><span class="rail-name">${m.name}</span>`;
    b.addEventListener('click', () => select(m.id));
    rail.appendChild(b);
  }
}
function markRail() {
  document.querySelectorAll<HTMLElement>('.rail-item').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.id === state.id));
    const img = b.querySelector('img'); if (img) img.src = posterUrl(b.dataset.id as string, state.ver, 'sm');
  });
  const act = document.querySelector<HTMLElement>('.rail-item[aria-selected="true"]');
  const rail = $('#rail');
  if (act) rail.scrollTo({ left: act.offsetLeft - rail.clientWidth / 2 + act.clientWidth / 2, behavior: 'smooth' });
}

// ---------- 渲染：详情 ----------
function renderDetail() {
  const m = cur(); const v = m.v[state.ver]; const meta = MODEL_META[modelKey(m.id, state.ver)];
  const lang = L();
  const nm = v.name[lang];
  const extra = VERSION_EXTRA[m.id]?.[state.ver];
  const parts = v.parts.map((p) => {
    const hex = partHex(m.id, state.ver, p.key); const off = state.hidden.has(p.key);
    return `<li><button type="button" class="part${off ? ' off' : ''}" data-part="${p.key}" aria-pressed="${!off}"><span class="sw" style="--c:${hex}"></span><span class="pn">${p.color[lang]}</span><span class="pr">${p.role[lang]}</span><svg class="eye" viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path class="slash" d="M4 4l16 16"/></svg></button></li>`;
  }).join('');
  const notes = PRINT_NOTES[state.ver].map((n) => `<li>${n[lang]}</li>`).join('');
  const kb = meta ? `${Math.round(meta.bytes / 1024)} KB` : '–';
  $('#detail').innerHTML = `
    <div class="d-head">
      <p class="d-eyebrow"><span class="dot"></span>${m.name}</p>
      <h2 class="d-name">${nm}</h2>
      <p class="d-file"><span class="pill">${t('ver.' + state.ver, lang)}</span><code>${v.file}</code></p>
    </div>
    <dl class="stats">
      <div><dt>${t('detail.size', lang)}</dt><dd>${v.size[0]}×${v.size[1]}×${v.size[2]}<small> ${t('mm', lang)}</small></dd></div>
      <div><dt>${t('detail.colors', lang)}</dt><dd>${v.parts.length}<small>${t('colorsUnit', lang)}</small></dd></div>
      <div><dt>${t('detail.web', lang)}</dt><dd>${kb}</dd></div>
    </dl>
    ${extra ? `<p class="d-extra">${extra[lang]}</p>` : ''}
    ${v.label ? `<p class="d-label">${t('detail.label', lang)} <code>${v.label}</code></p>` : ''}
    <div class="d-actions">
      <button type="button" class="btn" id="bExplode" aria-pressed="${state.explode}">${t('detail.explode', lang)}</button>
      <button type="button" class="btn" id="bCompare" aria-pressed="${state.compare}">${t('detail.compare', lang)}</button>
      <button type="button" class="btn ghost" id="bOther">${t('detail.other', lang)}</button>
    </div>
    <h3 class="d-h">${t('detail.palette', lang)} <small>${t('detail.paletteHint', lang)}</small></h3>
    <ul class="parts">${parts}</ul>
    ${state.hidden.size ? `<button type="button" class="link" id="bShowAll">${t('detail.showAll', lang)}</button>` : ''}
    ${state.compare ? `<p class="d-extra">${t('detail.cmpNote', lang)}</p>` : ''}
    <details class="notes" open>
      <summary><span>${t('detail.notes', lang)}</span><small>${t('detail.notesSub', lang)}</small></summary>
      <ul>${notes}</ul>
    </details>`;
  $('#detail').querySelectorAll<HTMLElement>('.part').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.part as string; const hide = !state.hidden.has(k);
    hide ? state.hidden.add(k) : state.hidden.delete(k);
    viewer?.setPartHidden(k, hide); renderDetail();
  }));
  $('#bExplode').addEventListener('click', () => setExplode(!state.explode));
  $('#bCompare').addEventListener('click', () => setCompare(!state.compare));
  $('#bOther').addEventListener('click', () => setVer(state.ver === 'v1' ? 'pixel' : 'v1'));
  $('#bShowAll')?.addEventListener('click', () => { state.hidden.clear(); viewer?.resetHidden(); renderDetail(); });
  $('#stage').style.setProperty('--accent', m.accent);
  document.documentElement.style.setProperty('--accent', m.accent);
}

// ---------- 渲染：全家福 ----------
function renderGrid() {
  const grid = $('#grid'); grid.innerHTML = '';
  for (const m of MASCOTS) {
    const v = m.v[state.ver]; const a = document.createElement('button');
    a.type = 'button'; a.className = 'card'; a.style.setProperty('--accent', m.accent);
    a.innerHTML = `<span class="card-img"><img src="${posterUrl(m.id, state.ver)}" alt="${m.name} ${v.name[L()]}" loading="lazy" decoding="async" width="480" height="480"></span>
      <span class="card-body"><span class="card-eyebrow">${m.name}</span><span class="card-name">${v.name[L()]}</span>
      <span class="card-dots">${v.parts.map((p) => `<i style="--c:${partHex(m.id, state.ver, p.key)}"></i>`).join('')}</span></span>`;
    a.addEventListener('click', () => { select(m.id); document.getElementById('viewer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    grid.appendChild(a);
  }
}
function renderFamily() {
  const img = $<HTMLImageElement>('#familyImg');
  img.src = `${import.meta.env.BASE_URL}posters/family-${state.ver}.webp`;
  img.alt = t('family.' + state.ver, L());
  $('#familyCap').textContent = t('family.' + state.ver, L());
}
function renderAbout() {
  $('#aboutGrid').innerHTML = [1, 2, 3].map((i) => `<article class="about-card"><span class="about-n">0${i}</span><h3>${t(`about.${i}.t`, L())}</h3><p>${t(`about.${i}.p`, L())}</p></article>`).join('');
}

// ---------- 动作 ----------
function syncHash() { history.replaceState(null, '', `#/${state.id}/${state.ver}`); }
function syncUi() {
  const seg = $('#verSeg'); seg.dataset.ver = state.ver;
  seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.ver === state.ver)));
  seg.classList.toggle('disabled', state.compare);
  $('#tExplode').setAttribute('aria-pressed', String(state.explode));
  $('#tCompare').setAttribute('aria-pressed', String(state.compare));
  ($('#cmpTags') as HTMLElement).hidden = !state.compare;
  $('#stage').classList.toggle('is-compare', state.compare);
}
async function refreshModel(opts: { keepView?: boolean } = {}) {
  syncUi(); syncHash();
  setPoster();
  if (!viewer) return;
  const myId = ++seq;
  showLoading(true);
  try {
    if (state.compare) await viewer.compare(state.id); else await viewer.show(state.id, state.ver, opts);
    if (myId === seq) { showLoading(false); hidePoster(); viewer.setExplode(state.explode); }
  } catch (e) { console.warn('model load failed', e); if (myId === seq) showLoading(false, true); }
}
let seq = 0;
function select(id: string) {
  if (id === state.id) return;
  state.id = id; state.hidden.clear(); state.explode = false;
  markRail(); renderDetail(); refreshModel(); renderRailAria();
}
function renderRailAria() { /* aria 已在 markRail 中更新 */ }
function setVer(v: Ver) {
  if (state.compare) { state.compare = false; }
  if (v === state.ver && !state.compare) { syncUi(); return; }
  state.ver = v; state.hidden.clear();
  markRail(); renderDetail(); renderGrid(); renderFamily(); refreshModel({ keepView: true });
}
function setExplode(on: boolean) { state.explode = on; viewer?.setExplode(on); syncUi(); renderDetail(); }
function setCompare(on: boolean) { state.compare = on; state.hidden.clear(); viewer?.resetHidden(); syncUi(); renderDetail(); refreshModel(); }

// ---------- 海报 / 加载态 ----------
let posterTimer = 0;
function setPoster() {
  const p = $<HTMLImageElement>('#poster');
  p.classList.remove('gone');
  p.alt = `${cur().name} ${cur().v[state.ver].name[L()]}`;
  p.src = posterUrl(state.id, state.compare ? 'v1' : state.ver);
}
function hidePoster() { clearTimeout(posterTimer); posterTimer = window.setTimeout(() => $('#poster').classList.add('gone'), 60); }
function showLoading(on: boolean, fail = false) {
  const l = $('#loading');
  l.classList.toggle('on', on || fail);
  l.classList.toggle('fail', fail);
  $('#loadingText').textContent = fail ? t('loading.fail', L()) : t('loading', L());
  if (fail) setTimeout(() => l.classList.remove('on'), 3500);
}

// ---------- 启动 ----------
function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } }

async function boot() {
  applyI18n(); syncUi(); setPoster(); syncHash();
  $('#lang').addEventListener('click', () => { state.lang = state.lang === 'zh' ? 'en' : 'zh'; localStorage.setItem('lang', state.lang); applyI18n(); showLoading($('#loading').classList.contains('on')); });
  $('#verSeg').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => setVer(b.dataset.ver as Ver)));
  $('#tExplode').addEventListener('click', () => setExplode(!state.explode));
  $('#tCompare').addEventListener('click', () => setCompare(!state.compare));
  $('#tReset').addEventListener('click', () => viewer?.resetView());
  $('#tRotate').addEventListener('click', () => { const on = !(viewer?.autoRotate ?? true); viewer?.setAutoRotate(on); $('#tRotate').setAttribute('aria-pressed', String(on)); });
  window.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('input,textarea')) return;
    const i = MASCOTS.findIndex((m) => m.id === state.id);
    if (e.key === 'ArrowRight') select(MASCOTS[(i + 1) % MASCOTS.length].id);
    else if (e.key === 'ArrowLeft') select(MASCOTS[(i + MASCOTS.length - 1) % MASCOTS.length].id);
    else if (e.key === 'v' || e.key === 'V') setVer(state.ver === 'v1' ? 'pixel' : 'v1');
  });
  // 顶栏阴影
  const top = $('#top'); const onScroll = () => top.classList.toggle('scrolled', scrollY > 8); onScroll(); addEventListener('scroll', onScroll, { passive: true });

  if (!hasWebGL()) { glFailed = true; const n = $('#nogl'); n.hidden = false; n.textContent = t('nogl', L()); showLoading(false); return; }
  showLoading(true);
  const { Viewer: V } = await import('./viewer');
  viewer = new V($('#host'), {
    onInteract: () => $('#hint').classList.add('gone'),
    onFirstFrame: () => { document.body.classList.add('gl-ready'); },
  });
  (window as unknown as { __viewer: Viewer }).__viewer = viewer;
  await refreshModel();
  (window as unknown as { __ready: boolean }).__ready = true;
  // 空闲时预加载其余模型（12 个加起来约 1.6MB）
  const idle = (window as unknown as { requestIdleCallback?: (f: () => void) => void }).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 800));
  idle(() => viewer?.preload(MASCOTS.flatMap((m) => (['v1', 'pixel'] as Ver[]).map((v) => [m.id, v] as [string, Ver]))));
  void glFailed; void (null as unknown as MascotDef);
}
boot();
