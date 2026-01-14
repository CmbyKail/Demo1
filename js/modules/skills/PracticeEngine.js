// js/modules/skills/PracticeEngine.js

/**
 * 练习引擎
 * 负责处理技能模块的练习交互逻辑
 */
import { skillManager } from './SkillModuleManager.js';
import { HumorModule } from './HumorModule.js';

export class PracticeEngine {
  /**
   * 构造函数
   * @param {string} moduleId - 模块ID
   */
  constructor(moduleId) {
    this.moduleId = moduleId;
    this.module = skillManager.getModule(moduleId);
    this.currentExercise = null;
    this.container = null;
  }

  /**
   * 开始练习
   * @param {string} exerciseId - 练习ID
   */
  async startExercise(exerciseId) {
    const exercise = this.module.exercises.find(e => e.id === exerciseId);
    if (!exercise) {
      console.error('Exercise not found:', exerciseId);
      return;
    }

    this.currentExercise = exercise;

    // 获取或创建练习容器
    this.container = document.getElementById('tab-content');
    if (!this.container) {
      console.error('Tab content container not found');
      return;
    }

    // 渲染练习界面
    this.renderExercise();

    // 绑定事件
    this.attachExerciseEvents();
  }

  /**
   * 渲染练习界面
   */
  renderExercise() {
    const exercise = this.currentExercise;
    const typeLabel = this.getExerciseTypeLabel(exercise.type);

    this.container.innerHTML = `
      <div class="practice-container">
        <button id="back-to-exercises-btn" class="neutral-btn small" style="margin-bottom: var(--space-md);">
          ← 返回练习列表
        </button>

        <div class="clay-card">
          <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-md);">
            <span class="exercise-type-badge">${typeLabel}</span>
            <span style="color:var(--ink-light);font-size:0.85rem;">
              难度: ${'⭐'.repeat(exercise.difficulty || 1)}
            </span>
          </div>

          <h2 style="margin-bottom:var(--space-sm);">${this.escapeHtml(exercise.title)}</h2>
          <p style="color:var(--ink-light);margin-bottom:var(--space-lg);">
            ${this.escapeHtml(exercise.description || exercise.prompt)}
          </p>

          ${exercise.scenario ? `
            <div style="background:var(--dew-drop);padding:var(--space-md);border-radius:var(--round-md);margin-bottom:var(--space-lg);border-left:4px solid var(--sky-blue);">
              <h4 style="margin-top:0;color:var(--sky-blue);">📖 场景</h4>
              <p style="margin-bottom:0;color:var(--ink-dark);">${this.escapeHtml(exercise.scenario)}</p>
            </div>
          ` : ''}

          ${exercise.question ? `
            <div style="margin-bottom:var(--space-lg);">
              <h4 style="margin-bottom:var(--space-sm);">❓ 问题</h4>
              <p style="color:var(--ink-dark);">${this.escapeHtml(exercise.question)}</p>
            </div>
          ` : ''}

          ${exercise.hints && exercise.hints.length > 0 ? `
            <div style="margin-bottom:var(--space-lg);padding:var(--space-md);background:var(--mist-white);border-radius:var(--round-md);">
              <h4 style="margin-top:0;margin-bottom:var(--space-sm);">💡 提示</h4>
              <ul style="margin:0;padding-left:var(--space-lg);">
                ${exercise.hints.map(hint => `<li>${this.escapeHtml(hint)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div style="margin-bottom:var(--space-md);">
            <label for="exercise-input" style="display:block;margin-bottom:var(--space-sm);font-weight:600;">
              ✍️ 你的回答
            </label>
            <textarea
              id="exercise-input"
              class="exercise-input"
              placeholder="请输入你的回答..."
              rows="6"
            ></textarea>
          </div>

          <div style="display:flex;gap:var(--space-md);justify-content:flex-end;">
            <button id="submit-answer-btn" class="primary-btn">
              ✓ 提交答案
            </button>
          </div>
        </div>

        <!-- 反馈区域（初始隐藏） -->
        <div id="feedback-container" style="display:none;margin-top:var(--space-lg);"></div>
      </div>
    `;
  }

  /**
   * 绑定练习事件
   */
  attachExerciseEvents() {
    const container = this.container;

    // 返回按钮
    const backBtn = document.getElementById('back-to-exercises-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        // 重新渲染练习列表
        const renderer = window.skillRenderer;
        if (renderer) {
          renderer.renderPracticeTab(this.moduleId);
        }
      });
    }

    // 提交按钮
    const submitBtn = document.getElementById('submit-answer-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const input = document.getElementById('exercise-input');
        const userAnswer = input.value.trim();

        if (!userAnswer) {
          this.showToast('请输入你的回答', 'error');
          return;
        }

        this.submitAnswer(userAnswer);
      });
    }
  }

  /**
   * 提交答案并获取评分
   * @param {string} userAnswer - 用户回答
   */
  async submitAnswer(userAnswer) {
    const submitBtn = document.getElementById('submit-answer-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ 评分中...';
    }

    try {
      // 根据模块类型选择评分方式
      let result;

      if (this.moduleId === 'humor') {
        result = await this.scoreHumorAnswer(userAnswer);
      } else {
        // 通用评分（待实现其他模块的特定评分逻辑）
        result = await this.scoreGenericAnswer(userAnswer);
      }

      // 保存分数
      if (result.score !== undefined) {
        skillManager.recordExerciseScore(
          this.moduleId,
          this.currentExercise.id,
          result.score
        );
      }

      // 显示反馈
      this.renderFeedback(result);

    } catch (error) {
      console.error('Submit answer error:', error);
      this.showToast('评分失败：' + error.message, 'error');

      // 恢复提交按钮
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ 提交答案';
      }
    }
  }

  /**
   * 幽默模块评分
   * @param {string} userAnswer - 用户回答
   * @returns {Object} 评分结果
   */
  async scoreHumorAnswer(userAnswer) {
    // 获取API设置
    const settings = this.getAPISettings();
    if (!settings.apiKey) {
      throw new Error('请先在设置中配置 API Key');
    }

    const prompt = HumorModule.getScoringPrompt(userAnswer);

    try {
      const response = await fetch(settings.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: userAnswer }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // 解析JSON
      try {
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanContent);
      } catch (e) {
        console.error('JSON Parse Error:', content);
        throw new Error('AI返回格式解析失败，请重试');
      }

    } catch (error) {
      console.error('Humor scoring error:', error);
      throw error;
    }
  }

  /**
   * 通用评分（用于非幽默模块）
   * @param {string} userAnswer - 用户回答
   * @returns {Object} 评分结果
   */
  async scoreGenericAnswer(userAnswer) {
    // 简单的本地评分逻辑（基于回答长度和关键词）
    // 实际项目中应该使用AI评分

    const length = userAnswer.length;
    let score = 60; // 基础分

    // 根据长度加分
    if (length > 20) score += 10;
    if (length > 50) score += 10;
    if (length > 100) score += 10;

    // 确保分数在0-100之间
    score = Math.min(100, Math.max(0, score));

    return {
      score: score,
      dimensionScores: {
        completeness: score,
        relevance: Math.min(100, score + 5),
        creativity: Math.max(60, score - 10)
      },
      feedback: '回答已提交。请继续练习以提高表现。',
      highlights: ['已完成练习'],
      suggestions: ['可以尝试更详细的回答', '思考多个角度'],
      betterAnswer: '这是一个参考回答示例。'
    };
  }

  /**
   * 渲染反馈结果
   * @param {Object} result - 评分结果
   */
  renderFeedback(result) {
    const feedbackContainer = document.getElementById('feedback-container');
    if (!feedbackContainer) return;

    const score = result.score || 0;
    const dimensionScores = result.dimensionScores || {};
    const feedback = result.feedback || '';
    const highlights = result.highlights || [];
    const suggestions = result.suggestions || [];
    const betterAnswer = result.betterAnswer || '';

    // 计算分数颜色
    let scoreColor = 'var(--leaf)';
    if (score < 60) scoreColor = '#e74c3c';
    else if (score < 80) scoreColor = '#f39c12';

    feedbackContainer.innerHTML = `
      <div class="feedback-card clay-card">
        <div class="feedback-score">
          <div style="font-size:1.2rem;color:var(--ink-light);margin-bottom:var(--space-sm);">
            📊 评分结果
          </div>
          <div class="score-number" style="color:${scoreColor};">
            ${score}
          </div>
          <p style="color:var(--ink-light);margin-top:var(--space-sm);">
            ${score >= 80 ? '优秀！' : score >= 60 ? '不错！' : '继续努力！'}
          </p>
        </div>

        ${feedback ? `
          <div style="margin-bottom:var(--space-lg);padding:var(--space-md);background:var(--dew-drop);border-radius:var(--round-md);">
            <h4 style="margin-top:0;margin-bottom:var(--space-sm);">💬 总体评价</h4>
            <p style="margin:0;color:var(--ink-dark);">${this.escapeHtml(feedback)}</p>
          </div>
        ` : ''}

        ${Object.keys(dimensionScores).length > 0 ? `
          <div style="margin-bottom:var(--space-lg);">
            <h4 style="margin-bottom:var(--space-md);">📈 分项评分</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--space-md);">
              ${Object.entries(dimensionScores).map(([key, value]) => `
                <div style="text-align:center;padding:var(--space-sm);background:var(--mist-white);border-radius:var(--round-md);">
                  <div style="font-size:0.85rem;color:var(--ink-light);margin-bottom:var(--space-xs);">
                    ${this.getDimensionLabel(key)}
                  </div>
                  <div style="font-size:1.5rem;font-weight:bold;color:${scoreColor};">
                    ${value}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${highlights.length > 0 ? `
          <div class="feedback-highlights" style="margin-bottom:var(--space-lg);">
            <h4 style="margin-bottom:var(--space-sm);">✨ 亮点</h4>
            <ul style="margin:0;padding-left:var(--space-lg);">
              ${highlights.map(h => `<li>${this.escapeHtml(h)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${suggestions.length > 0 ? `
          <div class="feedback-suggestions" style="margin-bottom:var(--space-lg);">
            <h4 style="margin-bottom:var(--space-sm);">💡 改进建议</h4>
            <ul style="margin:0;padding-left:var(--space-lg);">
              ${suggestions.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${betterAnswer ? `
          <div class="feedback-example">
            <h4 style="margin-top:0;margin-bottom:var(--space-sm);">🎯 更好的回答示例</h4>
            <p style="margin:0;color:var(--ink-dark);">${this.escapeHtml(betterAnswer)}</p>
          </div>
        ` : ''}

        <div style="margin-top:var(--space-xl);text-align:center;">
          <button id="close-feedback-btn" class="neutral-btn">
            返回练习列表
          </button>
        </div>
      </div>
    `;

    feedbackContainer.style.display = 'block';

    // 绑定关闭按钮事件
    const closeBtn = document.getElementById('close-feedback-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const renderer = window.skillRenderer;
        if (renderer) {
          renderer.renderPracticeTab(this.moduleId);
        }
      });
    }
  }

  /**
   * 获取评分维度标签
   * @param {string} key - 维度key
   * @returns {string} 标签
   */
  getDimensionLabel(key) {
    const labels = {
      unexpectedness: '意外性',
      appropriateness: '适切性',
      creativity: '创意性',
      naturalness: '自然度',
      completeness: '完整性',
      relevance: '相关性',
      empathy: '共情力'
    };
    return labels[key] || key;
  }

  /**
   * 获取练习类型标签
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
   * 获取API设置
   * @returns {Object} API设置
   */
  getAPISettings() {
    // 从localStorage获取API设置
    const settings = localStorage.getItem('aiSettings');
    if (settings) {
      return JSON.parse(settings);
    }

    // 默认设置
    return {
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: '',
      model: 'gpt-3.5-turbo'
    };
  }

  /**
   * HTML转义
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
   * 显示Toast提示
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span style="margin-right:8px;">${icons[type] || icons.info}</span>
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
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

export default PracticeEngine;
