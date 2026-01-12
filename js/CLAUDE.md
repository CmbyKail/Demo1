# Frontend Logic (JS)

## 导航
[🔙 返回项目根目录](../CLAUDE.md)

## 模块概览
该目录包含前端应用的核心 JavaScript 逻辑，采用 ES Modules 组织代码。

## 关键文件
- **app.js**: 应用主入口，处理路由视角切换、DOM 事件绑定和初始化。
- **ai-service.js**: 负责与后端 API (如 Ark/Doubao) 通信，进行 AI 评分和对话。
- **storage.js**: 封装本地 localStorage 和远程 `/api/storage` 的数据同步逻辑。
- **gamification.js**: 处理经验值 (XP)、等级 (Level) 和徽章系统。
- **analytics.js**: 用户表现数据的统计与可视化逻辑。
- **scenarios.js**: 题库管理。

## 依赖关系
- `chart.js`: 用于绘制雷达图和能力分析图表。

## 接口说明
主要通过 `window` 对象或模块导出暴露功能。
与后端的通信主要发生在 `storage.js` (`/api/storage` 同步) 和 `ai-service.js` (模型推理)。

## 开发规范
- 使用 `async/await` 处理异步操作。
- 模块间通过 `export` / `import` 进行依赖。
