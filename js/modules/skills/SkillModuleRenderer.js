// js/modules/skills/SkillModuleRenderer.js

/**
 * 技能模块UI渲染器
 * 负责渲染技能模块相关的所有界面
 */
import { DialogueEngine } from './DialogueEngine.js';
import { PracticeEngine } from './PracticeEngine.js';
import { skillManager } from './SkillModuleManager.js';

class SkillModuleRenderer {
  constructor() {
    this.currentModule = null;
    this.currentTab = 'theory';
    this.eventDelegators = new Map(); // 存储事件委托处理器，用于清理
  }

  /**
   * 显示Toast提示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 ('success', 'error', 'info')
   */
  showToast(message, type = 'info') {
    // 移除已存在的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // 根据类型设置图标
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span style="margin-right: 8px;">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#ff7675' : type === 'success' ? '#00b894' : '#0984e3'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      font-size: 0.95rem;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
      max-width: 400px;
    `;

    // 添加动画样式
    if (!document.querySelector('#toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
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
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // 3秒后自动移除
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }

  /**
   * HTML转义函数，防止XSS攻击
   * @param {string} unsafe - 未转义的字符串
   * @returns {string} 转义后的安全字符串
   */
  escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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

    // 直接渲染卡片并插入容器，不再创建额外的 grid-container 嵌套
    container.innerHTML = modules.map(module => this.renderSkillCard(module)).join('');

    // 附加事件 (直接在容器上监听即可)
    this.attachSkillCardEvents(container);
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

    // 使用 category-card 样式结构
    return `
      <div class="category-card skill-card ${skillClass}" data-module-id="${module.id}">
        <span class="category-icon">${module.icon}</span>
        <h4>${module.name}</h4>
        <span class="start-tag">开始练习</span>
        <!-- 隐藏的进度信息，保留数据属性供调试 -->
        <div class="skill-meta hidden" data-level="${level}" data-progress="${progressPercent}"></div>
      </div>
    `;
  }

  /**
   * 3. 附加技能卡片点击事件
   * @param {HTMLElement} container - 卡片容器
   */
  attachSkillCardEvents(container) {
    container.addEventListener('click', (e) => {
      // 查找最近的 .skill-card (同时也拥有 .category-card 类)
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
          ← 返回
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
        <div id="tab-navigation" style="display:flex;gap:var(--space-sm);border-bottom:2px solid #eee;margin-top:var(--space-lg);">
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

    // 使用事件委托处理模块视图内所有点击事件
    this.attachModuleViewEvents(module.id);

    // 默认渲染理论课Tab
    this.renderTheoryTab(module.id);
  }

  /**
   * 6. 统一的事件委托处理方法
   * 使用事件委托避免内存泄漏，在模块视图上只绑定一次事件
   * @param {string} moduleId - 模块ID
   */
  attachModuleViewEvents(moduleId) {
    const moduleView = document.getElementById('skill-module-view');
    if (!moduleView) return;

    // 清理旧的事件委托器
    if (this.eventDelegators.has('moduleView')) {
      moduleView.removeEventListener('click', this.eventDelegators.get('moduleView'));
    }

    // 创建新的事件委托处理器
    const delegator = (e) => {
      // 处理返回按钮
      if (e.target.closest('#back-to-skills-btn')) {
        e.preventDefault();
        
        // 隐藏当前模块视图
        const moduleView = document.getElementById('skill-module-view');
        if (moduleView) {
          moduleView.classList.add('hidden');
          moduleView.classList.remove('active');
        }

        // 重新渲染技能列表 (已移除，避免清空 category-list)
        // const container = document.getElementById('skills-modules-container');
        // if (container) {
        //   this.renderSkillCards(container);
        // }

        // 切换回主页 (技能列表在主页)
        if (typeof window.showView === 'function') {
          window.showView('welcome');
        } else if (typeof switchView === 'function') {
          switchView('welcome');
        } else {
          // 降级处理
          const welcomeView = document.getElementById('welcome-view');
          if (welcomeView) {
            welcomeView.classList.remove('hidden');
            welcomeView.classList.add('active');
          }
        }
        return;
      }

      // 处理Tab切换
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn) {
        e.preventDefault();
        const tab = tabBtn.dataset.tab;

        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');

        // 更新当前Tab
        this.currentTab = tab;

        // 渲染对应内容
        switch (tab) {
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
        return;
      }

      // 处理课程点击
      const lessonItem = e.target.closest('.lesson-item');
      if (lessonItem) {
        e.preventDefault();
        if (lessonItem.classList.contains('locked')) {
          this.showToast('请先完成前面的课程', 'error');
          return;
        }

        const lessonId = lessonItem.dataset.lessonId;
        this.showLessonContent(moduleId, lessonId);
        return;
      }

      // 处理返回课程列表按钮
      if (e.target.closest('#back-to-lessons-btn')) {
        e.preventDefault();
        this.renderTheoryTab(moduleId);
        return;
      }

      // 处理完成课程按钮
      if (e.target.closest('#complete-lesson-btn')) {
        e.preventDefault();
        const lessonId = e.target.closest('#complete-lesson-btn').dataset.lessonId;
        if (lessonId) {
          skillManager.completeLesson(moduleId, lessonId);
          this.showToast('课程完成！+50 XP', 'success');
          this.renderTheoryTab(moduleId);
          this.renderSkillModuleInterface(this.currentModule);
        }
        return;
      }

      // 处理练习题目点击
      const exerciseItem = e.target.closest('.exercise-item');
      if (exerciseItem) {
        e.preventDefault();
        const exerciseId = exerciseItem.dataset.exerciseId;
        if (exerciseId) {
          this.startExercise(moduleId, exerciseId);
        }
        return;
      }

      // 处理场景点击
      const scenarioItem = e.target.closest('.scenario-item');
      if (scenarioItem) {
        e.preventDefault();
        const scenarioId = scenarioItem.dataset.scenarioId;
        if (scenarioId) {
          this.startScenario(moduleId, scenarioId);
        }
        return;
      }
    };

    // 保存并绑定事件委托器
    this.eventDelegators.set('moduleView', delegator);
    moduleView.addEventListener('click', delegator);
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
  }

  /**
   * 8. 显示课程内容
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

        <h2 style="margin-bottom:var(--space-md);">${this.escapeHtml(lesson.title)}</h2>
        <p style="color:var(--ink-light);margin-bottom:var(--space-lg);">
          ⏱️ ${this.escapeHtml(lesson.duration || '10')} 分钟
        </p>

        <!--
          安全说明: lesson.content 来自受信任的静态数据源 (server_data.json)
          这些内容由项目维护者在配置文件中预先定义，不包含用户生成的内容。
          如果将来支持用户生成内容或动态内容，必须使用 DOMPurify 或类似库进行HTML清理。
        -->
        <div class="lesson-body" style="line-height:1.8;color:var(--ink-dark);">
          ${lesson.content || '<p>课程内容正在更新中...</p>'}
        </div>

        ${lesson.keyPoints && lesson.keyPoints.length > 0 ? `
          <div style="margin-top:var(--space-lg);padding:var(--space-lg);background:var(--dew-drop);border-radius:var(--round-md);border-left:4px solid var(--sky-blue);">
            <h4 style="margin-top:0;">🎯 核心要点</h4>
            <ul>
              ${lesson.keyPoints.map(point => `<li>${this.escapeHtml(point)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="margin-top:var(--space-xl);text-align:center;">
          <button id="complete-lesson-btn" class="primary-btn" data-lesson-id="${lessonId}">
            ✓ 完成课程 (+50 XP)
          </button>
        </div>
      </div>
    `;

    // 注意: 所有按钮事件通过 attachModuleViewEvents 中的事件委托处理
    // 不需要单独绑定事件监听器，避免内存泄漏
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
               data-exercise-id="${this.escapeHtml(exercise.id)}"
               style="padding:var(--space-lg);cursor:pointer;margin-bottom:var(--space-md);">
            <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm);">
              <span class="tag">${this.escapeHtml(this.getExerciseTypeLabel(exercise.type))}</span>
              <span style="color:var(--ink-light);font-size:0.85rem;">
                难度: ${'⭐'.repeat(exercise.difficulty || 1)}
              </span>
            </div>
            <h4 style="margin-bottom:var(--space-xs);">${this.escapeHtml(exercise.title)}</h4>
            <p style="color:var(--ink-light);font-size:0.9rem;">
              ${this.escapeHtml(exercise.description || exercise.prompt || '点击开始练习')}
            </p>
          </div>
        `).join('')}
      </div>
    `;

    // 附加练习点击事件
    this.attachExerciseClickEvents(moduleId);
  }

  /**
   * 11. 获取练习类型标签
   * @param {string} type - 练习类型
   * @returns {string} 类型标签
   */
  getExerciseTypeLabel(type) {
    const labels = {
      'complete_sentence': '📝 补全句子',
      'rewrite': '✍️ 改写',
      'scenario': '💭 场景题',
      'quiz': '📝 选择题',
      'reflection': '📝 反思题',
      'roleplay': '🎭 角色扮演'
    };
    return labels[type] || '📝 练习';
  }

  /**
   * 附加练习点击事件
   * @param {string} moduleId - 模块ID
   */
  attachExerciseClickEvents(moduleId) {
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    // 使用事件委托处理练习点击
    tabContent.addEventListener('click', (e) => {
      const exerciseItem = e.target.closest('.exercise-item');
      if (exerciseItem) {
        const exerciseId = exerciseItem.dataset.exerciseId;
        if (exerciseId) {
          this.startPractice(moduleId, exerciseId);
        }
      }
    });
  }

  /**
   * 开始练习
   * @param {string} moduleId - 模块ID
   * @param {string} exerciseId - 练习ID
   */
  startPractice(moduleId, exerciseId) {
    try {
      // 创建练习引擎实例
      const practiceEngine = new PracticeEngine(moduleId);

      // 启动练习
      practiceEngine.startExercise(exerciseId);

    } catch (error) {
      console.error('Start practice error:', error);
      this.showToast('启动练习失败：' + error.message, 'error');
    }
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
                   data-scenario-id="${this.escapeHtml(scenario.id)}">
                <h4 style="margin-bottom:var(--space-xs);">${this.escapeHtml(scenario.title)}</h4>
                <p style="color:var(--ink-light);font-size:0.9rem;">
                  ${this.escapeHtml(scenario.description)}
                </p>
                <div style="margin-top:var(--space-sm);display:flex;gap:var(--space-xs);">
                  <span class="tag" style="font-size:0.75rem;">${this.escapeHtml(scenario.category || '通用')}</span>
                  <span style="color:var(--ink-light);font-size:0.85rem;">
                    ${this.escapeHtml(scenario.difficulty || '中等')}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    // 附加场景点击事件（占位）
    // 事件已通过事件委托在 attachModuleViewEvents 中处理
  }

  /**
   * 13. 启动练习
   * @param {string} moduleId - 模块ID
   * @param {string} exerciseId - 练习ID
   */
  startExercise(moduleId, exerciseId) {
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    // 创建练习引擎实例
    const engine = new PracticeEngine(moduleId);
    engine.container = tabContent;
    engine.startExercise(exerciseId);
  }

  /**
   * 14. 启动实战场景对话
   * @param {string} moduleId - 模块ID
   * @param {string} scenarioId - 场景ID
   */
  startScenario(moduleId, scenarioId) {
    const tabContent = document.getElementById('tab-content');
    if (!tabContent) return;

    // 检查是否完成足够的练习（可选）
    const progress = skillManager.getModuleProgress(moduleId);
    const completedLessons = progress?.completedLessons?.length || 0;
    const totalLessons = skillManager.getModule(moduleId)?.theoryLessons?.length || 0;

    if (completedLessons < 1) {
      this.showToast('建议先完成至少1个理论课', 'info');
      // 仍然允许继续，只是给出提示
    }

    try {
      // 创建对话引擎实例
      const dialogueEngine = new DialogueEngine(moduleId, scenarioId);
      dialogueEngine.initialize(tabContent);
    } catch (error) {
      console.error('Start scenario error:', error);
      this.showToast('启动场景失败：' + error.message, 'error');
    }
  }
}

// 导出单例
export const skillRenderer = new SkillModuleRenderer();
export { SkillModuleRenderer };

