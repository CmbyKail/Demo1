# 高级技能模块实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为情商训练系统新增4个高级技能训练模块（幽默表达、高情商反击、影响力与说服、反操纵与拒绝），每个模块采用"理论→练习→实战"三步训练法。

**Architecture:** 在现有6大场景类别基础上，新增独立的技能训练模块。复用现有的API配置、LocalStorage存储、Claymorphism UI风格，扩展路由系统和评分Prompt。

**Tech Stack:** HTML5, CSS3, 原生JavaScript (ES Modules), Python http.server, LocalStorage, OpenAI-compatible API

---

## Phase 1: 基础架构搭建 (Week 1)

### Task 1: 创建技能模块目录结构

**Files:**
- Create: `js/modules/skills/` (目录)
- Create: `css/skills.css`
- Create: `server_data.json` (扩展，新增skillModules字段)

**Step 1: 创建目录结构**

```bash
mkdir -p "E:/Homework/Java_Homework/finalwork/js/modules/skills"
```

**Step 2: 创建skills.css文件**

```css
/* css/skills.css - 技能模块专用样式 */

/* 技能卡片网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.skill-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.skill-level {
  font-size: 0.85rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.skill-progress {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 技能专属进度条颜色 */
.skill-humor .skill-progress-fill { background: linear-gradient(90deg, #FF9800, #FFC107); }
.skill-retaliation .skill-progress-fill { background: linear-gradient(90deg, #E91E63, #9C27B0); }
.skill-influence .skill-progress-fill { background: linear-gradient(90deg, #2196F3, #00BCD4); }
.skill-antipua .skill-progress-fill { background: linear-gradient(90deg, #4CAF50, #009688); }
```

**Step 3: 扩展server_data.json**

在 `server_data.json` 中添加：

```json
{
  "skillModules": {
    "humor": {
      "id": "humor",
      "name": "幽默表达",
      "icon": "💬",
      "description": "学习幽默机制，掌握搞笑技巧",
      "theoryLessons": [],
      "exercises": [],
      "scenarios": []
    },
    "retaliation": {
      "id": "retaliation",
      "name": "高情商反击",
      "icon": "⚔️",
      "description": "骂人不带脏字，优雅地回击",
      "theoryLessons": [],
      "exercises": [],
      "scenarios": []
    },
    "influence": {
      "id": "influence",
      "name": "影响力与说服",
      "icon": "💪",
      "description": "健康的说服技巧（销售/恋爱/职场）",
      "theoryLessons": [],
      "exercises": [],
      "scenarios": []
    },
    "anti_pua": {
      "id": "anti_pua",
      "name": "反操纵与拒绝",
      "icon": "🛡️",
      "description": "识别PUA，建立边界，优雅说不",
      "theoryLessons": [],
      "exercises": [],
      "scenarios": []
    }
  }
}
```

**Step 4: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add css/skills.css js/modules/skills/ server_data.json
git commit -m "feat(phase1): create skill module directory structure and base styles"
```

---

### Task 2: 扩展app.js路由系统

**Files:**
- Modify: `js/app.js:1-50` (导入部分)
- Modify: `js/app.js:100-200` (路由函数)

**Step 1: 在index.html中引入新CSS**

```html
<!-- 在 <head> 中，css/style.css 后面添加 -->
<link rel="stylesheet" href="css/skills.css">
```

**Step 2: 在app.js顶部添加技能模块导入**

在 `js/app.js` 的导入部分添加：

```javascript
// 技能模块
import { SkillModuleManager } from './modules/skills/SkillModuleManager.js';
import { HumorModule } from './modules/skills/HumorModule.js';
```

**Step 3: 扩展路由系统**

在 `showView()` 函数中添加新的view类型：

```javascript
// 在 showView 函数的 switch 语句中添加
case 'skill-module':
  showSkillModuleView(viewData.moduleId);
  break;
case 'skill-theory':
  showTheoryView(viewData.moduleId, viewData.lessonId);
  break;
case 'skill-practice':
  showPracticeView(viewData.moduleId, viewData.practiceType);
  break;
case 'skill-realworld':
  showRealWorldView(viewData.moduleId);
  break;
```

**Step 4: 添加新的视图显示函数**

在 `js/app.js` 中添加：

```javascript
// 显示技能模块主界面
function showSkillModuleView(moduleId) {
  const module = SkillModuleManager.getModule(moduleId);
  if (!module) {
    console.error('Module not found:', moduleId);
    return;
  }

  // 渲染技能模块界面（后面实现）
  renderSkillModuleInterface(module);
}

// 显示理论课界面
function showTheoryView(moduleId, lessonId) {
  const lesson = SkillModuleManager.getLesson(moduleId, lessonId);
  if (!lesson) return;

  renderTheoryInterface(lesson);
}

// 显示练习界面
function showPracticeView(moduleId, practiceType) {
  renderPracticeInterface(moduleId, practiceType);
}

// 显示实战界面
function showRealWorldView(moduleId) {
  renderRealWorldInterface(moduleId);
}
```

**Step 5: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add index.html js/app.js
git commit -m "feat(phase1): extend routing system for skill modules"
```

---

### Task 3: 创建SkillModuleManager核心类

**Files:**
- Create: `js/modules/skills/SkillModuleManager.js`

**Step 1: 创建文件并编写基础结构**

```javascript
// js/modules/skills/SkillModuleManager.js

/**
 * 技能模块管理器
 * 负责加载和管理所有技能模块的数据
 */
class SkillModuleManager {
  constructor() {
    this.modules = {};
    this.progress = this.loadProgress();
  }

  /**
   * 从服务器加载模块数据
   */
  async loadModules() {
    try {
      const response = await fetch('/server_data.json');
      const data = await response.json();
      this.modules = data.skillModules || {};
      return this.modules;
    } catch (error) {
      console.error('Failed to load skill modules:', error);
      return {};
    }
  }

  /**
   * 获取所有模块
   */
  getAllModules() {
    return Object.values(this.modules);
  }

  /**
   * 根据ID获取模块
   */
  getModule(moduleId) {
    return this.modules[moduleId];
  }

  /**
   * 获取指定课程
   */
  getLesson(moduleId, lessonId) {
    const module = this.getModule(moduleId);
    if (!module) return null;

    return module.theoryLessons.find(l => l.id === lessonId);
  }

  /**
   * 加载用户进度
   */
  loadProgress() {
    const saved = localStorage.getItem('skillProgress');
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * 保存用户进度
   */
  saveProgress() {
    localStorage.setItem('skillProgress', JSON.stringify(this.progress));
  }

  /**
   * 更新模块进度
   */
  updateModuleProgress(moduleId, data) {
    if (!this.progress[moduleId]) {
      this.progress[moduleId] = {
        completedLessons: [],
        exerciseScores: {},
        scenarioCount: 0,
        averageScore: 0,
        level: 1,
        xp: 0
      };
    }

    Object.assign(this.progress[moduleId], data);
    this.saveProgress();
    return this.progress[moduleId];
  }

  /**
   * 获取模块进度
   */
  getModuleProgress(moduleId) {
    return this.progress[moduleId] || null;
  }

  /**
   * 标记课程为已完成
   */
  completeLesson(moduleId, lessonId) {
    const progress = this.getModuleProgress(moduleId);
    if (progress && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.xp += 50; // 每节课50经验
      this.saveProgress();
    }
  }

  /**
   * 记录练习分数
   */
  recordExerciseScore(moduleId, exerciseId, score) {
    const progress = this.getModuleProgress(moduleId);
    if (progress) {
      progress.exerciseScores[exerciseId] = score;
      progress.xp += Math.floor(score / 2); // 分数转换为经验

      // 计算平均分
      const scores = Object.values(progress.exerciseScores);
      progress.averageScore = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      );

      this.saveProgress();
    }
  }
}

// 导出单例
export const skillManager = new SkillModuleManager();
export { SkillModuleManager };
```

**Step 2: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add js/modules/skills/SkillModuleManager.js
git commit -m "feat(phase1): implement SkillModuleManager core class"
```

---

### Task 4: 创建技能模块UI渲染器

**Files:**
- Create: `js/modules/skills/SkillModuleRenderer.js`

**Step 1: 创建渲染器类**

```javascript
// js/modules/skills/SkillModuleRenderer.js

import { skillManager } from './SkillModuleManager.js';

/**
 * 技能模块UI渲染器
 */
class SkillModuleRenderer {
  /**
   * 在主页渲染技能卡片
   */
  renderSkillCards(container) {
    const modules = skillManager.getAllModules();

    const html = `
      <div class="section-title">🚀 高级技能训练</div>
      <div class="skills-grid">
        ${modules.map(module => this.renderSkillCard(module)).join('')}
      </div>
    `;

    container.innerHTML = html;
    this.attachSkillCardEvents();
  }

  /**
   * 渲染单个技能卡片
   */
  renderSkillCard(module) {
    const progress = skillManager.getModuleProgress(module.id);
    const level = progress?.level || 1;
    const xp = progress?.xp || 0;
    const nextLevelXp = level * 500;
    const progressPercent = Math.min((xp / nextLevelXp) * 100, 100);

    return `
      <div class="skill-card skill-${module.id}" data-module-id="${module.id}">
        <div class="skill-icon">${module.icon}</div>
        <div class="skill-name">${module.name}</div>
        <div class="skill-level">Lv.${level}</div>
        <div class="skill-progress">
          <div class="skill-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>
    `;
  }

  /**
   * 附加技能卡片点击事件
   */
  attachSkillCardEvents() {
    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('click', () => {
        const moduleId = card.dataset.moduleId;
        this.navigateToModule(moduleId);
      });
    });
  }

  /**
   * 导航到模块详情页
   */
  navigateToModule(moduleId) {
    // 切换到技能模块视图
    window.app.showView('skill-module', { moduleId });
  }

  /**
   * 渲染技能模块主界面（三Tab布局）
   */
  renderSkillModuleInterface(module) {
    const main = document.getElementById('app');

    main.innerHTML = `
      <section id="skill-module-view" class="view active">
        <div class="module-header">
          <button class="back-btn" onclick="window.app.showView('welcome')">← 返回</button>
          <h2>${module.icon} ${module.name}</h2>
          <p>${module.description}</p>
        </div>

        <div class="module-tabs">
          <button class="tab-btn active" data-tab="theory">📚 理论</button>
          <button class="tab-btn" data-tab="practice">✏️ 练习</button>
          <button class="tab-btn" data-tab="realworld">🎮 实战</button>
        </div>

        <div id="tab-content" class="tab-content">
          <!-- 内容由各Tab自行渲染 -->
        </div>
      </section>
    `;

    this.attachTabEvents(module.id);
    this.renderTheoryTab(module.id); // 默认显示理论Tab
  }

  /**
   * 附加Tab切换事件
   */
  attachTabEvents(moduleId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 移除所有active状态
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        // 添加当前active状态
        e.target.classList.add('active');

        const tab = e.target.dataset.tab;
        const content = document.getElementById('tab-content');

        switch(tab) {
          case 'theory':
            this.renderTheoryTab(moduleId);
            break;
          case 'practice':
            this.renderPracticeTab(moduleId);
            break;
          case 'realworld':
            this.renderRealWorldTab(moduleId);
            break;
        }
      });
    });
  }

  /**
   * 渲染理论课Tab
   */
  renderTheoryTab(moduleId) {
    const module = skillManager.getModule(moduleId);
    const progress = skillManager.getModuleProgress(moduleId);

    const content = document.getElementById('tab-content');

    if (!module.theoryLessons || module.theoryLessons.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <p>📚 理论课程正在筹备中...</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="theory-layout">
        <div class="lesson-list">
          ${module.theoryLessons.map((lesson, index) => {
            const isCompleted = progress?.completedLessons?.includes(lesson.id);
            return `
              <div class="lesson-item ${isCompleted ? 'completed' : ''}" data-lesson-id="${lesson.id}">
                <span class="lesson-status">${isCompleted ? '✓' : (index + 1)}</span>
                <span class="lesson-title">${lesson.title}</span>
              </div>
            `;
          }).join('')}
        </div>
        <div class="lesson-content">
          <p class="lesson-placeholder">← 选择左侧课程开始学习</p>
        </div>
      </div>
    `;

    this.attachLessonEvents(moduleId);
  }

  /**
   * 附加课程点击事件
   */
  attachLessonEvents(moduleId) {
    document.querySelectorAll('.lesson-item').forEach(item => {
      item.addEventListener('click', () => {
        const lessonId = item.dataset.lessonId;
        this.showLessonContent(moduleId, lessonId);
      });
    });
  }

  /**
   * 显示课程内容
   */
  showLessonContent(moduleId, lessonId) {
    const lesson = skillManager.getLesson(moduleId, lessonId);
    if (!lesson) return;

    const contentContainer = document.querySelector('.lesson-content');

    contentContainer.innerHTML = `
      <h3>${lesson.title}</h3>
      <div class="lesson-body">${lesson.content}</div>

      ${lesson.examples ? `
        <div class="lesson-examples">
          <h4>案例对比</h4>
          ${lesson.examples.map(ex => `
            <div class="example-comparison">
              <div class="example-bad">
                <span class="label">❌ 普通回答</span>
                <p>${ex.bad}</p>
              </div>
              <div class="example-good">
                <span class="label">✅ 高手回答</span>
                <p>${ex.good}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="lesson-actions">
        <button class="primary-btn complete-lesson-btn" data-lesson-id="${lessonId}">
          标记为已学完
        </button>
      </div>
    `;

    // 附加完成按钮事件
    document.querySelector('.complete-lesson-btn').addEventListener('click', (e) => {
      skillManager.completeLesson(moduleId, lessonId);
      e.target.textContent = '✓ 已完成';
      e.target.disabled = true;
      this.renderTheoryTab(moduleId); // 刷新列表
    });
  }

  /**
   * 渲染练习Tab
   */
  renderPracticeTab(moduleId) {
    const module = skillManager.getModule(moduleId);
    const progress = skillManager.getModuleProgress(moduleId);

    // 检查是否解锁（需要完成至少1节理论课）
    const unlocked = progress?.completedLessons?.length > 0;

    const content = document.getElementById('tab-content');

    if (!unlocked) {
      content.innerHTML = `
        <div class="locked-state">
          <p>🔒 请先完成至少1节理论课来解锁练习模式</p>
        </div>
      `;
      return;
    }

    if (!module.exercises || module.exercises.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <p>✏️ 练习题正在筹备中...</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="practice-layout">
        <div class="practice-header">
          <h3>练习模式</h3>
          <p>完成 ${progress.completedLessons.length} 节课程，解锁练习权限</p>
        </div>

        <div class="exercise-list">
          ${module.exercises.map(ex => `
            <div class="exercise-item" data-exercise-id="${ex.id}">
              <span class="exercise-type">${this.getExerciseTypeLabel(ex.type)}</span>
              <span class="exercise-prompt">${ex.prompt}</span>
              <button class="start-exercise-btn">开始练习</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * 获取练习类型标签
   */
  getExerciseTypeLabel(type) {
    const labels = {
      'complete_sentence': '句子补全',
      'rewrite': '改写练习',
      'match': '配对游戏',
      'identify': '识别攻击',
      'select_strategy': '选择策略',
      'complete_retaliation': '补全反击',
      'identify_principle': '识别原则',
      'design_strategy': '设计策略',
      'fill_script': '话术填空',
      'identify_manipulation': '识别操纵',
      'analyze_technique': '拆解手法',
      'design_refusal': '设计拒绝'
    };
    return labels[type] || type;
  }

  /**
   * 渲染实战Tab
   */
  renderRealWorldTab(moduleId) {
    const module = skillManager.getModule(moduleId);
    const progress = skillManager.getModuleProgress(moduleId);

    // 检查是否解锁（需要完成80%练习）
    const totalExercises = module.exercises?.length || 0;
    const completedExercises = Object.keys(progress?.exerciseScores || {}).length;
    const unlocked = totalExercises > 0 && completedExercises / totalExercises >= 0.8;

    const content = document.getElementById('tab-content');

    if (!unlocked) {
      content.innerHTML = `
        <div class="locked-state">
          <p>🔒 需要完成80%的练习题才能解锁实战模式</p>
          <p>当前进度: ${completedExercises}/${totalExercises}</p>
        </div>
      `;
      return;
    }

    if (!module.scenarios || module.scenarios.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <p>🎮 实战场景正在筹备中...</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="realworld-layout">
        <h3>实战演练</h3>
        <p>与AI进行多轮对话，检验你的技能掌握程度</p>

        <div class="scenario-list">
          ${module.scenarios.map(scenario => `
            <div class="scenario-card" data-scenario-id="${scenario.id}">
              <h4>${scenario.title}</h4>
              <p>${scenario.description}</p>
              <button class="start-scenario-btn">开始实战</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

export { SkillModuleRenderer };
```

**Step 2: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add js/modules/skills/SkillModuleRenderer.js
git commit -m "feat(phase1): implement SkillModuleRenderer for UI rendering"
```

---

### Task 5: 集成到主页

**Files:**
- Modify: `js/app.js` (在主页渲染部分添加技能卡片)

**Step 1: 在app.js中导入渲染器**

```javascript
// 在导入部分添加
import { SkillModuleRenderer } from './modules/skills/SkillModuleRenderer.js';
import { skillManager } from './modules/skills/SkillModuleManager.js';
```

**Step 2: 初始化技能模块**

在 `app.js` 的初始化部分添加：

```javascript
// 在 DOMContentLoaded 或 app 初始化函数中
async function initSkillModules() {
  await skillManager.loadModules();

  const renderer = new SkillModuleRenderer();

  // 在欢迎页面的类别列表后插入技能卡片
  const categoryList = document.getElementById('category-list');
  if (categoryList) {
    const skillsSection = document.createElement('div');
    skillsSection.id = 'skills-section';
    categoryList.after(skillsSection);
    renderer.renderSkillCards(skillsSection);
  }
}

// 调用初始化
initSkillModules();
```

**Step 3: 在全局暴露app对象中的showView方法**

确保 `window.app.showView` 可以处理新的view类型。

**Step 4: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add js/app.js
git commit -m "feat(phase1): integrate skill modules into main page"
```

---

## Phase 2: 幽默模块开发 (Week 2-3)

### Task 6: 创建幽默模块理论课内容

**Files:**
- Create: `js/modules/skills/HumorModule.js` (数据文件)
- Modify: `server_data.json` (填充humor模块数据)

**Step 1: 创建HumorModule数据**

在 `server_data.json` 的 `skillModules.humor.theoryLessons` 中添加：

```json
{
  "skillModules": {
    "humor": {
      "theoryLessons": [
        {
          "id": "humor_01",
          "title": "机制一：意外性 - 铺垫与反转",
          "content": `
            <h4>什么是意外性机制？</h4>
            <p>幽默的核心是"打破预期"。你先建立一个预期（铺垫），然后用意想不到的方式反转它。</p>

            <h4>为什么有效？</h4>
            <p>大脑预测下一步时，如果你打破这个预测，会引发"惊讶→理解→愉悦"的情绪反应。</p>

            <h4>如何运用？</h4>
            <ol>
              <li><strong>建立预期</strong>：让对方以为你要说A</li>
              <li><strong>延迟揭晓</strong>：稍微停顿，加深预期</li>
              <li><strong>突然反转</strong>：说出B，但B和A有逻辑关联</li>
            </ol>
          `,
          "examples": [
            {
              "bad": "今天地铁好挤",
              "good": "今天地铁挤到我跟陌生人不仅是熟人，还差点交换了DNA"
            },
            {
              "bad": "我很穷",
              "good": "我的钱包像洋葱，每次打开都让我想哭"
            }
          ]
        },
        {
          "id": "humor_02",
          "title": "机制二：共情 - 自嘲与观察",
          "content": `
            <h4>自嘲的力量</h4>
            <p>拿自己开玩笑是最安全的幽默方式。它展示自信，让对方放松戒备。</p>

            <h4>观察式幽默</h4>
            <p>发现生活中荒谬但真实的小细节。好的观察能让对方说"对！就是这样！"</p>

            <h4>注意</h4>
            <ul>
              <li>自嘲要轻松，不要过度贬低自己</li>
              <li>观察要善意，不要伤害他人</li>
            </ul>
          `,
          "examples": [
            {
              "bad": "我不擅长运动",
              "good": "我运动神经坏死到什么程度？走路能被自己的脚绊倒"
            },
            {
              "bad": "开会很无聊",
              "good": "这个会议的精彩程度，让我怀念起看 paint dry 的时光"
            }
          ]
        },
        {
          "id": "humor_03",
          "title": "技巧三：语言艺术 - 夸张、比喻、双关",
          "content": `
            <h4>夸张法</h4>
            <p>把事物放大或缩小到荒谬的程度。记住：越是夸张，越要夸张得有创意。</p>

            <h4>比喻法</h4>
            <p>把A比作B，但B和A要有关联，且B要出人意料。</p>

            <h4>双关/谐音</h4>
            <p>利用词语的多义性或谐音制造笑点。中文的双关非常丰富！</p>
          `,
          "examples": [
            {
              "bad": "他吃得多",
              "good": "他吃的不是饭，是寂寞"
            },
            {
              "bad": "老板说话难听",
              "good": "老板的话像裹着糖霜的刀片，甜到一半发现自己在流血"
            }
          ]
        }
      ]
    }
  }
}
```

**Step 2: 添加练习题**

```json
{
  "exercises": [
    {
      "id": "humor_ex_01",
      "type": "complete_sentence",
      "prompt": "老板说周末要加班，你半开玩笑地回应：",
      "answer": "",
      "skill": ["意外性", "夸张"],
      "hint": "试着用夸张的手法，但不要太尖锐"
    },
    {
      "id": "humor_ex_02",
      "type": "complete_sentence",
      "prompt": "约会时对方问你为什么单身，你幽默地回答：",
      "answer": "",
      "skill": ["自嘲"],
      "hint": "用自嘲化解尴尬，但不要过度贬低自己"
    },
    {
      "id": "humor_ex_03",
      "type": "rewrite",
      "prompt": "把这句话改成幽默版：'今天上班迟到了'",
      "original": "今天上班迟到了",
      "answer": "",
      "skill": ["比喻", "意外性"],
      "hint": "用一个出人意料的比喻"
    }
  ]
}
```

**Step 3: 添加实战场景**

```json
{
  "scenarios": [
    {
      "id": "humor_scenario_01",
      "title": "聚会破冰",
      "description": "你在朋友的聚会上，周围都是陌生人。用幽默的方式主动打破尴尬，让大家放松下来。",
      "role": "一群陌生人，有的在玩手机，有的尴尬地微笑",
      "goal": "说1-2句话让大家笑，并打开话匣子",
      "difficulty": "简单"
    },
    {
      "id": "humor_scenario_02",
      "title": "化解尴尬",
      "description": "你在会议上说错话了，全场突然安静。用幽默的方式自救。",
      "role": "老板和同事都在看你",
      "goal": "用一个玩笑让大家放松，同时承认自己的失误",
      "difficulty": "中等"
    }
  ]
}
```

**Step 4: 创建HumorModule.js**

```javascript
// js/modules/skills/HumorModule.js

/**
 * 幽默表达模块
 */
export class HumorModule {
  static MODULE_ID = 'humor';

  /**
   * 获取评分Prompt
   */
  static getScoringPrompt(userAnswer) {
    return `
你是一个幽默感评估专家。评估用户的回答：${userAnswer}

评分维度（每项0-100分）：
1. 意外性（30%）：是否打破预期，有反转
2. 适切性（25%）：是否适合场合，不冒犯他人
3. 创意性（25%）：是否有新意，不老套
4. 表达自然度（20%）：是否自然流畅，不生硬

请以JSON格式返回：
{
  "score": 总分（0-100）,
  "dimensionScores": {
    "unexpectedness": 分数,
    "appropriateness": 分数,
    "creativity": 分数,
    "naturalness": 分数
  },
  "feedback": "简短评价（100字内）",
  "highlights": ["亮点1", "亮点2"],
  "suggestions": ["改进建议1", "改进建议2"],
  "betterAnswer": "更幽默的回答示例"
}
`;
  }

  /**
   * 获取对话Prompt
   */
  static getChatPrompt(scenario) {
    return `
你是一个幽默训练的AI对话伙伴。

场景：${scenario.description}
你的角色：${scenario.role}
用户目标：${scenario.goal}

任务：
1. 根据场景做出自然的反应
2. 如果用户的话很幽默，在回复中给予肯定
3. 如果用户的话不太幽默，自然地引导他
4. 保持轻松友好的氛围

每次回复JSON格式：
{
  "reply": "你的回应",
  "realtimeFeedback": "即时反馈（可选，如'哈哈，这个比喻很形象！'）"
}

注意：你不需要一直笑，自然地回应即可。
`;
  }
}

export default HumorModule;
```

**Step 5: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add server_data.json js/modules/skills/HumorModule.js
git commit -m "feat(phase2): create humor module content and prompts"
```

---

### Task 7: 实现练习交互逻辑

**Files:**
- Modify: `js/modules/skills/SkillModuleRenderer.js` (添加练习界面渲染)
- Create: `js/modules/skills/PracticeEngine.js`

**Step 1: 创建练习引擎**

```javascript
// js/modules/skills/PracticeEngine.js

import { skillManager } from './SkillModuleManager.js';
import { callAPI } from '../../api.js';

/**
 * 练习引擎
 * 处理各种练习类型的交互逻辑
 */
class PracticeEngine {
  constructor(moduleId) {
    this.moduleId = moduleId;
    this.currentExercise = null;
  }

  /**
   * 开始练习
   */
  async startExercise(exerciseId) {
    const module = skillManager.getModule(this.moduleId);
    this.currentExercise = module.exercises.find(ex => ex.id === exerciseId);

    if (!this.currentExercise) {
      console.error('Exercise not found:', exerciseId);
      return;
    }

    return this.renderExercise();
  }

  /**
   * 渲染练习界面
   */
  renderExercise() {
    const exercise = this.currentExercise;

    return `
      <div class="practice-container">
        <div class="practice-header">
          <span class="exercise-type-badge">${this.getExerciseTypeLabel(exercise.type)}</span>
          <button class="close-practice-btn">✕</button>
        </div>

        <div class="exercise-content">
          <h3>${exercise.prompt}</h3>

          ${exercise.type === 'complete_sentence' || exercise.type === 'rewrite' ? `
            <textarea class="exercise-input" placeholder="输入你的答案..." rows="4"></textarea>
          ` : ''}

          ${exercise.hint ? `
            <div class="exercise-hint">
              <button class="show-hint-btn">💡 提示</button>
              <p class="hint-text hidden">${exercise.hint}</p>
            </div>
          ` : ''}
        </div>

        <div class="practice-actions">
          <button class="submit-exercise-btn primary-btn">提交答案</button>
        </div>

        <div class="practice-feedback hidden">
          <!-- 反馈内容将在这里显示 -->
        </div>
      </div>
    `;
  }

  /**
   * 提交答案并获取评分
   */
  async submitAnswer(userAnswer) {
    const module = skillManager.getModule(this.moduleId);

    // 获取模块专用的评分Prompt
    let scoringPrompt;
    switch(this.moduleId) {
      case 'humor':
        const { HumorModule } = await import('./HumorModule.js');
        scoringPrompt = HumorModule.getScoringPrompt(userAnswer);
        break;
      // 其他模块...
      default:
        scoringPrompt = `评估这个回答：${userAnswer}`;
    }

    try {
      const result = await callAPI(scoringPrompt);

      // 保存分数
      skillManager.recordExerciseScore(
        this.moduleId,
        this.currentExercise.id,
        result.score
      );

      return result;
    } catch (error) {
      console.error('Failed to get score:', error);
      return null;
    }
  }

  /**
   * 显示反馈
   */
  renderFeedback(result) {
    return `
      <div class="feedback-card">
        <div class="feedback-score">
          <span class="score-number">${result.score}</span>
          <span class="score-label">分</span>
        </div>

        <div class="feedback-content">
          <p class="feedback-text">${result.feedback}</p>

          ${result.highlights ? `
            <div class="feedback-highlights">
              <h4>✅ 亮点</h4>
              <ul>
                ${result.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${result.suggestions ? `
            <div class="feedback-suggestions">
              <h4>💡 建议</h4>
              <ul>
                ${result.suggestions.map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${result.betterAnswer ? `
            <div class="feedback-example">
              <h4>🌟 更好的回答</h4>
              <p>${result.betterAnswer}</p>
            </div>
          ` : ''}
        </div>

        <div class="feedback-actions">
          <button class="next-exercise-btn primary-btn">下一题</button>
          <button class="back-to-list-btn secondary-btn">返回列表</button>
        </div>
      </div>
    `;
  }

  /**
   * 获取练习类型标签
   */
  getExerciseTypeLabel(type) {
    const labels = {
      'complete_sentence': '句子补全',
      'rewrite': '改写练习',
      'match': '配对游戏'
    };
    return labels[type] || type;
  }
}

export { PracticeEngine };
```

**Step 2: 在SkillModuleRenderer中集成练习引擎**

修改 `renderPracticeTab` 方法，添加练习开始逻辑：

```javascript
// 在 renderPracticeTab 方法中添加事件处理
document.querySelectorAll('.start-exercise-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const exerciseItem = e.target.closest('.exercise-item');
    const exerciseId = exerciseItem.dataset.exerciseId;

    const engine = new PracticeEngine(moduleId);
    const exerciseHTML = await engine.startExercise(exerciseId);

    // 显示练习界面
    const content = document.getElementById('tab-content');
    content.innerHTML = exerciseHTML;

    // 附加事件
    attachPracticeEvents(engine, moduleId);
  });
});

function attachPracticeEvents(engine, moduleId) {
  // 显示提示
  document.querySelector('.show-hint-btn')?.addEventListener('click', (e) => {
    e.target.nextElementSibling.classList.remove('hidden');
  });

  // 提交答案
  document.querySelector('.submit-exercise-btn')?.addEventListener('click', async () => {
    const userInput = document.querySelector('.exercise-input').value;

    if (!userInput.trim()) {
      alert('请输入你的答案');
      return;
    }

    const submitBtn = e.target;
    submitBtn.disabled = true;
    submitBtn.textContent = '评分中...';

    const result = await engine.submitAnswer(userInput);

    if (result) {
      const feedbackHTML = engine.renderFeedback(result);
      document.querySelector('.practice-feedback').innerHTML = feedbackHTML;
      document.querySelector('.practice-feedback').classList.remove('hidden');

      // 附加反馈界面事件
      attachFeedbackEvents(moduleId);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = '提交答案';
  });

  // 关闭按钮
  document.querySelector('.close-practice-btn')?.addEventListener('click', () => {
    renderPracticeTab(moduleId);
  });
}

function attachFeedbackEvents(moduleId) {
  // 下一题
  document.querySelector('.next-exercise-btn')?.addEventListener('click', () => {
    // TODO: 加载下一题
  });

  // 返回列表
  document.querySelector('.back-to-list-btn')?.addEventListener('click', () => {
    const renderer = new SkillModuleRenderer();
    renderer.renderPracticeTab(moduleId);
  });
}
```

**Step 3: 提交**

```bash
cd "E:/Homework/Java_Homework/finalwork"
git add js/modules/skills/PracticeEngine.js js/modules/skills/SkillModuleRenderer.js
git commit -m "feat(phase2): implement practice interaction logic"
```

---

## Phase 3 & 4: 其他模块与整合

由于篇幅限制，剩余任务将在实际实施时继续展开。核心框架已建立，后续模块可以复用相同模式。

---

## 测试计划

### 单元测试

```bash
# 测试SkillModuleManager
node --test js/modules/skills/test/SkillModuleManager.test.js

# 测试各个模块的数据加载
node --test js/modules/skills/test/module-loading.test.js
```

### 集成测试

1. 启动服务器：`python server.py`
2. 访问 `http://localhost:8000`
3. 测试流程：
   - 主页显示技能卡片 ✓
   - 点击卡片进入模块 ✓
   - 理论课可以学习 ✓
   - 练习可以提交并获得评分 ✓
   - 进度正确保存 ✓

### AI评分测试

准备10组标准答案，验证评分一致性：
- 输入相同的答案，评分差异应<10分
- 测试边界情况（空输入、超长输入）

---

## 提交规范

每个Task完成后立即提交，commit message格式：

- `feat(phaseX): description` - 新功能
- `fix(phaseX): description` - 修复
- `refactor(phaseX): description` - 重构
- `test(phaseX): description` - 测试

---

*计划版本: 1.0*
*创建日期: 2026-01-13*
*预计完成: 6周*
