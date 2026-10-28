(function () {
  'use strict';

  /* Header background on scroll */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');

  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.contains('is-open');
    if (isOpen) closeMenu(); else openMenu();
  });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });

  /* Before / after slider */
  document.querySelectorAll('.ba-wrap').forEach(function (wrap) {
    var baFrame = wrap.querySelector('.ba-frame');
    var baRange = wrap.querySelector('.ba-range');
    if (baFrame && baRange) {
      baRange.addEventListener('input', function () {
        baFrame.style.setProperty('--ba-pos', baRange.value + '%');
      });
    }
  });

  /* Viber deep link with graceful fallback */
  ['viber-link','viber-link-2'].forEach(function (id) {
  var viberLink = document.getElementById(id);
  if (viberLink) {
    viberLink.addEventListener('click', function (e) {
      e.preventDefault();
      var viberUri = 'viber://chat?number=%2B38978333288';
      var fallbackUrl = 'https://www.viber.com/en/download/';
      var didHide = false;
      var onVisChange = function () {
        if (document.hidden) { didHide = true; }
      };
      document.addEventListener('visibilitychange', onVisChange);
      window.location.href = viberUri;
      setTimeout(function () {
        document.removeEventListener('visibilitychange', onVisChange);
        if (!didHide) {
          window.open(fallbackUrl, '_blank', 'noopener');
        }
      }, 1200);
    });
  }
  });

  /* Scroll-reveal animations */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();


/* generic carousels */
document.querySelectorAll('[data-carousel]').forEach(function(root){
  var sl=root.querySelectorAll('.looks-slide'),p=root.querySelector('.looks-prev,.cx-prev'),n=root.querySelector('.looks-next,.cx-next'),ct=root.querySelector('.looks-status-count'),i=0,x0=null;
  function r(){sl.forEach(function(s,k){s.classList.toggle('is-active',k===i)});var rt=sl[i].getAttribute('data-ratio');if(fr&&fr.classList.contains('looks-frame'))fr.style.aspectRatio=rt||'';ct.textContent='0'+(i+1)+' / 0'+sl.length;p.disabled=i===0;n.disabled=i===sl.length-1}
  function go(d){var k=i+d;if(k>=0&&k<sl.length){i=k;r()}}
  p.addEventListener('click',function(){go(-1)});n.addEventListener('click',function(){go(1)});
  var fr=root.querySelector('.svc-img--car,.looks-frame');
  fr.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  fr.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?1:-1)});
  root.querySelectorAll('[data-slide]').forEach(function(li){li.addEventListener('click',function(e){if(e.target.closest('a'))return;i=Number(li.getAttribute('data-slide'));r()})});
  r();
});
