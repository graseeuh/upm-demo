(function () {
  var mb = document.querySelector('.menu-btn'), nav = document.getElementById('site-nav');
  mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  function closeSubs(except) {
    document.querySelectorAll('.has-sub.open').forEach(function (l) {
      if (l !== except) { l.classList.remove('open'); l.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false'); }
    });
  }
  document.querySelectorAll('.sub-toggle').forEach(function (b) {
    b.addEventListener('click', function () { var li = b.parentNode, o = li.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSubs(); nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('click', function (e) { closeSubs(e.target.closest('.has-sub')); });
  var s = document.querySelectorAll('.slide');
  if (s.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var i = 0;
    setInterval(function () { s[i].classList.remove('on'); i = (i + 1) % s.length; s[i].classList.add('on'); }, 5000);
  }
})();

window.addEventListener("load",function(){setTimeout(function(){document.querySelectorAll(".slide img[data-src]").forEach(function(i){i.src=i.dataset.src;i.removeAttribute("data-src")})},2500)});
