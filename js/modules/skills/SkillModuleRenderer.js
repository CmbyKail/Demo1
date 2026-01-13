// js/modules/skills/SkillModuleRenderer.js

/**
 * 技能模块UI渲染器
 * 负责渲染技能模块相关的所有界面
 */
import { skillManager } from './SkillModuleManager.js';

class SkillModuleRenderer {
  constructor() {
    this.currentModule = null;
    this.currentTab = 'theory';
  }

  /**
   * 1. 在主页渲染技能卡片网格
   * @param {HTMLElement} container - 容器元素
   */
  renderSkillCards(container) {
    const modules = skillManager.getAllModules();

    if (!container) {
      console.error('Container not found for skill cards');
      return;
    }

    if (modules.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--ink-light);">暂无技能模块</p>';
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'skills-grid';
    grid.innerHTML = modules.map(module => this.renderSkillCard(module)).join('');

    container.appendChild(grid);

    // 附加事件
    this.attachSkillCardEvents(grid);
  }

  /**
   * 2. 渲染单个技能卡片
   * @param {Object} module - 模块数据
   * @returns {string} HTML字符串
   */
  renderSkillCard(module) {
    const progress = skillManager.getModuleProgress(module.id);
    const level = progress?.level || 1;
    const completedCount = progress?.completedLessons?.length || 0;
    const totalLessons = module.theoryLessons?.length || 0;
    const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // 根据模块ID设置样式类
    const skillClass = `skill-${module.id}`;

    return `
      <div class="skill-card ${skillClass}" data-module-id="${module.id}">
        <div class="skill-icon">${module.icon}</div>
        <h3 class="skill-name">${module.name}</h3>
        <p class="skill-level">Lv.${level}</p>
        <div class="skill-progress">
          <div class="skill-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <p style="font-size:0.8rem;color:var(--ink-light);margin-top:0.5rem;">
          ${completedCount}/${totalLessons} 课
        </p>
      </div>
    `;
  }

  /**
   * 3. 附加技能卡片点击事件
   * @param {HTMLElement} container - 卡片容器
   */
  attachSkillCardEvents(container) {
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.skill-card');
      if (card) {
        const moduleId = card.dataset.moduleId;
        this.navigateToModule(moduleId);
      }
    });
  }

  /**
   * 4. 导航到模块详情页
   * @param {string} moduleId - 模块ID
   */
  navigateToModule(moduleId) {
    const module = skillManager.getModule(moduleId);
    if (!module) {
      console.error('Module not found:', moduleId);
      return;
    }

    this.currentModule = module;

    // 使用全局路由系统
    if (typeof showView === 'function') {
      showView('skill-module', { moduleId });
    } else {
      console.error('showView function not available');
    }
  }

  /**
   * 5. 渲染技能模块主界面（三Tab布局）
   * @param {Object} module - 模块数据
   */
  renderSkillModuleInterface(module) {
    const main = document.getElementById('app');
    if (!main) return;

    this.currentModule = module;
    this.currentTab = 'theory';

    // 隐藏所有现有视图
    document.querySelectorAll('.view').forEach(v => {
      v.classList.add('hidden');
      v.classList.remove('active');
    });

    // 创建或更新模块视图
    let moduleView = document.getElementById('skill-module-view');
    if (!moduleView) {
      moduleView = document.createElement('section');
      moduleView.id = 'skill-module-view';
      moduleView.className = 'view active';
      main.appendChild(moduleView);
    } else {
      moduleView.classList.remove('hidden');
      moduleView.classList.add('active');
    }

    const progress = skillManager.getModuleProgress(module.id);
    const level = progress?.level || 1;
    const xp = progress?.xp || 0;
    const completedCount = progress?.completedLessons?.length || 0;
    const totalLessons = module.theoryLessons?.length || 0;

    moduleView.innerHTML = `
      <div class="clay-card" style="margin-bottom: var(--space-lg);">
        <button id="back-to-skills-btn" class="neutral-btn small" style="margin-bottom: var(--space-md);">
          ← 返回技能列表
        </button>
        <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md);">
          <span style="font-size:3rem;">${module.icon}</span>
          <div>
            <h2 style="margin:0;">${module.name}</h2>
            <p style="color:var(--ink-light);margin:var(--space-xs) 0;">${module.description}</p>
          </div>
          <div style="margin-left:auto;text-align:right;">
            <div class="level-badge" style="display:inline-flex;">
              Lv.${level}
            </div>
            <p style="font-size:0.85rem;color:var(--ink-light);margin-top:var(--space-xs);">
              ${xp} XP · ${completedCount}/${totalLessons} 课
            </p>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation" style="display:flex;gap:var(--space-sm);border-bottom:2px solid #eee;margin-top:var(--space-lg);">
          <button class="tab-btn active" data-tab="theory">
            📚 理论课
          </button>
          <button class="tab-btn" data-tab="practice">
            ✍️ 练习
          </button>
          <button class="tab-btn" data-tab="realworld">
            🌍 实战
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div id="tab-content">
        <!-- Content will be rendered here -->
      </div>
    `;

    // 附加返回按钮事件
    document.getElementById('back-to-skills-btn').addEventListener('click', () => {
      if (typeof switchView === 'function') {
        switchView('welcome');
      }
    });

    // 附加Tab事件
    this.attachTabEvents(module.id);

    // 默认渲染理论课Tab
    this.renderTheoryTab(module.id);
  }

  /**
   * 6. 附加Tab切换事件
   * @param {string} moduleId - 模块ID
   */
  attachTabEvents(moduleId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContent = document.getElementById('tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // 更新按钮状态
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 更新当前Tab
        this.currentTab = btn.dataset.tab;

        // 渲染对应内容
        switch (this.currentTab) {
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
   * 7. 渲染理论课Tab
   * @param {string} moduleId - 模块ID
   */
  renderTheoryTab(moduleId) {
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    const module = skillManager.getModule(moduleId);
    if (!module) return;

    const lessons = module.theoryLessons || [];
    const progress = skillManager.getModuleProgress(moduleId);
    const completedLessons = progress?.completedLessons || [];

    if (lessons.length === 0) {
      tabContent.innerHTML = `
        <div class="clay-card" style="text-align:center;padding:var(--space-xl);">
          <p style="color:var(--ink-light);font-size:1.1rem;">📚 暂无理论课</p>
          <p style="color:var(--ink-light);margin-top:var(--space-sm);">课程内容正在更新中...</p>
        </div>
      `;
      return;
    }

    tabContent.innerHTML = `
      <div class="lessons-list">
        ${lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isLocked = index > 0 && !completedLessons.includes(lessons[index - 1].id);

          return `
            <div class="lesson-item clay-card ${isLocked ? 'locked' : ''}"
                 data-lesson-id="${lesson.id}"
                 style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-lg);cursor:${isLocked ? 'not-allowed' : 'pointer'};opacity:${isLocked ? '0.6' : '1'};">
              <div class="lesson-number" style="width:40px;height:40px;border-radius:var(--round-full);background:${isCompleted ? 'var(--leaf)' : '#eee'};color:${isCompleted ? 'white' : 'var(--ink-light)'};display:flex;align-items:center;justify-content:center;font-weight:bold;">
                ${isLocked ? '🔒' : (isCompleted ? '✓' : (index + 1))}
              </div>
              <div style="flex:1;">
                <h4 style="margin:0 0 var(--space-xs) 0;">${lesson.title}</h4>
                <p style="margin:0;color:var(--ink-light);font-size:0.9rem;">
                  ${lesson.duration || '10'} 分钟
                  ${isCompleted ? ' · <span style="color:var(--leaf);">已完成</span>' : ''}
                </p>
              </div>
              <div style="color:var(--ink-light);">
                ${isLocked ? '🔒' : '→'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // 附加课程点击事件
    this.attachLessonEvents(moduleId);
  }

  /**
   * 8. 附加课程点击事件
   * @param {string} moduleId - 模块ID
   */
  attachLessonEvents(moduleId) {
    const lessonItems = document.querySelectorAll('.lesson-item');

    lessonItems.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('locked')) {
          alert('请先完成前面的课程');
          return;
        }

        const lessonId = item.dataset.lessonId;
        this.showLessonContent(moduleId, lessonId);
      });
    });
  }

  /**
   * 9. 显示课程内容
   * @param {string} moduleId - 模块ID
   * @param {string} lessonId - 课程ID
   */
  showLessonContent(moduleId, lessonId) {
    const lesson = skillManager.getLesson(moduleId, lessonId);
    if (!lesson) {
      console.error('Lesson not found:', lessonId);
      return;
    }

    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    tabContent.innerHTML = `
      <div class="lesson-content clay-card">
        <button id="back-to-lessons-btn" class="neutral-btn small" style="margin-bottom:var(--space-md);">
          ← 返回课程列表
        </button>

        <h2 style="margin-bottom:var(--space-md);">${lesson.title}</h2>
        <p style="color:var(--ink-light);margin-bottom:var(--space-lg);">
          ⏱️ ${lesson.duration || '10'} 分钟
        </p>

        <div class="lesson-body" style="line-height:1.8;color:var(--ink-dark);">
          ${lesson.content || '<p>课程内容正在更新中...</p>'}
        </div>

        ${lesson.keyPoints && lesson.keyPoints.length > 0 ? `
          <div style="margin-top:var(--space-lg);padding:var(--space-lg);background:var(--dew-drop);border-radius:var(--round-md);border-left:4px solid var(--sky-blue);">
            <h4 style="margin-top:0;">🎯 核心要点</h4>
            <ul>
              ${lesson.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="margin-top:var(--space-xl);text-align:center;">
          <button id="complete-lesson-btn" class="primary-btn">
            ✓ 完成课程 (+50 XP)
          </button>
        </div>
      </div>
    `;

    // 返回按钮事件
    document.getElementById('back-to-lessons-btn').addEventListener('click', () => {
      this.renderTheoryTab(moduleId);
    });

    // 完成课程事件
    document.getElementById('complete-lesson-btn').addEventListener('click', () => {
      skillManager.completeLesson(moduleId, lessonId);

      // 显示完成提示
      alert(`🎉 课程完成！+50 XP`);

      // 返回课程列表
      this.renderTheoryTab(moduleId);

      // 刷新整个模块界面以更新进度
      this.renderSkillModuleInterface(this.currentModule);
    });
  }

  /**
   * 10. 渲染练习Tab
   * @param {string} moduleId - 模块ID
   */
  renderPracticeTab(moduleId) {
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    const module = skillManager.getModule(moduleId);
    if (!module) return;

    const exercises = module.exercises || [];

    if (exercises.length === 0) {
      tabContent.innerHTML = `
        <div class="clay-card" style="text-align:center;padding:var(--space-xl);">
          <p style="color:var(--ink-light);font-size:1.1rem;">✍️ 暂无练习</p>
          <p style="color:var(--ink-light);margin-top:var(--space-sm);">练习内容正在更新中...</p>
        </div>
      `;
      return;
    }

    tabContent.innerHTML = `
      <div class="exercises-list">
        <h3 style="margin-bottom:var(--space-lg);">练习列表</h3>
        ${exercises.map(exercise => `
          <div class="exercise-item clay-card"
               data-exercise-id="${exercise.id}"
               style="padding:var(--space-lg);cursor:pointer;margin-bottom:var(--space-md);">
            <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm);">
              <span class="tag">${this.getExerciseTypeLabel(exercise.type)}</span>
              <span style="color:var(--ink-light);font-size:0.85rem;">
                难度: ${'⭐'.repeat(exercise.difficulty || 1)}
              </span>
            </div>
            <h4 style="margin-bottom:var(--space-xs);">${exercise.title}</h4>
            <p style="color:var(--ink-light);font-size:0.9rem;">
              ${exercise.description || '点击开始练习'}
            </p>
          </div>
        `).join('')}
      </div>
    `;

    // 附加练习点击事件（占位）
    // TODO: Task 5 实现具体的练习逻辑
  }

  /**
   * 11. 获取练习类型标签
   * @param {string} type - 练习类型
   * @returns {string} 类型标签
   */
  getExerciseTypeLabel(type) {
    const labels = {
      'quiz': '📝 选择题',
      'scenario': '💭 场景题',
      'reflection': '📝 反思题',
      'roleplay': '🎭 角色扮演'
    };
    return labels[type] || '📝 练习';
  }

  /**
   * 12. 渲染实战Tab
   * @param {string} moduleId - 模块ID
   */
  renderRealWorldTab(moduleId) {
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    const module = skillManager.getModule(moduleId);
    if (!module) return;

    const scenarios = module.scenarios || [];
    const progress = skillManager.getModuleProgress(moduleId);
    const scenarioCount = progress?.scenarioCount || 0;

    tabContent.innerHTML = `
      <div class="realworld-content">
        <div class="clay-card" style="margin-bottom:var(--space-lg);">
          <h3 style="margin-bottom:var(--space-md);">🌍 实战演练</h3>
          <p style="color:var(--ink-light);margin-bottom:var(--space-md);">
            在真实场景中应用你学到的技能
          </p>
          <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);background:var(--dew-drop);border-radius:var(--round-md);">
            <span style="font-size:2rem;">🏆</span>
            <div>
              <div style="font-size:1.5rem;font-weight:bold;color:var(--ink-dark);">
                ${scenarioCount}
              </div>
              <div style="font-size:0.85rem;color:var(--ink-light);">
                已完成场景
              </div>
            </div>
          </div>
        </div>

        ${scenarios.length === 0 ? `
          <div class="clay-card" style="text-align:center;padding:var(--space-xl);">
            <p style="color:var(--ink-light);font-size:1.1rem;">🌍 暂无实战场景</p>
            <p style="color:var(--ink-light);margin-top:var(--space-sm);">实战内容正在更新中...</p>
          </div>
        ` : `
          <div class="scenarios-list">
            <h4 style="margin-bottom:var(--space-md);">可选场景</h4>
            ${scenarios.map(scenario => `
              <div class="scenario-item clay-card"
                   style="padding:var(--space-lg);cursor:pointer;margin-bottom:var(--space-md);"
                   data-scenario-id="${scenario.id}">
                <h4 style="margin-bottom:var(--space-xs);">${scenario.title}</h4>
                <p style="color:var(--ink-light);font-size:0.9rem;">
                  ${scenario.description}
                </p>
                <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-xs);">
                  <span class="tag" style="font-size:0.75rem;">${scenario.category || '通用'}</span>
                  <span style="color:var(--ink-light);font-size:0.85rem;">
                    ${scenario.difficulty || '中等'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // 附加场景点击事件（占位）
    // TODO: Task 5 实现具体的场景实战逻辑
  }
}

// 导出单例
export const skillRenderer = new SkillModuleRenderer();
export { SkillModuleRenderer };
