// js/modules/skills/HumorModule.js

/**
 * 幽默表达模块
 * 提供幽默感评估和AI对话功能
 */
export class HumorModule {
  static MODULE_ID = 'humor';

  /**
   * 获取评分Prompt
   * @param {string} userAnswer - 用户的回答
   * @returns {string} AI评分Prompt
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
   * @param {Object} scenario - 场景对象
   * @returns {string} AI对话Prompt
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
