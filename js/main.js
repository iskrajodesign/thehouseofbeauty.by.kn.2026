(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');
  var main = document.getElementById('main');
  var footer = document.querySelector('.site-footer');

  function focusables() {
    return Array.prototype.slice.call(menu.querySelectorAll('a, button'));
  }
  function setOutside(off) {
    [main, footer].forEach(function (el) {
      if (!el) return;
      if (off) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setOutside(true);
    var first = focusables()[0];
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeMenu(returnFocus) {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setOutside(false);
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', function () {
    if (menu.classList.contains('is-open')) closeMenu(false); else openMenu();
  });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeMenu(true); return; }
    if (e.key !== 'Tab') return;
    // keep focus between the menu and its toggle
    var items = [toggle].concat(focusables());
    var i = items.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180 && menu.classList.contains('is-open')) closeMenu(false);
  });

  /* ---------- phone buttons: on desktop go to the contact section ---------- */
  var desktop = window.matchMedia('(hover: hover) and (pointer: fine)');
  function phoneLinks() {
    document.querySelectorAll('a[data-desk]').forEach(function (a) {
      if (!a.dataset.tel) a.dataset.tel = a.getAttribute('href');
      a.setAttribute('href', desktop.matches ? a.dataset.desk : a.dataset.tel);
    });
  }
  phoneLinks();
  if (desktop.addEventListener) desktop.addEventListener('change', phoneLinks);

  /* ---------- before / after ---------- */
  document.querySelectorAll('.ba-frame').forEach(function (frame) {
    var range = frame.querySelector('.ba-range');
    range.addEventListener('input', function () {
      frame.style.setProperty('--ba-pos', range.value + '%');
    });
  });

  /* ---------- Viber: open the app, fall back to the download page ---------- */
  var viber = document.getElementById('viber-link');
  if (viber) {
    viber.addEventListener('click', function (e) {
      e.preventDefault();
      var left = false;
      var onHide = function () { if (document.hidden) left = true; };
      document.addEventListener('visibilitychange', onHide);
      window.location.href = 'viber://chat?number=%2B38978333288';
      setTimeout(function () {
        document.removeEventListener('visibilitychange', onHide);
        if (!left) window.open('https://www.viber.com/en/download/', '_blank', 'noopener');
      }, 1200);
    });
  }

  /* ---------- carousels ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var slides = root.querySelectorAll('.slide');
    var prev = root.querySelector('.car-prev');
    var next = root.querySelector('.car-next');
    var count = root.querySelector('.car-count');
    var frame = root.querySelector('.svc-img, .colo-frame');
    var i = 0, x0 = null;
    function render() {
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('is-active', on);
        if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      count.textContent = pad(i + 1) + ' / ' + pad(slides.length);
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }
    function go(d) { var k = i + d; if (k >= 0 && k < slides.length) { i = k; render(); } }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    frame.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });
    root.querySelectorAll('[data-slide]').forEach(function (li) {
      li.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        i = Number(li.getAttribute('data-slide')); render();
      });
    });
    render();
  });

  /* ---------- opening hours: mark today ---------- */
  var today = document.querySelector('.hours [data-day="' + new Date().getDay() + '"]');
  if (today) today.classList.add('is-today');

  /* ---------- map: load only when asked (Google sets cookies) ---------- */
  var mapFrame = document.querySelector('.map-frame[data-src]');
  if (mapFrame) {
    mapFrame.querySelector('.map-load').addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = mapFrame.getAttribute('data-src');
      f.title = document.documentElement.lang === 'en' ? 'Salon location' : 'Локација на салонот';
      f.setAttribute('loading', 'lazy');
      mapFrame.innerHTML = '';
      mapFrame.appendChild(f);
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
