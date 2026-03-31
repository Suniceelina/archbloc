# Archbloc 项目上下文 — 小太阳专用

## 项目基本信息
- 品牌名：Archbloc
- 网站：https://archbloc.com
- 定位：帮助国内中小企业做 SEO + GEO 整合增长
- 目标客户：国内中小企业，预算敏感，决策者通常是老板本人
- 核心差异化：方法论公开透明，以自身网站作为案例实战

## 技术栈
- 托管：腾讯云 EdgeOne Pages（GitHub 自动部署）
- CMS：Decap CMS（/static/admin/）
- 表单：Tally
- 本地仓库：D:\OpenClaw\workspace\archbloc
- GitHub：github.com/Suniceelina/archbloc

## 设计系统
- 背景色：#ffffff
- 强调色：#f97316（橙色）
- 字体：Inter
- 重要：不修改 components/ 目录下的任何文件，除非明确说明

## 网站页面清单
- / → 首页
- /signal.html → 入门方案（¥3,800/月）
- /presence.html → 主力方案（¥8,800/月）
- /authority.html → 旗舰方案（¥18,800/月）
- /method.html → 方法论页
- /blog.html → 博客列表
- /blog/geo-visibility-guide.html → GEO指南（已发布）
- /blog/seo-outdated-2025.html → SEO过时动作（已发布）
- /geo-diagnostic.html → 诊断工具页

## SEO 审计基线（2026年3月）
- 综合分：45/100（冷启动阶段）
- 技术健康：62/100
- 内容质量：71/100
- 关键词覆盖：45/100
- GEO可见度：30/100
- 外链权威：15/100
- 已知问题：首页 CTA 死链（# → 需改为 Tally 表单链接）
- 博客文章：2篇（体量不足）
- 百度统计：未接入

## 搜索生态重点
- 主战场：百度（国内目标客户）
- 次要：Google（内容质量背书）
- GEO 目标平台：文心一言、DeepSeek、Kimi、豆包
- 已接入：Google Search Console
- 待接入：百度搜索资源平台、百度统计

## 竞争对手（已知）
- 筋斗云SEO（翼果科技）：seo.yiguotech.com
- 云点SEO：yundianseo.com
- 鸭老师SEO：ylsseo.com

## 内容规范
- 语言：简体中文
- 语气：专业但不卖弄，直接，有观点
- 不承诺排名，强调过程可验证
- 数据引用要标注精确来源（机构名+年份）
- 博客文章结构：问题定义 → 原因分析 → 可执行框架 → 总结

## 审计报告输出规范
- 格式：Markdown
- 必含：总体评分表、分维度评分、问题优先级清单（高/中/低）、90天行动建议
- 存档位置：D:\OpenClaw\workspace\archbloc\reports\
- 命名规范：SEO-audit-YYYY-MM.md

## 执行原则
1. 先读本文件，再执行任务
2. 技术审计结果存档后再输出摘要
3. 每次跑完记录基线变化，便于月度对比
4. 国内平台（百度/文心/DeepSeek）测试优先于国际平台