[根目录](../CLAUDE.md) > **css/**

# 样式模块

## 导航
[返回项目根目录](../CLAUDE.md)

## 模块职责

该目录包含情商训练营的所有样式定义，采用成长树主题设计系统，提供温暖、有趣、有激励感的视觉体验。

---

## 变更记录 (Changelog)

### 2026-01-14
- 完成样式模块文档化
- 新增设计系统说明
- 完善主题与组件文档

---

## 设计理念

### 成长树主题

**设计哲学**: 成长与温暖

情商训练营的视觉设计围绕"成长"这一核心概念展开，通过自然元素的运用（种子、嫩芽、叶子、花朵、太阳、天空、露珠），营造一个温暖、积极、有激励感的学习环境。

**视觉隐喻**:
- 🌱 **种子**: 用户的初始状态
- 🌿 **嫩芽**: 早期成长阶段
- 🍃 **叶子**: 持续进步的象征
- 🌸 **花朵**: 成就与绽放
- ☀️ **太阳**: 正向激励
- 💧 **露珠**: 清新与成长

---

## 文件结构

```
css/
├── style.css       # 主样式文件（成长树主题系统）
└── skills.css      # 技能模块专用样式
```

---

## 主样式文件 (style.css)

### CSS Variables 设计系统

```css
:root {
    /* 自然生长色系 */
    --seed-brown: #8B5A2B;          /* 种子棕色 */
    --sprout-light: #A8D5BA;        /* 浅嫩芽绿 */
    --sprout: #7CB342;              /* 嫩芽绿 */
    --leaf: #4CAF50;                /* 叶子绿 */
    --leaf-dark: #2E7D32;           /* 深叶绿 */
    --bloom-pink: #F48FB1;          /* 花朵粉 */
    --bloom-purple: #CE93D8;        /* 花朵紫 */
    --bloom-orange: #FFAB91;        /* 花朵橙 */
    --sun-yellow: #FFF59D;          /* 太阳黄 */
    --sky-blue: #81D4FA;            /* 天空蓝 */
    --dew-drop: #E1F5FE;            /* 露珠蓝 */

    /* 功能色 */
    --energy-primary: #FF6B6B;      /* 能量红 */
    --energy-secondary: #4ECDC4;    /* 能量青 */
    --achievement-gold: #FFD700;    /* 成就金 */
    --challenge-red: #FF5252;       /* 挑战红 */

    /* 中性色 */
    --paper-cream: #FAF7F2;         /* 纸张米色 */
    --ink-dark: #2C3E50;            /* 墨水深色 */
    --ink-medium: #546E7A;          /* 墨水中色 */
    --ink-light: #90A4AE;           /* 墨水浅色 */
    --mist-white: #FFFFFF;          /* 雾白色 */

    /* 间距系统 */
    --space-xs: 0.4rem;
    --space-sm: 0.8rem;
    --space-md: 1.2rem;
    --space-lg: 2rem;
    --space-xl: 3.2rem;
    --space-xxl: 5rem;

    /* 圆角系统 */
    --round-sm: 8px;
    --round-md: 16px;
    --round-lg: 24px;
    --round-full: 50%;

    /* 阴影 */
    --shadow-soft: 0 4px 20px rgba(44, 62, 80, 0.08);
    --shadow-float: 0 12px 40px rgba(44, 62, 80, 0.12);
    --shadow-glow: 0 0 30px rgba(76, 175, 80, 0.3);
}
```

### 字体系统

```css
/* 字体导入 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=ZCOOL+KuaiLe&display=swap');

/* 字体应用 */
body {
    font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 特殊标题字体 */
h1, h2, .display-text {
    font-family: 'ZCOOL KuaiLe', cursive;
}
```

### 背景设计

```css
/* 渐变背景 */
body {
    background: var(--paper-cream);
    background-image:
        radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 50% 10%, rgba(129, 212, 250, 0.08) 0%, transparent 40%);
    background-attachment: fixed;
}

/* 动态叶子背景 */
body::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: url("data:image/svg+xml,..."); /* 叶子 SVG */
    opacity: 0.6;
    pointer-events: none;
    z-index: -1;
}
```

---

## 核心组件

### Clay Card (黏土卡片)

**设计理念**: 模拟黏土质感，柔软、友好、有深度

```css
.clay-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: var(--round-lg);
    box-shadow:
        0 4px 20px rgba(44, 62, 80, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
    padding: var(--space-lg);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.clay-card:hover {
    transform: translateY(-4px);
    box-shadow:
        0 12px 40px rgba(44, 62, 80, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
```

---

### 按钮系统

#### Primary Button (主要按钮)
```css
.primary-btn {
    background: var(--leaf);
    color: white;
    border: none;
    border-radius: var(--round-md);
    padding: var(--space-sm) var(--space-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.primary-btn:hover {
    background: var(--leaf-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}
```

#### Secondary Button (次要按钮)
```css
.secondary-btn {
    background: var(--dew-drop);
    color: var(--ink-dark);
    border: 2px solid var(--sky-blue);
    border-radius: var(--round-md);
    padding: var(--space-sm) var(--space-lg);
    cursor: pointer;
}
```

#### Neutral Button (中性按钮)
```css
.neutral-btn {
    background: transparent;
    color: var(--ink-medium);
    border: 1px solid var(--ink-light);
    border-radius: var(--round-md);
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
}
```

---

### 标签系统

```css
.tag {
    display: inline-block;
    background: var(--dew-drop);
    color: var(--ink-medium);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--round-sm);
    font-size: 0.85rem;
    font-weight: 500;
}
```

---

### 网格系统

#### Category Grid (分类网格)
```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
}
```

#### Dashboard Grid (仪表盘网格)
```css
.dashboard-grid {
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

---

### 进度组件

#### XP Bar (经验条)
```css
.xp-bar-container {
    width: 100%;
    height: 12px;
    background: #eee;
    border-radius: 6px;
    overflow: hidden;
}

.xp-bar-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.5s ease;
}
```

#### Level Badge (等级徽章)
```css
.level-badge {
    display: inline-flex;
    background: var(--accent-color);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-weight: bold;
}
```

---

### 徽章系统

```css
.badge {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background: var(--dew-drop);
    border-radius: var(--round-md);
}

.badge-icon {
    font-size: 1.5rem;
}

.badge-name {
    font-size: 0.75rem;
    color: var(--ink-medium);
}
```

---

### 训练热力图

```css
.contribution-grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 12px);
    gap: 4px;
}

.contribution-cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background: #eee;
    transition: transform 0.2s ease;
}

.contribution-cell:hover {
    transform: scale(1.3);
}

/* 活跃级别 */
.contribution-cell.level-1 { background: var(--sprout-light); }
.contribution-cell.level-2 { background: var(--sprout); }
.contribution-cell.level-3 { background: var(--leaf); }
```

---

## 技能模块样式 (skills.css)

### 技能卡片

```css
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-xl);
}

.skill-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: var(--round-lg);
    padding: var(--space-lg);
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.skill-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-float);
    border-color: var(--leaf);
}

.skill-icon {
    font-size: 3rem;
    margin-bottom: var(--space-sm);
}

.skill-progress {
    width: 100%;
    height: 8px;
    background: #eee;
    border-radius: 4px;
    overflow: hidden;
    margin-top: var(--space-sm);
}

.skill-progress-fill {
    height: 100%;
    background: var(--leaf);
    transition: width 0.5s ease;
}
```

---

### Tab 系统

```css
.tab-btn {
    padding: var(--space-sm) var(--space-md);
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    color: var(--ink-medium);
    transition: all 0.3s ease;
}

.tab-btn:hover {
    color: var(--leaf);
    background: var(--dew-drop);
}

.tab-btn.active {
    color: var(--leaf);
    border-bottom-color: var(--leaf);
    font-weight: 600;
}
```

---

### 课程列表

```css
.lesson-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    cursor: pointer;
    transition: all 0.3s ease;
}

.lesson-item:hover {
    background: var(--dew-drop);
}

.lesson-item.locked {
    opacity: 0.6;
    cursor: not-allowed;
}

.lesson-number {
    width: 40px;
    height: 40px;
    border-radius: var(--round-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}
```

---

### Toast 消息提示

```css
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    animation: slideIn 0.3s ease;
}

.toast-success { background: #00b894; color: white; }
.toast-error { background: #ff7675; color: white; }
.toast-info { background: #0984e3; color: white; }
```

---

## 响应式设计

### 断点系统

```css
/* 移动设备 */
@media (max-width: 768px) {
    :root {
        --space-lg: 1.5rem;
        --space-xl: 2.5rem;
    }

    .grid-container {
        grid-template-columns: 1fr;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
    .grid-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 桌面设备 */
@media (min-width: 1025px) {
    .grid-container {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

---

## 动画系统

### 关键帧动画

```css
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
}
```

---

## 实用工具类

```css
/* 间距 */
.mt-sm { margin-top: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.p-lg { padding: var(--space-lg); }

/* 文本 */
.text-center { text-align: center; }
.text-muted { color: var(--ink-light); }
.font-bold { font-weight: 700; }

/* 显示 */
.hidden { display: none !important; }
.flex { display: flex; }
.grid { display: grid; }

/* 圆角 */
.rounded-sm { border-radius: var(--round-sm); }
.rounded-md { border-radius: var(--round-md); }
.rounded-full { border-radius: var(--round-full); }
```

---

## 开发指南

### 自定义颜色

修改 CSS Variables 即可自定义主题：

```css
:root {
    /* 替换为主色调 */
    --leaf: #YOUR_COLOR;
    --leaf-dark: #YOUR_DARK_COLOR;

    /* 替换为辅助色 */
    --bloom-pink: #YOUR_ACCENT_COLOR;
}
```

### 添加新组件

1. 在 `style.css` 或 `skills.css` 中定义组件样式
2. 使用 BEM 命名规范
3. 利用 CSS Variables 保持一致性
4. 添加响应式媒体查询
5. 测试暗色模式兼容性（如需要）

---

## 相关文件清单

### 样式文件
- `style.css` - 主样式文件（成长树主题系统）
- `skills.css` - 技能模块专用样式

### 依赖
- Google Fonts (Noto Sans SC, ZCOOL KuaiLe)
- Chart.js (图表样式)

---

*Generated by Claude Code Assistant - 2026-01-14*
