(function () {
  var menu = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
  }
  var toggles = document.querySelectorAll('.sub-toggle');
  function closeAll(except) {
    toggles.forEach(function (t) { if (t !== except) t.setAttribute('aria-expanded', 'false'); });
  }
  toggles.forEach(function (t) {
    t.addEventListener('click', function () {
      var open = t.getAttribute('aria-expanded') === 'true';
      closeAll(t);
      t.setAttribute('aria-expanded', String(!open));
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeAll(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });

  var dlg = document.querySelector('.lightbox');
  var links = Array.prototype.slice.call(document.querySelectorAll('a.zoom'));
  if (!dlg || !links.length || typeof dlg.showModal !== 'function') return;
  var img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption'), idx = 0;
  function show(i) {
    idx = (i + links.length) % links.length;
    var a = links[idx], t = a.querySelector('img'), fc = a.parentNode.querySelector('figcaption');
    img.src = a.getAttribute('href');
    img.alt = t ? t.alt : '';
    cap.textContent = fc ? fc.textContent : '';
  }
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dlg.showModal();
    });
  });
  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
})();

/* Gentle motion: sections rise into view, impact numbers count up, the map loads only on request. */
(function () {
  var map = document.querySelector('.map-load');
  if (map) {
    map.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = map.getAttribute('data-src');
      frame.title = 'Map to 3211 Ponce de Leon Blvd, Suite 301, Coral Gables';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      map.parentNode.appendChild(frame);
      frame.focus();
    });
  }

  if (!('IntersectionObserver' in window)) return;

  var chips = document.querySelectorAll('.year-jump a');
  if (chips.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        chips.forEach(function (c) { c.classList.toggle('on', c.hash === '#' + entry.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.tl-year').forEach(function (y) { spy.observe(y); });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var items = document.querySelectorAll('main section h2, .support-head h2, .intro .wrap, .pillar, .stat, .moment, .logo-grid li, .tl-list>li, .member, .jr-photo .photo, .cards>li, .gallery figure, .feature, .ct-cards li, .ct-two>*, .split>*');
  var reveal = new IntersectionObserver(function (entries) {
    var order = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      reveal.unobserve(el);
      var delay = Math.min(order++, 5) * 80;
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('rv-in');
      setTimeout(function () {
        el.classList.remove('rv', 'rv-in');
        el.style.transitionDelay = '';
      }, delay + 800);
    });
  }, { rootMargin: '0px 0px -6% 0px' });

  var counter = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target, end = Number(el.getAttribute('data-count'));
      var pre = el.getAttribute('data-prefix'), post = el.getAttribute('data-suffix'), start = null;
      counter.unobserve(el);
      function step(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / 1400);
        el.textContent = pre + Math.round(end * (1 - Math.pow(1 - t, 3))) + post;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  // Measure first, then hide, so nothing already on screen flickers.
  var below = Array.prototype.filter.call(items, function (el) {
    return el.getBoundingClientRect().top > window.innerHeight;
  });
  below.forEach(function (el) { el.classList.add('rv'); reveal.observe(el); });
  document.querySelectorAll('.num[data-count]').forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) counter.observe(el);
  });
})();
