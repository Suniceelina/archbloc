# Archbloc 媒体发稿市场功能规划
## 对标参考：超级媒介（chaojimeijie.com）

---

## 一、功能定位

超级媒介的核心模式：**媒体资源聚合 + 自助筛选下单**。
Archbloc 可以有两种接入方式，定位完全不同：

| 方式 | 定位 | 适用阶段 |
|---|---|---|
| **A. 内嵌功能页** `/media` | 媒体发稿作为服务模块对外展示，辅助主服务销售 | 现阶段 |
| **B. 独立子域名** `media.archbloc.com` | 独立 SaaS 产品，可自助筛选、下单，有自己的用户体系 | 业务规模化后 |

**建议路径：先做 A，验证需求后升级 B。**

---

## 二、方式 A：内嵌功能页 `/media`（推荐现阶段）

### 页面目标
- 展示 Archbloc 的媒体发稿资源库（不需要实时动态，可以是精选列表）
- 降低「我们能发稿」的信任门槛
- 引导客户通过咨询表单提交发稿需求，人工跟进报价

### 页面模块设计

```
/media 页面结构
│
├── Hero：媒体发稿服务 · 权威背书，让 AI 引用你的品牌
│   └── 副文：我们维护精选媒体资源库，覆盖财经/科技/行业垂直媒体
│
├── 数据条：覆盖XX家媒体 · XX个行业分类 · 最快24小时出稿
│
├── 筛选展示模块（静态，无需数据库）
│   ├── 标签筛选：行业分类 / 地区 / 类型（百家号/门户/垂直媒体）
│   ├── 媒体列表卡片：媒体名 + 平台 + 行业 + 简介 + [咨询发稿]按钮
│   └── 注：价格不公开展示，咨询后报价
│
├── 为什么媒体发稿对 SEO/GEO 重要（方法论内容区）
│
└── CTA：提交发稿需求表单（Tally）
```

### 实现方式（无需后端）
- 媒体列表用 JSON 文件存储，JS 前端渲染 + 标签筛选
- 发稿咨询用 Tally 表单收集（媒体方向/行业/目标/联系方式）
- Decap CMS 可以管理媒体列表的 JSON 数据，方便手动更新

### 文件结构
```
/media.html          ← 媒体发稿主页
/media/              ← 目录（可选）
  data.json          ← 媒体资源数据（手动维护）
```

---

## 三、方式 B：独立子域名 `media.archbloc.com`（未来规划）

### 适用条件
- 媒体发稿业务月流水稳定超过 ¥5 万
- 有 3+ 个稳定的媒体资源供应商
- 有能力处理自助下单的客服和交付流程

### 架构设计

```
media.archbloc.com
│
├── 前端：静态 HTML + Alpine.js（轻量交互，无需框架）
│   ├── 媒体搜索 + 多维度筛选（行业/地区/粉丝数/阅读量/价格区间）
│   ├── 媒体详情页（发稿规范/示例/价格/下单）
│   └── 用户后台（订单状态/历史发稿/发票申请）
│
├── 后端：Cloudflare Workers + D1（SQLite）
│   ├── 媒体数据 API
│   ├── 用户认证（已有 /functions/api/auth.js 可复用）
│   └── 订单管理
│
├── 支付：暂用人工收款 → 后期接 Stripe/微信支付
│
└── CMS：Decap CMS 管理媒体数据（复用现有配置）
```

### DNS 配置（腾讯云 DNSPod）
```
media.archbloc.com  CNAME  →  EdgeOne Pages 自定义域名
或
media.archbloc.com  CNAME  →  Cloudflare Pages 独立部署
```

### 数据库设计（D1 基础结构）
```sql
-- 媒体表
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  name TEXT,        -- 媒体名称
  platform TEXT,    -- 百家号/门户/垂直
  industry TEXT,    -- 行业分类（JSON数组）
  region TEXT,      -- 覆盖地区
  followers INT,    -- 粉丝数
  reads INT,        -- 参考阅读数
  notes TEXT,       -- 备注（审核松紧等）
  is_geo INT,       -- 是否适合GEO排名（1/0）
  active INT        -- 是否上架
);

-- 订单表（简化版）
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  media_id TEXT,
  client_contact TEXT,
  title TEXT,
  status TEXT,      -- pending/submitted/published
  created_at TEXT
);
```

---

## 四、现阶段建议执行顺序

```
第 1 阶段（现在）：
└── 在现有网站内 /media.html 做静态展示页
    ├── 精选 20–30 个常用媒体资源，手动维护
    ├── 标签筛选用纯 JS 实现（无需后端）
    └── 发稿咨询走 Tally 表单

第 2 阶段（3–6 个月后，有稳定发稿业务时）：
└── 升级为 media.archbloc.com
    ├── 媒体数量扩展到 100+
    ├── 接入用户登录（复用已有 auth.js）
    └── 订单状态追踪

第 3 阶段（业务成熟后）：
└── 考虑独立 SaaS 产品化
    ├── 媒体自助入驻
    ├── 自动化交付流程
    └── 可供其他 SEO 机构采购
```

---

## 五、与主站的内容协同

- `/media.html` 在导航「服务方案」下拉中作为第四项加入
- 首页 TRUST 区块可加一条：「媒体资源库 · 精选 XX 家媒体，GEO 权威背书」
- 博客文章方向：「为什么媒体发稿是 GEO 优化最被忽视的环节」

---

*文档版本：2026-04 · Archbloc 内部规划*
