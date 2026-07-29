# Archbloc · Claude Code 工作手册

## 项目基本信息

- 品牌：Archbloc
- 域名：archbloc.com
- 本地仓库：D:\OpenClaw\workspace\archbloc
- GitHub：github.com/Suniceelina/archbloc
- 托管：腾讯云 EdgeOne Pages（GitHub push 后自动部署）
- CMS后台：archbloc.com/static/admin/（Decap CMS）
- 表单：Tally

## 目录结构

```
archbloc/
├─ blog/                    ← 博客文章（每篇独立 .html）
│  └─ post-template.html    ← 新文章必须参考此模板
├─ components/              ← ⚠️ 禁止修改（见下方规则）
│  ├─ head.html
│  ├─ nav.html
│  ├─ footer.html
│  ├─ modals.html
│  ├─ loader.js
│  ├─ page-blocks.css
│  └─ RULES.md
├─ static/admin/            ← Decap CMS，不动
├─ functions/api/           ← GitHub OAuth，不动
├─ index.html
├─ blog.html                ← 博客列表页，新文章需在此添加卡片
├─ signal.html
├─ presence.html
├─ authority.html
├─ method.html
└─ geo-diagnostic.html
```

## ⚠️ 最重要的规则

**不得修改 components/ 目录下任何文件**，除非用户明确说"修改 components/"。

唯一例外：
- 接入百度统计 → 只改 `head.html`
- 接入在线咨询工具 → 只改 `footer.html`

违反此规则会破坏全站样式和结构。

## 设计系统

| 项目 | 值 |
|---|---|
| 背景色 | #ffffff |
| 强调色 | #f97316（橙色） |
| 字体 | Inter |

**CSS 三层分工：**
1. `components/head.html` → 全站基础样式（不动）
2. `components/page-blocks.css` → 公共模块样式（不动）
3. 各页面 `<style>` 块 → 页面私有样式（可改）

新增样式只写在对应页面的 `<style>` 块里，不写到 components。

## Git 工作流

每次修改完成后，按以下顺序提交：

1. 每次只暂存本任务明确修改的文件
2. 禁止默认使用 `git add .`
3. 提交前必须执行：
   - `git status --short`
   - `git diff --check`
   - `git diff --stat`
   - `git diff -- <本次文件>`
4. 使用 `git add <明确文件路径>`
5. 确认没有修改 `components/` 等禁区后再提交

示例：

```bash
cd D:\OpenClaw\workspace\archbloc
git status --short
git diff --check
git diff --stat
git diff -- path/to/file1 path/to/file2

git add path/to/file1 path/to/file2
git commit -m "描述本次改动"
```

push 后 EdgeOne Pages 自动部署，约 1-2 分钟生效。

## 发布新博客文章流程

1. 参考 `blog/post-template.html`，在 `blog/` 目录中创建新的文章 HTML 文件。

文章文件命名规则：`关键词-关键词.html`（英文，用连字符）。

2. 检查文章必须包含：
 - `<title>`
 - `meta description`
 - canonical
 - Open Graph 标签
 - Article Schema
 - 文章需要 FAQ 时添加 FAQPage Schema
 - 导航、页脚及公共组件加载
 - 页面专属样式只能写在当前文章自己的 `<style>` 中

3. 封面图保存到：

 `static/images/uploads/`

 文件名应清晰、稳定，页面引用路径必须与实际文件一致。

4. 在 `blog.html` 添加文章卡片：
 - 填写正确链接、分类、标题、摘要、日期和阅读时间
 - 根据文章重要程度决定放入精选区还是普通列表
 - 精选区卡片数量必须符合当前页面结构
 - 确保同一篇文章在 `blog.html` 中只出现一次
 - 不得只增加 `data-featured="true"`，却仍把卡片放在普通列表中

5. 检查并更新 `index.html` 的“最新洞察”区域：
 - 新文章需要进入首页时，将其放到第一张
 - 首页固定保留 3 篇合适文章
 - 其余两张选择近期或业务价值较高的旧文章
 - 三张卡片必须使用真实文章链接
 - 不得继续保留指向 `#` 或仅指向 `/blog.html` 的占位链接

6. 更新 `sitemap.xml`：
 - 新增文章 URL
 - 不得创建重复 URL
 - 填写或更新文章的 `lastmod`
 - 修改了首页文章区时，同步更新首页 `/` 的 `lastmod`
 - 修改了博客列表时，同步更新 `/blog.html` 的 `lastmod`

7. 提交前必须检查：
 - `git diff --check`
 - `git status --short`
 - `git diff --stat`
 - 检查本次涉及文件的完整 diff
 - Article Schema 可以正常解析
 - FAQPage Schema 可以正常解析（如有）
 - 新文章链接在 `blog.html` 中出现次数正确
 - `index.html` 中的文章链接有效
 - `sitemap.xml` 没有重复 URL
 - `components/` 没有任何意外修改
 - 中文标点、标题、摘要、日期和阅读时间均已检查

8. 只暂存本次明确修改的文件：
 - 禁止默认使用 `git add .`
 - 使用 `git add <明确文件路径>`
 - 提交前再次检查暂存范围

9. commit 后，通过 Windows PowerShell访问 GitHub：
 - 先执行 `ls-remote` 测试网络
 - 测试成功后再 push
 - 使用 Windows 本地代理：
 `http://127.0.0.1:7890`
 - 不要在 WSL 中长时间等待 GnuTLS 或网络超时

10. EdgeOne Pages 自动部署后，等待约 1–3 分钟，并验证：
 - 文章页返回 HTTP 200
 - `blog.html` 已出现新文章
 - 首页“最新洞察”已按计划更新
 - 封面图片返回 HTTP 200
 - `sitemap.xml` 已出现新文章 URL
 - 页面标题、正文、表格、FAQ、CTA 和封面显示正常
 - 桌面端和移动端都要在真实浏览器中检查

11. 缓存判断：
 - 可使用随机查询参数检查新版内容
 - 若带查询参数显示新版、普通网址显示旧版，优先判断为 CDN 或浏览器缓存
 - 可先使用 `Ctrl+F5` 或浏览器禁用缓存重新检查
 - 必要时在 EdgeOne 控制台刷新精确 URL
 - 不得因为缓存问题反复 commit 或 push

12. 完成线上验证后：
 - 更新发布台账
 - 更新草稿 frontmatter
 - 记录发布日期、正式网址和 Git 提交 hash
 - 确认任务完整闭环

简化链路：

```text
文章 HTML
→ 封面图
→ blog.html
→ index.html 最新洞察
→ sitemap.xml
→ 本地检查
→ 精确暂存
→ commit
→ push
→ 线上验证
→ 发布台账
```

## 新文章发布检查清单

- [ ] 文章参考 `blog/post-template.html`
- [ ] 文件名和 slug 正确
- [ ] `title` 和 `meta description` 已填写
- [ ] canonical 与正式网址一致
- [ ] Open Graph 标签已填写
- [ ] Article Schema 可以解析
- [ ] FAQPage Schema 可以解析（如有）
- [ ] 封面图路径、格式和文件名正确
- [ ] 页面专属样式没有重写公共组件
- [ ] `blog.html` 卡片已添加
- [ ] `blog.html` 中同一文章没有重复
- [ ] 精选区与普通列表位置正确
- [ ] `index.html` 最新洞察已评估并更新
- [ ] 首页三张卡片都使用真实文章链接
- [ ] `sitemap.xml` 已更新
- [ ] sitemap URL 没有重复
- [ ] 首页、博客页和文章的 `lastmod` 已按实际修改更新
- [ ] 中文标点、标题、摘要和正文已检查
- [ ] `components/` 零修改
- [ ] 只暂存本任务明确修改的文件
- [ ] 未使用 `git add .`
- [ ] 文章、博客列表、首页、封面均已在线验证
- [ ] 桌面端已进行真实浏览器检查
- [ ] 移动端已进行真实浏览器检查
- [ ] 发布台账与草稿状态已回填

## SEO/GEO 基础设施

每个页面需包含：
- `<title>` 和 `<meta description>`
- OG 标签（og:title / og:description / og:url）
- 适当的 Schema（Organization / Article / FAQ）

sitemap 和 robots.txt 已配置，新页面记得加进 sitemap。

## 业务背景（理解上下文用）

三个服务产品：
- 官网增长诊断：¥4800，交付 SEO+GEO 审计报告
- 整合增长月度合作：¥12000/月
- 全域声量打造：¥28000/月

当前策略：以 archbloc.com 自身作为执行案例，记录过程和数据，用于冷启动获客。

## 常见任务快速参考

**更新博客文章**
→ 新建 `blog/文章名.html` + 更新 `blog.html` + git push

**修改某个服务页内容**
→ 直接编辑对应 .html 页面的内容区域，不动 components

**添加新页面**
→ 复制最近的页面作为模板，修改内容，更新 sitemap.xml

**修复样式问题**
→ 先确认是页面私有样式问题，在页面 `<style>` 块内修改，不动 page-blocks.css
