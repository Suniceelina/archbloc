# Archbloc 样式维护规则

## 改全站公共样式 → 改 head.html
## 改导航/弹窗 → 改 nav.html
## 改页脚 → 改 footer.html
## 改按钮/卡片/区块等通用组件 → 改 page-blocks.css
## 改某页面专属布局 → 只改那个页面自己的 <style>

## 禁止事项
- 禁止在页面 <style> 里重写 :root 变量
- 禁止在页面 <style> 里重写 nav/footer/modal 样式
- 禁止使用单字母缩写类名（.w 除外）
- 新建类名必须先确认 page-blocks.css 里没有等价类
