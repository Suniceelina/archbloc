/**
 * /components/loader.js
 * Archbloc 组件动态加载器 v2
 *
 * 修复：nav 注入后立即初始化交互，不依赖 DOMContentLoaded（异步注入时已触发过）
 */

(function () {
  'use strict';

  // ── 路径深度检测（blog/ 子目录自动处理）──
  var depth = window.location.pathname.split('/').filter(Boolean).length;
  var isFile = window.location.pathname.indexOf('.html') !== -1;
  var dirDepth = isFile ? depth - 1 : depth;
  var prefix = '';
  for (var i = 0; i < dirDepth; i++) prefix += '../';

  // ── 注入 <head> 组件 ──
  function injectHead(html) {
    var frag = document.createRange().createContextualFragment(html);
    document.head.appendChild(frag);
  }

  // ── 注入 nav / footer 到占位符 ──
  function injectInto(placeholderId, html) {
    var el = document.getElementById(placeholderId);
    if (!el) return;
    var frag = document.createRange().createContextualFragment(html);
    el.parentNode.replaceChild(frag, el);
  }

  // ── fetch 组件 ──
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

  // ── Nav 交互初始化（nav 注入后立即调用）──
  function initNav() {
    var btn = document.querySelector('.nav-menu-btn');
    var nav = document.querySelector('.nav-links');
    if (!btn || !nav) return;

    function closeAllDropdowns() {
      nav.querySelectorAll('.has-dropdown').forEach(function (l) { l.classList.remove('dd-open'); });
    }

    // 汉堡开关
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = nav.classList.contains('nav-open');
      nav.classList.toggle('nav-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) closeAllDropdowns();
    });

    // 手机端服务方案下拉（桌面用 CSS hover 处理）
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

    // 点击普通链接关闭菜单
    nav.querySelectorAll('a').forEach(function (a) {
      if (a.parentElement.classList.contains('has-dropdown')) return;
      a.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
      });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
        closeAllDropdowns();
      }
    });

    // 当前页面导航高亮
    var path = window.location.pathname;
    nav.querySelectorAll('a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var aPath = href.split('?')[0].split('#')[0];
      if (aPath === path || (path === '/' && aPath === '/')) a.classList.add('active');
    });
  }

  // ── Modal 关闭绑定（nav 注入后调用）──
  function initModal() {
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (m) { closeModal(m.id); });
      }
    });
  }

  // ── 加载顺序：head → (DOM就绪) → nav → footer ──
  loadComponent('head', injectHead);

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    // nav 注入后立即初始化，不等任何事件
    loadComponent('nav', function (html) {
      injectInto('nav-placeholder', html);
      initNav();
      initModal();
    });

    // footer 注入后触发 Tally embed
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
  });

})();
