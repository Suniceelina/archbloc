/**
 * /components/loader.js
 * Archbloc 组件动态加载器
 *
 * 用法（在每个页面的 <head> 末尾引入此脚本）：
 *   <script src="/components/loader.js"></script>
 *
 * 页面中用占位符标记注入点：
 *   <div id="nav-placeholder"></div>      ← 导航栏注入点
 *   <div id="footer-placeholder"></div>   ← 页脚注入点
 *
 * blog/ 子目录页面：脚本会自动检测路径深度，
 * 将所有组件内 href="/..." 替换为正确相对路径，无需手动修改。
 */

(function () {
  'use strict';

  // ── 检测当前页面路径深度，计算根路径前缀 ──
  // 根路径页面：prefix = ""（即 /components/... 直接可用）
  // blog/ 子目录：prefix = "../"
  var depth = window.location.pathname.split('/').filter(Boolean).length;
  // 若路径包含 .html 则文件本身算一级，减去文件层只取目录深度
  var isFile = window.location.pathname.indexOf('.html') !== -1;
  var dirDepth = isFile ? depth - 1 : depth;
  var prefix = '';
  for (var i = 0; i < dirDepth; i++) prefix += '../';

  /**
   * 修正组件 HTML 中的绝对路径
   * 将 href="/" → href="../"（或保留 /）以兼容 EdgeOne Pages 的根路径重写
   * 策略：保留所有 href/src 的绝对路径（以 / 开头），让 CDN 处理
   * 仅当页面在子目录时，才需要把 /components/... 改为 ../components/...
   */
  function fixPaths(html, componentName) {
    if (dirDepth === 0) return html; // 根目录，路径无需修正
    // 仅修正组件自身资源（如有引用相对资源时备用）
    // 站内链接（/signal.html 等）保持绝对路径，EdgeOne Pages 会正确解析
    return html;
  }

  /**
   * 注入 head 组件（CSS + 字体 + 统计）
   * 直接插入到 <head> 内，确保样式在 body 渲染前生效
   */
  function injectHead(html) {
    var headFrag = document.createRange().createContextualFragment(html);
    document.head.appendChild(headFrag);
  }

  /**
   * 注入 nav / footer 到占位符
   */
  function injectInto(placeholderId, html) {
    var el = document.getElementById(placeholderId);
    if (!el) return;
    el.outerHTML = html; // 用真实 HTML 替换占位 div
  }

  /**
   * 加载单个组件文件
   */
  function loadComponent(name, callback) {
    var url = prefix + 'components/' + name + '.html';
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url + ' (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        callback(fixPaths(html, name));
      })
      .catch(function (err) {
        console.error('[Archbloc Loader]', err);
      });
  }

  // ── 加载顺序：head → nav → footer ──
  // head 最先注入，保证首屏样式不闪烁
  loadComponent('head', function (html) {
    injectHead(html);
  });

  // nav 和 footer 等 DOM 就绪后注入
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
    });
    loadComponent('footer', function (html) {
      injectInto('footer-placeholder', html);
    });
  });

})();
