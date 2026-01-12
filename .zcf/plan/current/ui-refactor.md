# 计划：UI 重构与导航修复 (Edu-Clay)

## 目标
将 EQ Trainer 的 UI 升级为 "Edu-Clay" 风格（教育类、亲和力强），并修复欢迎页面的导航问题，确保用户能轻松开始训练。

## 上下文
- **风格参考**：`ui-ux-pro-max` 资源库 (Item 10 Colors, Item 6/45 Typography).
- **配色**：
    - Primary: `#4F46E5` (Indigo 600)
    - Secondary: `#818CF8` (Indigo 400)
    - Accent: `#F97316` (Orange 500)
    - Bg: `#EEF2FF` (Indigo 50)
- **字体**：`Fredoka` (Heading), `Nunito` (Body).

## 执行步骤

### 1. 引入字体与图标
- [ ] **文件**: `index.html`
- [ ] **操作**: 添加 Google Fonts 链接 (`Fredoka:wght@300..700`, `Nunito:wght@300..700`).
- [ ] **操作**: 确保 Emoji 或图标库可用（目前使用 Emoji，保持不变，但增加尺寸）。

### 2. 重构 CSS 基础 (Edu-Clay Theme)
- [ ] **文件**: `css/style.css`
- [ ] **操作**: 更新 `:root` 变量。
- [ ] **操作**: 重写 `body` 样式（背景色、字体）。
- [ ] **操作**: 优化 `.clay-card`（更细腻的阴影，白色背景）。
- [ ] **操作**: 更新按钮样式（Orange CTA with hover lift）。

### 3. 重构欢迎页布局 (Dashboard)
- [ ] **文件**: `index.html`
- [ ] **操作**: 将 `category-list` 移到页面核心位置（Hero区域）。
- [ ] **操作**: 增加 "Start Your Journey" 标题。
- [ ] **操作**: 调整 Gamification 和 Stats 的布局（作为辅助信息）。

### 4. 增强类别卡片 (Navigation Fix)
- [ ] **文件**: `js/app.js`
- [ ] **操作**: 更新 `renderCategories` 函数。
- [ ] **操作**: 生成的 HTML 应包含：大图标、标题、简短描述（可选）、以及一个显式的 "开始" 按钮（即使整个卡片可点，按钮能提供明确的视觉引导）。
- [ ] **验证**: 确保点击事件正确冒泡。

## 状态追踪
- 当前阶段：执行
- 开始时间：2026-01-10 14:00:00
