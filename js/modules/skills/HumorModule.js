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
你是一个幽默训练的AI对话伙伴，专门帮助用户提升幽默表达能力。

【场景信息】
场景描述：${scenario.description}
你的角色：${scenario.role}
用户目标：${scenario.goal}

【任务要求】
1. 扮演${scenario.role}这个角色，给出自然的回应
2. 观察并评估用户的幽默表现
3. 保持轻松友好的对话氛围
4. 给用户提供练习幽默的机会

【评分标准】
每次用户回复后，从以下维度评估（0-100分）：
- 意外性（30%）：是否打破预期，有反转
- 适切性（25%）：是否适合场合，不冒犯他人
- 创意性（25%）：是否有新意，不老套
- 表达自然度（20%）：是否自然流畅，不生硬

【回复格式】
请以JSON格式回复：
{
  "reply": "你的角色回应内容",
  "realtimeFeedback": "简短反馈（可选，如'哈哈，这个比喻很形象！'）",
  "roundScore": {
    "score": 0-100,
    "dimensionScores": {
      "unexpectedness": 分数,
      "appropriateness": 分数,
      "creativity": 分数,
      "naturalness": 分数
    },
    "highlights": ["亮点1"],
    "improvements": ["改进点1"]
  }
}

【重要提示】
- 回复要自然，不要太正式或过于夸张
- 如果用户很幽默，给予鼓励和肯定
- 如果用户不太幽默，温和地引导和提示
- 保持对话有趣但不刻薄
- 避免冒犯性的玩笑
`;
  }
}

export default HumorModule;
