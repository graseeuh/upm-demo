/* VICCIA review layer: marks the areas adjusted from the live site. Off until asked for.
   Open any page with ?marks=1 or press the button. Remove this file and its script tag at launch. */
(function () {
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  var A = 'Accessibility', S = 'SEO', B = 'Best practices', P = 'Speed';
  var RULES = [
    ['.site-header', [A], 'Solid white header, so the menu is always readable (the live menu is white text over photos). Larger Facebook and Instagram buttons, keyboard friendly menu and a skip link.'],
    ['.home-hero', [P, A], 'The photo fills the first screen on every device size. Modern WebP in several widths, loaded first, with a text description.'],
    ['.founder-hero', [P, A], 'Same full width photo and centred name. The 512 pixel original is shown near its real size instead of stretched, with a dark band behind the name for contrast.'],
    ['.intro .statement', [S, A], 'The mission statement is the one main heading on the page.'],
    ['.pillars', [S], 'New: the three focus areas from the mission, each with an example taken from the foundation’s own captions.'],
    ['.impact', [S], 'New: impact figures drawn from the foundation’s own pages and photos. To be confirmed by the foundation.'],
    ['.moments', [S], 'New: four milestones that open their photo pages.'],
    ['.founder-text .prose', [A], 'Left aligned text at a comfortable line length and size.'],
    ['.page-title h1', [S, A], 'One clear main heading, with the other headings in order under it.'],
    ['.support-grid .logo-grid', [A, P], 'The sideways scrolling logo strip is now a still grid. Each logo has a name for screen readers and loads only when needed.'],
    ['.logo-grid.big', [A], 'Every logo link says which organization it opens.'],
    ['.jr', [A], 'Junior Board photos run down the left and stay in view beside the members they sit with.'],
    ['.year-jump', [A], 'Jump straight to any year.'],
    ['.tl', [S, A], 'Pop up boxes became a year by year timeline of real pages. Cover photos are shown whole, each with a line from that year.'],
    ['.cards.news', [A, P], 'Magazine covers resized, and each one is a clearly named link to its PDF.'],
    ['.gallery', [A, P], 'Captioned photos, light file sizes, and a viewer that works with the keyboard.'],
    ['.split-media img, .feature img, .wide', [P, A], 'Photos converted to WebP at screen sized widths, with descriptions and fixed dimensions so the page does not jump.'],
    ['.ct-hero', [A], 'Redesigned contact page with a clear heading and two direct actions.'],
    ['.msg-box', [B], 'No imitation form: this opens the foundation’s real contact form.'],
    ['.map-box', [P], 'The map loads only when asked for, so the page stays fast.'],
    ['.site-footer', [A], 'Large labelled Facebook and Instagram buttons.']
  ];
  var BEHIND = [
    [S, 'Descriptive page title, summary text, social sharing tags and a canonical address on each page.'],
    [P, 'Arial, matching the United Property Management site, so there is no font to download; styles built into the page.'],
    [B + ' and ' + P, 'No Squarespace bundle, popup script or trackers.']
  ];
  /* Lighthouse 12.8.2, phone, 2026-11-26: [Speed, Accessibility, Best practices, SEO]. This version was measured on a local server. */
  var SCORES = /*SCORES*/{"index":{"live":[65,100,100,100],"now":[99,100,100,100]},"our-founder":{"live":[70,98,100,92],"now":[100,100,100,100]},"the-board":{"live":[69,100,100,92],"now":[100,100,100,100]},"grants":{"live":[69,100,100,92],"now":[98,100,100,100]},"cecilandana":{"live":[63,96,100,92],"now":[96,100,100,100]},"timeline":{"live":[51,96,100,92],"now":[100,100,100,100]},"timeline-1":{"live":[61,100,100,92],"now":[100,100,100,100]},"legacy":{"live":[38,100,100,92],"now":[98,100,100,100]},"contact":{"live":[58,98,100,92],"now":[96,100,100,100]}}/*END*/;

  var css = '.vm-btn{position:fixed;right:16px;bottom:16px;z-index:200;background:#31273b;color:#fff;border:2px solid #fff;border-radius:999px;padding:10px 18px;min-height:44px;font:600 14px/20px system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.35);cursor:pointer}' +
    '.vm-on{outline:3px dashed #b3261e!important;outline-offset:-3px}' +
    '.vm-badge{position:absolute;z-index:190;width:30px;height:30px;border-radius:50%;background:#b3261e;color:#fff;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font:700 14px system-ui,sans-serif;pointer-events:none}' +
    '.vm-panel{position:fixed;right:16px;bottom:72px;z-index:200;width:min(380px,calc(100vw - 32px));max-height:min(60vh,520px);overflow:auto;background:#fff;color:#1d1a1f;border:1px solid #d8cdbd;border-radius:8px;box-shadow:0 14px 44px rgba(0,0,0,.3);padding:14px 16px;font:14px/1.45 system-ui,sans-serif}' +
    '.vm-panel h2{font:700 15px system-ui,sans-serif;margin:0 0 8px}.vm-panel ol,.vm-panel ul{margin:0 0 12px;padding-left:22px}.vm-panel li{margin-bottom:7px}' +
    '.vm-panel table{border-collapse:collapse;width:100%;margin-bottom:12px;font-size:13px}.vm-panel td,.vm-panel th{border-bottom:1px solid #eee3d6;padding:4px 2px;text-align:center}.vm-panel th:first-child,.vm-panel td:first-child{text-align:left}' +
    '.vm-cat{color:#7a5a1c;font-weight:700}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  var btn = el('button', 'vm-btn', 'Show what changed');
  btn.type = 'button';
  btn.setAttribute('aria-pressed', 'false');
  document.body.appendChild(btn);

  var marked = [], panel = null;

  function place() {
    marked.forEach(function (m) {
      var r = m.node.getBoundingClientRect();
      var fixed = !!m.node.closest('.site-header');
      m.badge.style.position = fixed ? 'fixed' : 'absolute';
      m.badge.style.top = Math.max(4, r.top + (fixed ? 0 : window.scrollY) + 6) + 'px';
      m.badge.style.left = Math.max(4, r.left + (fixed ? 0 : window.scrollX) + 6) + 'px';
      if (fixed) m.badge.style.zIndex = '195';
    });
  }

  function scoreTable() {
    var s = SCORES[page];
    if (!s) return null;
    var t = el('table'), head = el('tr');
    ['Phone score', 'Speed', 'Access.', 'Practices', 'SEO'].forEach(function (h) { head.appendChild(el('th', '', h)); });
    t.appendChild(head);
    [['Live site', s.live], ['This version', s.now]].forEach(function (row) {
      if (!row[1]) return;
      var tr = el('tr');
      tr.appendChild(el('td', '', row[0]));
      row[1].forEach(function (v) { tr.appendChild(el('td', '', String(v))); });
      t.appendChild(tr);
    });
    return t;
  }

  function on() {
    panel = el('aside', 'vm-panel');
    panel.setAttribute('aria-label', 'What changed on this page');
    panel.appendChild(el('h2', '', 'What changed on this page'));
    var t = scoreTable();
    if (t) panel.appendChild(t);
    var list = el('ol');
    RULES.forEach(function (rule) {
      var node = document.querySelector(rule[0]);
      if (!node) return;
      var num = marked.length + 1;
      node.classList.add('vm-on');
      var badge = el('span', 'vm-badge', String(num));
      badge.setAttribute('aria-hidden', 'true');
      document.body.appendChild(badge);
      marked.push({ node: node, badge: badge });
      var li = el('li');
      li.appendChild(el('span', 'vm-cat', rule[1].join(', ') + ': '));
      li.appendChild(document.createTextNode(rule[2]));
      list.appendChild(li);
    });
    panel.appendChild(list);
    panel.appendChild(el('h2', '', 'Behind the page'));
    var ul = el('ul');
    BEHIND.forEach(function (b) {
      var li = el('li');
      li.appendChild(el('span', 'vm-cat', b[0] + ': '));
      li.appendChild(document.createTextNode(b[1]));
      ul.appendChild(li);
    });
    panel.appendChild(ul);
    document.body.appendChild(panel);
    place();
  }

  function off() {
    marked.forEach(function (m) { m.node.classList.remove('vm-on'); m.badge.remove(); });
    marked = [];
    if (panel) panel.remove();
    panel = null;
  }

  function set(state, remember) {
    off();
    if (state) on();
    btn.setAttribute('aria-pressed', String(state));
    btn.textContent = state ? 'Hide changes' : 'Show what changed';
    if (remember) { try { sessionStorage.setItem('vm-marks', state ? '1' : '0'); } catch (e) { /* storage blocked */ } }
  }

  btn.addEventListener('click', function () { set(btn.getAttribute('aria-pressed') !== 'true', true); });
  window.addEventListener('resize', place);
  window.addEventListener('load', place);
  if (window.ResizeObserver) new ResizeObserver(place).observe(document.body);

  var asked = new URLSearchParams(location.search).get('marks');
  var saved = null;
  try { saved = sessionStorage.getItem('vm-marks'); } catch (e) { /* storage blocked */ }
  if (asked === '1' || (asked === null && saved === '1')) set(true, asked === '1');
}());
