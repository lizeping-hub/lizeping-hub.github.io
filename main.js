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
  const label = { projects: '个人项目', resources: '工具与技能', writing: '文章' }[key];
  const wrapper = element('div', 'carousel');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-roledescription', '轮播');
  wrapper.setAttribute('aria-label', label);
  const toolbar = element('div', 'carousel-toolbar');
  toolbar.append(element('span', '', { projects: 'PROJECT INDEX', resources: 'RESOURCE INDEX', writing: 'ARTICLE ARCHIVE' }[key]), element('span', '', '3D GALLERY / 立体浏览'));
  const stage = element('div', 'carousel-stage');
  const track = element('div', 'carousel-track');
  track.id = `track-${key}`;
  track.setAttribute('role', 'list');
  track.setAttribute('aria-label', `${label}立体卡片，可用方向键或左右滑动切换`);
  track.tabIndex = 0;
  const cards = items.map((item, index) => {
    const card = element('article', 'portfolio-card');
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `${index + 1} / ${items.length}：${item.title}`);
    const image = element('img', 'card-image');
    image.src = item.image;
    image.alt = item.alt;
    image.width = 960;
    image.height = 540;
    image.draggable = false;
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
    return card;
  });
  const controls = element('div', 'carousel-buttons');
  const prev = element('button', 'carousel-prev', '‹');
  const next = element('button', 'carousel-next', '›');
  prev.type = next.type = 'button';
  prev.setAttribute('aria-label', `上一张${label}卡片`);
  next.setAttribute('aria-label', `下一张${label}卡片`);
  [prev, next].forEach(button => button.setAttribute('aria-controls', track.id));
  controls.append(prev, next);
  stage.append(track, controls);
  const foot = element('div', 'carousel-foot');
  foot.append(element('span', '', '← → 键切换 / 拖动与滑动浏览'));
  const progress = element('span', 'carousel-progress');
  progress.setAttribute('aria-hidden', 'true');
  items.forEach(() => progress.append(element('i')));
  const counter = element('span', 'carousel-counter');
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  foot.append(progress, counter);
  wrapper.append(toolbar, stage, foot);
  host.append(wrapper);
  let current = 0;
  let suppressClick = false;
  function update() {
    const width = stage.clientWidth;
    if (width) track.style.setProperty('--card-shift', `${Math.min(width * .285, 290)}px`);
    cards.forEach((card, index) => {
      let offset = (index - current + items.length) % items.length;
      if (offset > items.length / 2) offset -= items.length;
      const active = offset === 0;
      card.dataset.offset = Math.abs(offset) <= 1 ? String(offset) : 'far';
      card.dataset.active = String(active);
      card.tabIndex = active ? 0 : -1;
      card.setAttribute('aria-hidden', String(!active));
      card.querySelectorAll('a').forEach(link => { link.tabIndex = active ? 0 : -1; });
    });
    counter.textContent = `${number(current + 1)} / ${number(items.length)}`;
    Array.from(progress.children).forEach((bar, i) => bar.classList.toggle('active', i === current));
    prev.disabled = next.disabled = items.length < 2;
  }
  function goTo(index) {
    const focusedInCard = cards.some(card => card.contains(document.activeElement));
    current = (index + items.length) % items.length;
    update();
    if (focusedInCard) cards[current].focus({ preventScroll: true });
  }
  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  cards.forEach((card, index) => card.addEventListener('click', event => {
    if (index !== current) { event.preventDefault(); goTo(index); }
  }));
  track.addEventListener('keydown', event => {
    const actions = { ArrowRight: () => goTo(current + 1), ArrowLeft: () => goTo(current - 1), Home: () => goTo(0), End: () => goTo(items.length - 1) };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });
  let drag = null;
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    if (event.target.closest('button')) return;
    drag = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      stage.classList.add('is-dragging');
      if (!stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId);
    }
  });
  const finishDrag = event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (event.type !== 'pointercancel' && Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      suppressClick = true;
      goTo(current + (dx < 0 ? 1 : -1));
      setTimeout(() => { suppressClick = false; }, 180);
    }
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    drag = null;
    stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
  stage.addEventListener('lostpointercapture', event => {
    // Touch begins with implicit capture on the image. Its transfer to the
    // stage also bubbles a lost-capture event; only end the stage's capture.
    if (event.target !== stage) return;
    drag = null;
    stage.classList.remove('is-dragging');
  });
  stage.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
  }, true);
  let wheelTotal = 0;
  let lastWheel = 0;
  stage.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel > 180) wheelTotal = 0;
    wheelTotal += event.deltaX;
    if (Math.abs(wheelTotal) > 38 && now - lastWheel > 450) {
      goTo(current + (wheelTotal > 0 ? 1 : -1));
      wheelTotal = 0;
      lastWheel = now;
    }
  }, { passive: false });
  carousels.set(key, { update, track });
  update();
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

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('lizeping2021@163.com');
    status.textContent = '已复制邮箱地址。';
  } catch {
    status.textContent = '未能复制，邮箱地址为：lizeping2021@163.com';
  }
});
document.getElementById('year').textContent = new Date().getFullYear();
