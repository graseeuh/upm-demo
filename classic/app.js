(function(){
  var d=document,b=d.body,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(function(){b.classList.add('loaded')},60);

  // nav state: transparent on hero, solid after, hide on scroll down
  var nav=d.querySelector('.nav'),hero=d.querySelector('[data-dark-top]'),last=0;
  function onScroll(){
    var y=scrollY, dark=hero&&y<hero.offsetHeight-80;
    nav.classList.toggle('on-dark',!!dark);
    nav.classList.toggle('solid',!dark&&y>20);
    nav.classList.toggle('hide',y>last+6&&y>400&&!b.classList.contains('menu-open'));
    if(y<last-6)nav.classList.remove('hide');
    last=y;
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // mobile menu
  var burger=d.querySelector('.burger');
  function setMenu(o){b.classList.toggle('menu-open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');d.documentElement.style.overflow=o?'hidden':''}
  burger.addEventListener('click',function(){setMenu(!b.classList.contains('menu-open'))});
  d.querySelectorAll('.sheet a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // reveals
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  d.querySelectorAll('.rv,.sky,.mk').forEach(function(el){io.observe(el)});

  // counters
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    var el=e.target,to=+el.dataset.to,suf=el.dataset.suf||'',t0=performance.now(),dur=1800;
    if(rm){el.textContent=to.toLocaleString('en-US')+suf;return}
    (function f(t){var p=Math.min(1,(t-t0)/dur),v=Math.round(to*(1-Math.pow(1-p,4)));el.textContent=v.toLocaleString('en-US')+suf;if(p<1)requestAnimationFrame(f)})(t0);
  })},{threshold:.6});
  d.querySelectorAll('[data-to]').forEach(function(el){cio.observe(el)});

  // hero slideshow
  var imgs=d.querySelectorAll('.hero-bg img'),th=d.querySelectorAll('.thumbs button'),cur=0,timer;
  function show(i){cur=i;imgs.forEach(function(im,k){im.classList.toggle('on',k===i)});th.forEach(function(t,k){t.setAttribute('aria-pressed',k===i)})}
  if(imgs.length){show(0);if(!rm)timer=setInterval(function(){show((cur+1)%imgs.length)},6000);
    th.forEach(function(t,k){t.addEventListener('click',function(){clearInterval(timer);show(k)})})}

  // team carousel: moves on its own, pauses on touch or hover, drag, swipe and arrows, loops forever
  var car=d.querySelector('.car');
  if(car){
    var auto=car.classList.contains('auto')&&!rm,setW=0,pos=0,idleAt=0,down=false,sx=0,sl=0,touching=false,hov=false,focused=false;
    var step=function(){var s0=car.querySelector('.slide'),g=parseFloat(getComputedStyle(car).columnGap)||24;return(s0?s0.getBoundingClientRect().width:240)+g};
    var hold=function(ms){idleAt=performance.now()+ms};
    if(auto){
      var orig=[].slice.call(car.children);
      for(var c=0;c<2;c++)orig.forEach(function(n){var k=n.cloneNode(true);k.setAttribute('aria-hidden','true');k.querySelectorAll('img').forEach(function(im){im.setAttribute('alt','');im.removeAttribute('loading')});car.appendChild(k)});
      var measure=function(){var kids=car.children,n=orig.length;setW=kids[n].offsetLeft-kids[0].offsetLeft};
      var start=function(){measure();if(setW>0){car.style.scrollBehavior='auto';car.scrollLeft=setW;pos=car.scrollLeft;car.style.scrollBehavior=''}};
      start();addEventListener('load',start);addEventListener('resize',function(){var r=car.scrollLeft%(setW||1);measure();car.scrollLeft=setW+r;pos=car.scrollLeft});
      car.addEventListener('scroll',function(){if(Math.abs(car.scrollLeft-pos)>1.5)pos=car.scrollLeft;
        if(setW&&(car.scrollLeft<4||car.scrollLeft>car.scrollWidth-car.clientWidth-4)){car.style.scrollBehavior='auto';car.scrollLeft+=car.scrollLeft<4?setW:-setW;pos=car.scrollLeft;car.style.scrollBehavior=''}},{passive:true});
      var last=performance.now(),visible=true;
      new IntersectionObserver(function(es){visible=es[0].isIntersecting}).observe(car);
      (function tick(t){
        var dt=Math.max(0,Math.min(64,t-last));last=t;
        if(visible&&setW&&!down&&!touching&&!hov&&!focused&&t>idleAt&&!d.hidden){
          pos+=dt*0.035;
          if(pos>=setW*2)pos-=setW;
          car.style.scrollBehavior='auto';car.scrollLeft=pos;car.style.scrollBehavior='';
        }
        requestAnimationFrame(tick)})(last);
      car.addEventListener('mouseenter',function(){hov=true});car.addEventListener('mouseleave',function(){hov=false});
      car.addEventListener('focusin',function(){focused=true});car.addEventListener('focusout',function(){focused=false});
      car.addEventListener('touchstart',function(){touching=true},{passive:true});
      var tend=function(){touching=false;hold(2500)};car.addEventListener('touchend',tend,{passive:true});car.addEventListener('touchcancel',tend,{passive:true});
      car.addEventListener('wheel',function(){hold(2500)},{passive:true});
    }
    d.querySelectorAll('.car-b').forEach(function(btn){btn.addEventListener('click',function(){
      hold(4000);car.scrollBy({left:(+btn.dataset.dir)*step()*2,behavior:rm?'auto':'smooth'})})});
    car.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=car.scrollLeft;car.classList.add('drag')});
    addEventListener('pointermove',function(e){if(down)car.scrollLeft=sl-(e.clientX-sx)});
    addEventListener('pointerup',function(){if(!down)return;down=false;car.classList.remove('drag');hold(2500)});
  }

  // list hover peek
  var peek=d.querySelector('.peek');
  if(peek&&matchMedia('(hover:hover)').matches){
    var pi=peek.querySelector('img');
    d.querySelectorAll('.list a[data-img]').forEach(function(a){
      a.addEventListener('mouseenter',function(){pi.src=a.dataset.img;peek.classList.add('on')});
      a.addEventListener('mouseleave',function(){peek.classList.remove('on')});
      a.addEventListener('mousemove',function(e){peek.style.left=Math.min(e.clientX+28,innerWidth-330)+'px';peek.style.top=(e.clientY-100)+'px'});
    });
  }
})();
