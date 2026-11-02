const content = window.PORTFOLIO_CONTENT;
const panelIds = ['about', 'projects', 'resources', 'writing', 'contact'];
const main = document.getElementById('content');
const carousels = new Map();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function externalLink(label, url) {
  const link = element('a', '', label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  const arrow = element('span', '', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  return link;
}
function number(value) { return String(value).padStart(2, '0'); }

function createCollection(key) {
  const host = document.querySelector(`[data-collection="${key}"]`);
  const items = content[key];
  if (!host || !items?.length) return;
  const wrapper = element('div', 'carousel');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-roledescription', '轮播');
  const label = { projects: '个人项目', resources: '工具与技能', writing: '文章' }[key];
  wrapper.setAttribute('aria-label', label);
  const toolbar = element('div', 'carousel-toolbar');
  toolbar.append(element('span', '', { projects: 'PROJECT INDEX', resources: 'RESOURCE INDEX', writing: 'ARTICLE ARCHIVE' }[key]));
  const controls = element('div', 'carousel-buttons');
  const prev = element('button', '', '‹');
  const next = element('button', '', '›');
  prev.type = next.type = 'button';
  prev.setAttribute('aria-label', `上一个${label}`);
  next.setAttribute('aria-label', `下一个${label}`);
  prev.setAttribute('aria-controls', `track-${key}`);
  next.setAttribute('aria-controls', `track-${key}`);
  controls.append(prev, next);
  toolbar.append(controls);
  const track = element('div', 'carousel-track');
  track.id = `track-${key}`;
  track.setAttribute('role', 'list');
  track.setAttribute('aria-label', `${label}卡片，可使用左右方向键切换`);
  track.tabIndex = 0;
  items.forEach((item, index) => {
    const card = element('article', 'portfolio-card');
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `${index + 1} / ${items.length}：${item.title}`);
    const image = element('img', 'card-image');
    image.src = item.image;
    image.alt = item.alt;
    image.width = 960;
    image.height = 540;
    image.decoding = 'async';
    const body = element('div', 'card-body');
    const meta = element('div', 'card-meta');
    meta.append(element('span', '', `${number(index + 1)} / ${number(items.length)}`), element('span', '', item.category));
    body.append(meta, element('h2', '', item.title));
    if (item.status) body.append(element('p', 'card-status', item.status));
    body.append(element('p', 'card-description', item.description));
    if (item.note) body.append(element('p', 'card-note', item.note));
    const tags = element('div', 'card-tags');
    item.tags?.forEach(tag => tags.append(element('span', 'tag', tag)));
    body.append(tags);
    const links = element('div', 'card-links');
    if (item.links?.length) item.links.forEach(link => links.append(externalLink(link.label, link.url)));
    else links.append(element('span', 'pending-label', 'CONTENT COMING SOON / 内容待补充'));
    body.append(links);
    card.append(image, body);
    track.append(card);
  });
  const foot = element('div', 'carousel-foot');
  foot.append(element('span', '', '← → 键切换 / 横向滑动浏览'));
  const progress = element('span', 'carousel-progress');
  progress.setAttribute('aria-hidden', 'true');
  items.forEach(() => progress.append(element('i')));
  const counter = element('span', 'carousel-counter', `01 / ${number(items.length)}`);
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  foot.append(progress, counter);
  wrapper.append(toolbar, track, foot);
  host.append(wrapper);
  let index = 0;
  let ticking = false;
  function update() {
    const cards = Array.from(track.children);
    const origin = track.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, i) => {
      const delta = Math.abs(card.getBoundingClientRect().left - origin);
      if (delta < distance) { distance = delta; nearest = i; }
    });
    // The last card can be clamped by the end of a native scroll area.
    if (track.scrollLeft > 1 && track.scrollWidth - track.clientWidth - track.scrollLeft < 3) nearest = cards.length - 1;
    index = nearest;
    counter.textContent = `${number(index + 1)} / ${number(items.length)}`;
    prev.disabled = index === 0;
    next.disabled = index === items.length - 1;
    cards.forEach((card, i) => { card.dataset.active = String(i === index); });
    Array.from(progress.children).forEach((bar, i) => bar.classList.toggle('active', i === index));
  }
  function move(target) {
    const bounded = Math.max(0, Math.min(items.length - 1, target));
    const card = track.children[bounded];
    const delta = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + delta, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  prev.addEventListener('click', () => move(index - 1));
  next.addEventListener('click', () => move(index + 1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); move(0); }
    if (event.key === 'End') { event.preventDefault(); move(items.length - 1); }
  });
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  carousels.set(key, { update, track });
  prev.disabled = true;
  next.disabled = items.length < 2;
  track.firstElementChild.dataset.active = 'true';
  progress.firstElementChild.classList.add('active');
}
['projects', 'resources', 'writing'].forEach(createCollection);

function route(initial = false) {
  const hash = location.hash.slice(1);
  const id = panelIds.includes(hash) ? hash : 'about';
  if (hash !== id) history.replaceState(null, '', `#${id}`);
  panelIds.forEach(key => { document.getElementById(key).hidden = key !== id; });
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.dataset.route === id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const active = document.getElementById(id);
  document.title = `励泽坪 · ${{ about: 'AI 产品经理', projects: '个人项目', resources: '工具与技能', writing: '文章与思考', contact: '联系我' }[id]} | ZP WORKSPACE`;
  main.scrollTop = 0;
  if (!initial) {
    active.focus({ preventScroll: true });
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  requestAnimationFrame(() => carousels.get(id)?.update());
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || !panelIds.includes(link.hash.slice(1)) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  route();
});
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus({ preventScroll: true });
});
window.addEventListener('hashchange', () => route());
window.addEventListener('load', () => {
  main.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
});
route(true);
let resizeFrame;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    const current = location.hash.slice(1);
    carousels.get(current)?.update();
  });
});

document.getElementById('copy-github').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('https://github.com/lizeping-hub');
    status.textContent = '已复制 GitHub 地址。';
  } catch {
    status.textContent = '未能复制，请使用上方 GitHub 链接：https://github.com/lizeping-hub';
  }
});
document.getElementById('year').textContent = new Date().getFullYear();
