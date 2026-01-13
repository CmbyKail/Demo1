// js/modules/skills/DialogueEngine.js

/**
 * 实战对话引擎
 * 负责处理技能模块的实战模式（多轮AI对话）
 */
import { skillManager } from './SkillModuleManager.js';
import { HumorModule } from './HumorModule.js';

export class DialogueEngine {
  /**
   * 构造函数
   * @param {string} moduleId - 模块ID
   * @param {string} scenarioId - 场景ID
   */
  constructor(moduleId, scenarioId) {
    this.moduleId = moduleId;
    this.module = skillManager.getModule(moduleId);
    this.scenarioId = scenarioId;
    this.scenario = this.module.scenarios.find(s => s.id === scenarioId);

    if (!this.scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }

    // 对话历史
    this.conversationHistory = [];

    // 轮次计数
    this.roundCount = 0;
    this.maxRounds = 10; // 最大对话轮次

    // 用户表现评分数据
    this.performanceMetrics = {
      roundsCompleted: 0,
      averageScore: 0,
      dimensionScores: {},
      highlights: [],
      improvements: []
    };

    // AI角色初始化状态
    this.isInitialized = false;

    // 容器
    this.container = null;
  }

  /**
   * 初始化对话引擎
   * @param {HTMLElement} container - 容器元素
   */
  initialize(container) {
    this.container = container;
    this.renderInterface();
    this.attachEvents();

    // 初始化AI角色并开始对话
    this.startConversation();
  }

  /**
   * 渲染对话界面
   */
  renderInterface() {
    const scenario = this.scenario;

    this.container.innerHTML = `
      <div class="dialogue-container">
        <!-- 对话头部信息 -->
        <div class="dialogue-header clay-card" style="margin-bottom: var(--space-lg); padding: var(--space-md);">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: var(--space-md);">
            <div>
              <h3 style="margin: 0 0 var(--space-xs) 0;">${this.escapeHtml(scenario.title)}</h3>
              <p style="margin: 0; color: var(--ink-light); font-size: 0.9rem;">
                角色: ${this.escapeHtml(scenario.role)}
              </p>
              <p style="margin: var(--space-xs) 0 0 0; color: var(--ink-light); font-size: 0.9rem;">
                目标: ${this.escapeHtml(scenario.goal)}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.85rem; color: var(--ink-light);">
                对话轮次
              </div>
              <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary);">
                <span id="round-counter">0</span> / ${this.maxRounds}
              </div>
            </div>
          </div>
        </div>

        <!-- 场景描述 -->
        <div class="clay-card" style="margin-bottom: var(--space-lg); padding: var(--space-md); background: var(--dew-drop); border-left: 4px solid var(--sky-blue);">
          <h4 style="margin: 0 0 var(--space-sm) 0; color: var(--sky-blue);">📖 场景描述</h4>
          <p style="margin: 0; color: var(--ink-dark);">${this.escapeHtml(scenario.description)}</p>
        </div>

        <!-- 对话历史区域 -->
        <div id="chat-messages" class="chat-messages" style="height: 400px; overflow-y: auto; padding: var(--space-md); background: var(--mist-white); border-radius: var(--round-md); margin-bottom: var(--space-md);">
          <div class="chat-msg system">
            <span>🎭 正在初始化${scenario.role}角色...</span>
          </div>
        </div>

        <!-- 实时反馈浮标（初始隐藏） -->
        <div id="realtime-feedback" class="realtime-feedback hidden" style="margin-bottom: var(--space-md);"></div>

        <!-- 输入区域 -->
        <div class="dialogue-input-area">
          <textarea
            id="dialogue-input"
            class="dialogue-input"
            placeholder="输入你的回复..."
            rows="3"
          ></textarea>
          <div style="display: flex; gap: var(--space-md); justify-content: flex-end; margin-top: var(--space-sm);">
            <button id="end-dialogue-btn" class="secondary-btn" style="background: #ff7675; color: white;">
              🏁 结束对话并评估
            </button>
            <button id="send-dialogue-btn" class="primary-btn">
              📤 发送
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 绑定事件
   */
  attachEvents() {
    // 发送按钮
    const sendBtn = document.getElementById('send-dialogue-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.handleSendMessage());
    }

    // 结束对话按钮
    const endBtn = document.getElementById('end-dialogue-btn');
    if (endBtn) {
      endBtn.addEventListener('click', () => this.handleEndDialogue());
    }

    // 回车发送（Shift+Enter换行）
    const input = document.getElementById('dialogue-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }
  }

  /**
   * 开始对话
   */
  async startConversation() {
    try {
      // 获取开场白
      const openingLine = await this.getAIOpeningLine();

      // 添加到对话历史
      this.addMessage('ai', openingLine);

      // 标记为已初始化
      this.isInitialized = true;

      // 更新轮次计数
      this.roundCount = 1;
      this.updateRoundCounter();

    } catch (error) {
      console.error('Start conversation error:', error);
      this.showToast('对话初始化失败：' + error.message, 'error');
    }
  }

  /**
   * 获取AI开场白
   */
  async getAIOpeningLine() {
    const prompt = this.buildChatPrompt('opening');

    try {
      const response = await this.callAIAPI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      // 如果API调用失败，使用预设的开场白
      return this.scenario.openingLine || '你好，让我们开始对话吧。';
    }
  }

  /**
   * 处理发送消息
   */
  async handleSendMessage() {
    const input = document.getElementById('dialogue-input');
    const message = input.value.trim();

    if (!message) {
      this.showToast('请输入消息内容', 'error');
      return;
    }

    if (!this.isInitialized) {
      this.showToast('对话尚未初始化，请稍候', 'error');
      return;
    }

    // 检查是否超过最大轮次
    if (this.roundCount >= this.maxRounds) {
      this.showToast('已达到最大对话轮次，请结束对话', 'info');
      return;
    }

    // 禁用输入和按钮
    this.setInteractionEnabled(false);

    try {
      // 显示用户消息
      this.addMessage('user', message);

      // 清空输入框
      input.value = '';

      // 获取AI回复
      await this.getAIResponse(message);

      // 更新轮次
      this.roundCount++;
      this.updateRoundCounter();

    } catch (error) {
      console.error('Send message error:', error);
      this.showToast('发送失败：' + error.message, 'error');
    } finally {
      // 恢复交互
      this.setInteractionEnabled(true);
      // 聚焦输入框
      input.focus();
    }
  }

  /**
   * 获取AI回复（含实时评分）
   */
  async getAIResponse(userMessage) {
    try {
      // 构建对话Prompt（包含最近5轮历史）
      const prompt = this.buildChatPrompt('continue', userMessage);

      // 调用AI API
      const response = await this.callAIAPI(prompt);

      // 解析响应（包含AI回复和评分）
      const parsed = this.parseAIResponseWithScore(response);

      // 显示AI回复
      this.addMessage('ai', parsed.reply);

      // 如果有实时反馈，显示
      if (parsed.realtimeFeedback) {
        this.showRealtimeFeedback(parsed.realtimeFeedback);
      }

      // 如果有警告，显示
      if (parsed.manipulationAlert) {
        this.showManipulationAlert(parsed.manipulationAlert);
      }

      // 保存本轮评分数据
      if (parsed.roundScore) {
        this.recordRoundScore(parsed.roundScore);
      }

    } catch (error) {
      console.error('Get AI response error:', error);
      throw error;
    }
  }

  /**
   * 构建对话Prompt
   */
  buildChatPrompt(mode, userMessage = '') {
    const scenario = this.scenario;

    // 获取最近5轮对话历史
    const recentHistory = this.conversationHistory.slice(-10); // 5轮 = 10条消息

    // 构建历史文本
    const historyText = recentHistory.map((msg, index) => {
      const role = msg.role === 'user' ? '用户' : 'AI（你）';
      return `${role}: ${msg.content}`;
    }).join('\n');

    // 根据模块选择Prompt模板
    let basePrompt = '';

    switch (this.moduleId) {
      case 'humor':
        basePrompt = HumorModule.getChatPrompt(scenario);
        break;
      // 未来其他模块...
      default:
        basePrompt = this.getGenericChatPrompt(scenario);
    }

    // 组装完整Prompt
    let fullPrompt = '';

    if (mode === 'opening') {
      fullPrompt = `
${basePrompt}

${historyText}

请用开场白开始对话，开场白是："${scenario.openingLine}"

请直接回复开场白，不要解释。
`;
    } else {
      fullPrompt = `
${basePrompt}

对话历史：
${historyText}

用户刚才说：${userMessage}

请以JSON格式回复：
{
  "reply": "你的回复内容",
  "realtimeFeedback": "简短反馈（可选，100字内）",
  "manipulationAlert": "警告信息（如有操纵行为，可选）",
  "roundScore": {
    "score": 0-100,
    "dimensionScores": {},
    "highlights": [],
    "improvements": []
  }
}

注意事项：
1. reply字段是必须的，直接回复用户
2. realtimeFeedback是可选的，给用户即时反馈
3. manipulationAlert仅在检测到问题时提供
4. roundScore是可选的，用于记录本轮表现

请直接返回JSON，不要有其他内容。
`;
    }

    return fullPrompt;
  }

  /**
   * 通用对话Prompt（用于未实现特定Prompt的模块）
   */
  getGenericChatPrompt(scenario) {
    return `
你是一个情商训练的AI对话伙伴。

场景：${scenario.description}
你的角色：${scenario.role}
用户目标：${scenario.goal}

请你在对话中：
1. 扮演${scenario.role}这个角色
2. 给用户提供练习${this.module.name}的机会
3. 观察并评估用户的表现
`;
  }

  /**
   * 调用AI API
   */
  async callAIAPI(prompt) {
    const settings = this.getAPISettings();

    if (!settings.apiKey) {
      throw new Error('请先在设置中配置 API Key');
    }

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
          { role: 'user', content: prompt }
        ],
        temperature: 0.8 // 对话模式使用较高温度以增加多样性
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 解析AI回复
   */
  parseAIResponse(response) {
    // 移除可能的markdown代码块标记
    let clean = response.replace(/```json/g, '').replace(/```/g, '').trim();

    // 尝试解析为JSON
    try {
      const parsed = JSON.parse(clean);
      return parsed.reply || parsed;
    } catch (e) {
      // 如果不是JSON，直接返回原文
      return clean;
    }
  }

  /**
   * 解析AI回复（含评分）
   */
  parseAIResponseWithScore(response) {
    // 移除可能的markdown代码块标记
    let clean = response.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(clean);

      // 如果有reply字段，返回它
      if (parsed.reply) {
        return parsed;
      }

      // 如果没有reply字段，整个响应就是回复
      return {
        reply: response,
        realtimeFeedback: null,
        roundScore: null
      };

    } catch (e) {
      // JSON解析失败，整个响应就是回复
      return {
        reply: response,
        realtimeFeedback: null,
        roundScore: null
      };
    }
  }

  /**
   * 添加消息到对话历史
   */
  addMessage(role, content) {
    const message = {
      role,
      content,
      timestamp: new Date().toISOString()
    };

    this.conversationHistory.push(message);

    // 渲染到界面
    this.renderMessage(message);
  }

  /**
   * 渲染单条消息
   */
  renderMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${message.role === 'user' ? 'user' : 'ai'}`;

    const avatar = message.role === 'user' ? '👤' : '🤖';
    const roleName = message.role === 'user' ? '你' : 'AI';

    msgDiv.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-content">
        <div class="msg-header">
          <span class="msg-role">${roleName}</span>
          <span class="msg-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="msg-text">${this.escapeHtml(message.content)}</div>
      </div>
    `;

    chatMessages.appendChild(msgDiv);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * 显示实时反馈
   */
  showRealtimeFeedback(feedback) {
    const feedbackContainer = document.getElementById('realtime-feedback');
    if (!feedbackContainer) return;

    feedbackContainer.innerHTML = `
      <div class="realtime-feedback-card clay-card" style="padding: var(--space-md); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <div style="display: flex; align-items: center; gap: var(--space-sm);">
          <span style="font-size: 1.2rem;">💡</span>
          <div>
            <div style="font-size: 0.85rem; opacity: 0.9;">实时反馈</div>
            <div style="font-weight: 500;">${this.escapeHtml(feedback)}</div>
          </div>
        </div>
      </div>
    `;

    feedbackContainer.classList.remove('hidden');

    // 5秒后自动隐藏
    setTimeout(() => {
      feedbackContainer.classList.add('hidden');
    }, 5000);
  }

  /**
   * 显示操纵警告
   */
  showManipulationAlert(alert) {
    const feedbackContainer = document.getElementById('realtime-feedback');
    if (!feedbackContainer) return;

    feedbackContainer.innerHTML = `
      <div class="manipulation-alert-card clay-card" style="padding: var(--space-md); background: #ff7675; color: white;">
        <div style="display: flex; align-items: center; gap: var(--space-sm);">
          <span style="font-size: 1.2rem;">⚠️</span>
          <div>
            <div style="font-weight: bold;">伦理提醒</div>
            <div style="font-size: 0.9rem;">${this.escapeHtml(alert)}</div>
          </div>
        </div>
      </div>
    `;

    feedbackContainer.classList.remove('hidden');

    // 10秒后自动隐藏
    setTimeout(() => {
      feedbackContainer.classList.add('hidden');
    }, 10000);
  }

  /**
   * 记录本轮评分
   */
  recordRoundScore(roundScore) {
    this.performanceMetrics.roundsCompleted++;

    // 累积维度分数
    if (roundScore.dimensionScores) {
      for (const [key, value] of Object.entries(roundScore.dimensionScores)) {
        if (!this.performanceMetrics.dimensionScores[key]) {
          this.performanceMetrics.dimensionScores[key] = [];
        }
        this.performanceMetrics.dimensionScores[key].push(value);
      }
    }

    // 收集亮点和改进建议
    if (roundScore.highlights) {
      this.performanceMetrics.highlights.push(...roundScore.highlights);
    }

    if (roundScore.improvements) {
      this.performanceMetrics.improvements.push(...roundScore.improvements);
    }

    // 计算平均分
    const totalScore = (this.performanceMetrics.averageScore * (this.performanceMetrics.roundsCompleted - 1) + roundScore.score);
    this.performanceMetrics.averageScore = Math.round(totalScore / this.performanceMetrics.roundsCompleted);
  }

  /**
   * 更新轮次计数器
   */
  updateRoundCounter() {
    const counter = document.getElementById('round-counter');
    if (counter) {
      counter.textContent = this.roundCount;
    }
  }

  /**
   * 设置交互状态
   */
  setInteractionEnabled(enabled) {
    const input = document.getElementById('dialogue-input');
    const sendBtn = document.getElementById('send-dialogue-btn');
    const endBtn = document.getElementById('end-dialogue-btn');

    if (input) input.disabled = !enabled;
    if (sendBtn) sendBtn.disabled = !enabled;
    if (endBtn) endBtn.disabled = !enabled;
  }

  /**
   * 处理结束对话
   */
  async handleEndDialogue() {
    if (this.roundCount < 3) {
      if (!confirm('对话才刚刚开始，确定要结束吗？建议至少进行3轮对话以获得更好的评估。')) {
        return;
      }
    }

    // 禁用交互
    this.setInteractionEnabled(false);

    try {
      // 获取最终评估
      const finalAssessment = await this.getFinalAssessment();

      // 显示评估结果
      this.renderFinalAssessment(finalAssessment);

      // 保存进度
      this.saveDialogueProgress(finalAssessment);

    } catch (error) {
      console.error('End dialogue error:', error);
      this.showToast('评估失败：' + error.message, 'error');
      this.setInteractionEnabled(true);
    }
  }

  /**
   * 获取最终评估
   */
  async getFinalAssessment() {
    // 构建评估Prompt
    const historyText = this.conversationHistory.map((msg, index) => {
      const role = msg.role === 'user' ? '用户' : 'AI';
      return `${index + 1}. ${role}: ${msg.content}`;
    }).join('\n');

    const prompt = `
你是一个${this.module.name}训练的评估专家。

场景：${this.scenario.description}
用户目标：${this.scenario.goal}

对话记录：
${historyText}

请对用户的整体表现进行综合评估，以JSON格式返回：
{
  "totalScore": 0-100,
  "dimensionScores": {
    "维度名": 分数,
    ...
  },
  "summary": "总体评价（200字内）",
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["不足1", "不足2"],
  "recommendations": ["建议1", "建议2", "建议3"],
  "levelUp": "是否达到升级标准（yes/no）"
}

请根据${this.moduleId}模块的标准进行评估。
`;

    try {
      const response = await this.callAIAPI(prompt);

      // 解析JSON
      const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const assessment = JSON.parse(clean);

      return assessment;

    } catch (error) {
      console.error('Get final assessment error:', error);

      // 如果AI评估失败，使用本地累积数据
      return this.generateLocalAssessment();
    }
  }

  /**
   * 生成本地评估（AI评估失败时的备用方案）
   */
  generateLocalAssessment() {
    const avgScore = this.performanceMetrics.averageScore || 70;

    // 计算维度平均分
    const dimensionScores = {};
    for (const [key, scores] of Object.entries(this.performanceMetrics.dimensionScores)) {
      const sum = scores.reduce((a, b) => a + b, 0);
      dimensionScores[key] = Math.round(sum / scores.length);
    }

    return {
      totalScore: avgScore,
      dimensionScores: dimensionScores,
      summary: `你完成了${this.roundCount}轮对话练习。总体表现${avgScore >= 80 ? '优秀' : avgScore >= 60 ? '良好' : '需要继续努力'}。`,
      strengths: this.performanceMetrics.highlights.slice(0, 3),
      weaknesses: this.performanceMetrics.improvements.slice(0, 3),
      recommendations: ['继续练习以提升表现', '注意理论课程中的技巧', '多观察优秀示例'],
      levelUp: avgScore >= 80 ? 'yes' : 'no'
    };
  }

  /**
   * 渲染最终评估
   */
  renderFinalAssessment(assessment) {
    const container = this.container;
    if (!container) return;

    const score = assessment.totalScore || 0;
    let scoreColor = 'var(--leaf)';
    if (score < 60) scoreColor = '#e74c3c';
    else if (score < 80) scoreColor = '#f39c12';

    container.innerHTML = `
      <div class="final-assessment-container">
        <div class="clay-card" style="padding: var(--space-xl); text-align: center;">
          <h2 style="margin-bottom: var(--space-md);">🎯 对话训练完成</h2>

          <div class="assessment-score" style="margin: var(--space-lg) 0;">
            <div style="font-size: 4rem; font-weight: bold; color: ${scoreColor};">
              ${score}
            </div>
            <div style="font-size: 1.2rem; color: var(--ink-light); margin-top: var(--space-sm);">
              ${score >= 80 ? '🎉 优秀！' : score >= 60 ? '👍 良好！' : '💪 继续加油！'}
            </div>
          </div>

          <div style="text-align: left; margin-bottom: var(--space-lg);">
            <h3 style="margin-bottom: var(--space-sm);">📊 综合评价</h3>
            <p style="color: var(--ink-dark); line-height: 1.6;">
              ${this.escapeHtml(assessment.summary || '无评价')}
            </p>
          </div>

          ${Object.keys(assessment.dimensionScores || {}).length > 0 ? `
            <div style="text-align: left; margin-bottom: var(--space-lg);">
              <h3 style="margin-bottom: var(--space-md);">📈 能力维度</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-md);">
                ${Object.entries(assessment.dimensionScores).map(([key, value]) => `
                  <div style="text-align: center; padding: var(--space-md); background: var(--mist-white); border-radius: var(--round-md);">
                    <div style="font-size: 0.85rem; color: var(--ink-light); margin-bottom: var(--space-xs);">
                      ${this.getDimensionLabel(key)}
                    </div>
                    <div style="font-size: 2rem; font-weight: bold; color: ${scoreColor};">
                      ${value}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); margin-bottom: var(--space-lg); text-align: left;">
            <div>
              <h3 style="margin-bottom: var(--space-sm);">✨ 亮点</h3>
              <ul style="margin: 0; padding-left: var(--space-lg);">
                ${(assessment.strengths || []).map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h3 style="margin-bottom: var(--space-sm);">💡 改进方向</h3>
              <ul style="margin: 0; padding-left: var(--space-lg);">
                ${(assessment.weaknesses || []).map(w => `<li>${this.escapeHtml(w)}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="text-align: left; margin-bottom: var(--space-lg);">
            <h3 style="margin-bottom: var(--space-sm);">📝 训练建议</h3>
            <ul style="margin: 0; padding-left: var(--space-lg);">
              ${(assessment.recommendations || []).map(r => `<li>${this.escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>

          <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
            <button id="retry-dialogue-btn" class="primary-btn">
              🔄 再练一次
            </button>
            <button id="back-to-scenarios-btn" class="secondary-btn">
              📋 返回场景列表
            </button>
            <button id="back-to-module-btn" class="neutral-btn">
              🏠 返回模块主页
            </button>
          </div>
        </div>
      </div>
    `;

    // 绑定按钮事件
    const retryBtn = document.getElementById('retry-dialogue-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        // 重新开始同一个场景
        window.location.reload();
      });
    }

    const backToScenariosBtn = document.getElementById('back-to-scenarios-btn');
    if (backToScenariosBtn) {
      backToScenariosBtn.addEventListener('click', () => {
        const renderer = window.skillRenderer;
        if (renderer) {
          renderer.renderRealWorldTab(this.moduleId);
        }
      });
    }

    const backToModuleBtn = document.getElementById('back-to-module-btn');
    if (backToModuleBtn) {
      backToModuleBtn.addEventListener('click', () => {
        const renderer = window.skillRenderer;
        if (renderer) {
          renderer.renderSkillModuleInterface(this.module);
        }
      });
    }
  }

  /**
   * 保存对话进度
   */
  saveDialogueProgress(assessment) {
    try {
      // 更新模块进度
      const progress = skillManager.getModuleProgress(this.moduleId);
      if (progress) {
        // 增加场景完成计数
        progress.scenarioCount = (progress.scenarioCount || 0) + 1;

        // 更新平均分
        const currentAvg = progress.averageScore || 0;
        const count = progress.scenarioCount;
        progress.averageScore = Math.round(
          (currentAvg * (count - 1) + assessment.totalScore) / count
        );

        // 增加XP
        progress.xp += Math.floor(assessment.totalScore / 2);

        // 保存
        skillManager.saveProgress();

        // 显示升级提示（如果有）
        this.checkLevelUp(progress);
      }
    } catch (error) {
      console.error('Save progress error:', error);
    }
  }

  /**
   * 检查是否升级
   */
  checkLevelUp(progress) {
    const currentLevel = progress.level || 1;
    const xpNeeded = currentLevel * 500;

    if (progress.xp >= xpNeeded) {
      progress.level = currentLevel + 1;
      skillManager.saveProgress();

      this.showToast(`🎉 恭喜升级到 Lv.${progress.level}！`, 'success');
    }
  }

  /**
   * 获取维度标签
   */
  getDimensionLabel(key) {
    const labels = {
      unexpectedness: '意外性',
      appropriateness: '适切性',
      creativity: '创意性',
      naturalness: '自然度',
      precision: '精准度',
      emotionalControl: '情绪控制',
      elegance: '优雅度',
      strategicThinking: '战略高度',
      strategy: '策略运用',
      logic: '逻辑性',
      empathy: '情感共鸣',
      ethics: '伦理边界',
      identification: '识别准确度',
      firmness: '拒绝坚定度',
      expression: '表达技巧',
      selfProtection: '自我保护意识'
    };
    return labels[key] || key;
  }

  /**
   * 获取API设置
   */
  getAPISettings() {
    const settings = localStorage.getItem('aiSettings');
    if (settings) {
      return JSON.parse(settings);
    }

    return {
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: '',
      model: 'gpt-3.5-turbo'
    };
  }

  /**
   * HTML转义
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
      animation: slideIn 0.3s ease;
      max-width: 400px;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

export default DialogueEngine;
