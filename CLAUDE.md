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

每次修改完成后：

```bash
cd D:\OpenClaw\workspace\archbloc
git add .
git commit -m "描述本次改动"
git push
```

push 后 EdgeOne Pages 自动部署，约 1-2 分钟生效。

## 发布新博客文章流程

1. 参考 `blog/post-template.html` 在 `blog/` 目录新建文章文件
2. 在 `blog.html` 列表页添加对应卡片（标题、描述、链接）
3. git push

文章文件命名规则：`关键词-关键词.html`（英文，用连字符）

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
