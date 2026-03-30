/**
 * /components/loader.js
 * Archbloc component loader + nav/modal init
 */
(function () {
  'use strict';

  var depth = window.location.pathname.split('/').filter(Boolean).length;
  var isFile = window.location.pathname.indexOf('.html') !== -1;
  var dirDepth = isFile ? depth - 1 : depth;
  var prefix = '';
  for (var i = 0; i < dirDepth; i++) prefix += '../';

  function injectHead(html) {
    var frag = document.createRange().createContextualFragment(html);
    document.head.appendChild(frag);
  }

  function injectInto(placeholderId, html) {
    var el = document.getElementById(placeholderId);
    if (!el) return;
    var frag = document.createRange().createContextualFragment(html);
    el.parentNode.replaceChild(frag, el);
  }

  function loadComponent(name, callback) {
    var url = prefix + 'components/' + name + '.html';
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('[Archbloc] Failed: ' + url + ' (' + res.status + ')');
        return res.text();
      })
      .then(callback)
      .catch(function (err) { console.error(err); });
  }

  // global modal helpers
  window.openModal = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    el.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(function (f) {
      f.src = f.dataset.tallySrc;
    });
  };

  window.closeModal = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
  };

  function initNav() {
    var btn = document.querySelector('.nav-menu-btn');
    var nav = document.querySelector('.nav-links');
    if (!btn || !nav) return;

    function closeAllDropdowns() {
      nav.querySelectorAll('.has-dropdown').forEach(function (l) { l.classList.remove('dd-open'); });
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = nav.classList.contains('nav-open');
      nav.classList.toggle('nav-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) closeAllDropdowns();
    });

    nav.querySelectorAll('.has-dropdown > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.matchMedia('(hover:hover)').matches) return;
        e.preventDefault();
        e.stopPropagation();
        var li = a.parentElement;
        var wasOpen = li.classList.contains('dd-open');
        closeAllDropdowns();
        if (!wasOpen) li.classList.add('dd-open');
      });
    });

    nav.querySelectorAll('a').forEach(function (a) {
      if (a.parentElement.classList.contains('has-dropdown')) return;
      a.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
      }
    });

    var path = window.location.pathname;
    nav.querySelectorAll('a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var aPath = href.split('?')[0].split('#')[0];
      if (aPath === path || (path === '/' && aPath === '/')) a.classList.add('active');
    });
  }

  function initModal() {
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) window.closeModal(overlay.id);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (m) { window.closeModal(m.id); });
      }
    });
  }

  loadComponent('head', injectHead);

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    loadComponent('nav', function (html) {
      injectInto('nav-placeholder', html);
      initNav();
      initModal();
    });

    loadComponent('footer', function (html) {
      injectInto('footer-placeholder', html);
      if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
      } else {
        document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(function (f) {
          f.src = f.dataset.tallySrc;
        });
      }
    });

    loadComponent('modals', function (html) {
      injectInto('modals-placeholder', html);
      if (typeof Tally !== 'undefined') {
        Tally.loadEmbeds();
      } else {
        document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach(function (f) {
          f.src = f.dataset.tallySrc;
        });
      }
    });
  });
})();
