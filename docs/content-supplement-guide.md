# 高级技能模块内容补充指南

> **目标受众**: 负责补充模块内容的AI助手
> **创建日期**: 2026-01-13
> **项目**: 情商训练营 (EQ Trainer)

---

## 📋 目录

1. [项目结构说明](#项目结构说明)
2. [补充其他3个模块内容](#补充其他3个模块内容)
3. [扩展幽默模块题目](#扩展幽默模块题目)
4. [数据格式规范](#数据格式规范)
5. [质量检查清单](#质量检查清单)

---

## 项目结构说明

### 关键文件位置

```
finalwork/
├── server_data.json          # ⭐ 核心数据文件（所有模块内容）
├── js/modules/skills/
│   ├── SkillModuleManager.js    # 数据管理类
│   ├── SkillModuleRenderer.js   # UI渲染类
│   ├── PracticeEngine.js        # 练习逻辑引擎
│   └── HumorModule.js           # 幽默模块AI评分Prompt
└── docs/
    └── content-supplement-guide.md  # 本文档
```

### 当前已完成模块

| 模块ID | 名称 | 状态 | 内容位置 |
|--------|------|------|----------|
| `humor` | 幽默表达 | ✅ 完整 | `server_data.json` 的 `skillModules.humor` |
| `retaliation` | 高情商反击 | 📋 框架 | `server_data.json` 的 `skillModules.retaliation` |
| `influence` | 影响力与说服 | 📋 框架 | `server_data.json` 的 `skillModules.influence` |
| `anti_pua` | 反操纵与拒绝 | 📋 框架 | `server_data.json` 的 `skillModules.anti_pua` |

---

## 补充其他3个模块内容

### 任务1️⃣: ⚔️ 高情商反击模块

#### 理论框架（4个反击层级）

```
Lv1 柔性化解 - 幽默回应、装傻充愣
Lv2 借力打力 - 用对方逻辑反击
Lv3 降维打击 - 揭露本质但不带脏字
Lv4 绝杀无言 - 一句话让对方闭嘴
```

#### 需要补充的位置

**文件**: `server_data.json`

**目标节点**: `skillModules.retaliation`

#### 具体要求

##### 1. 理论课程 (theoryLessons)

至少需要 **4个课程**，每个课程对应一个反击层级：

```json
{
  "id": "retaliation_01",
  "title": "Lv1 柔性化解：幽默是最好的盾牌",
  "content": "<h4>什么是柔性化解？</h4><p>详细说明...</p><h4>核心技巧</h4><ul><li>技巧1</li><li>技巧2</li></ul>",
  "examples": [
    {
      "bad": "对方嘲讽你，你生气地反驳",
      "good": "对方嘲讽你，你幽默地化解"
    }
  ]
}
```

**课程数量**: 至少4个
**内容要求**:
- 每个课程讲解一个反击层级
- 使用HTML格式（支持 `<h4>`, `<p>`, `<ul>`, `<li>` 等标签）
- 至少包含2个示例对比（bad vs good）
- 总字数：每个课程500-800字

##### 2. 练习题目 (exercises)

至少需要 **15个练习题**，题型包括：

**题型A: 补全句子** (type: "complete_sentence")
```json
{
  "id": "retaliation_ex_01",
  "type": "complete_sentence",
  "prompt": "同事说：'你这个方案太幼稚了吧。' 你笑着回应：",
  "skill": ["柔性化解", "幽默"],
  "hint": "用自嘲或幽默的方式化解"
}
```

**题型B: 识别攻击类型** (type: "identify")
```json
{
  "id": "retaliation_ex_05",
  "type": "identify",
  "prompt": "请判断下面这句话属于哪种攻击类型：\n'你从来都不听别人的意见，太自私了'",
  "options": ["嘲讽", "打压", "道德绑架", "人身攻击"],
  "correctAnswer": 1,
  "skill": ["识别攻击"]
}
```

**题型C: 选择反击策略** (type: "choose_strategy")
```json
{
  "id": "retaliation_ex_10",
  "type": "choose_strategy",
  "scenario": "老板当众批评你的工作，但他说的并不对",
  "strategies": [
    {"id": "A", "text": "当场反驳", "level": "Lv4"},
    {"id": "B", "text": "柔性化解，会后沟通", "level": "Lv1"},
    {"id": "C", "text": "沉默不语", "level": "无"}
  ],
  "correctAnswer": "B",
  "explanation": "当场反驳会激化矛盾，沉默不语会显得软弱，柔性化解最合适"
}
```

**题目数量**: 至少15个
**题型分布**: 补全句子(8个) + 识别攻击(4个) + 选择策略(3个)

##### 3. 实战场景 (scenarios)

至少需要 **5个实战场景**：

```json
{
  "id": "retaliation_scenario_01",
  "title": "应对杠精同事",
  "description": "你的同事总是喜欢反驳别人，无论你说什么他都要唱反调。今天你又遇到了他...",
  "role": "你扮演那个杠精同事",
  "goal": "用高情商的方式让对方闭嘴，但不得罪他",
  "difficulty": "Lv2",
  "openingLine": "哎哟，你这个想法也太天真了吧，现实哪有这么简单？"
}
```

**场景数量**: 至少5个
**难度分布**: Lv1(2个) + Lv2(2个) + Lv3(1个) + Lv4(可选)

#### 评分Prompt文件

需要创建新文件: `js/modules/skills/RetaliationModule.js`

**评分维度**:
- 回击精准度 (35%)
- 情绪控制 (25%)
- 语言优雅度 (25%)
- 战略高度 (15%)

**文件模板**:
```javascript
export class RetaliationModule {
  static getScoringPrompt(userAnswer) {
    return `
你是一个高情商反击专家。评估用户的回答：${userAnswer}

评分维度（每项0-100分）：
1. 回击精准度（35%）：是否精准识别对方攻击意图并有效反击
2. 情绪控制（25%）：是否保持冷静，不情绪化
3. 语言优雅度（25%）：是否不带脏字，用词得体
4. 战略高度（15%）：是否有智慧，能否让对方反思

请以JSON格式返回：
{
  "score": 总分（0-100）,
  "dimensionScores": {
    "precision": 分数,
    "emotionalControl": 分数,
    "elegance": 分数,
    "strategicThinking": 分数
  },
  "feedback": "简短评价（100字内）",
  "highlights": ["亮点1", "亮点2"],
  "suggestions": ["改进建议1", "改进建议2"],
  "betterAnswer": "更高情商的回答示例"
}
`;
  }

  static getChatPrompt(scenario) {
    return `
你是一个高情商反击训练的AI对话伙伴。
场景：${scenario.description}
你的角色：${scenario.role}
用户目标：${scenario.goal}

请你扮演${scenario.role}，用${scenario.openingLine}开始对话。

评估用户的反击：
- 是否保持冷静不情绪化
- 是否精准识别你的攻击意图
- 反击是否优雅不带脏字
- 是否有战略高度

每轮回复后，给用户简短反馈（可选）。
`;
  }
}
```

---

### 任务2️⃣: 💪 影响力与说服模块

#### 理论框架（CIALD模型）

```
C - Commitment 承诺一致
I - Influence 社会认同
A - Authority 权威效应
L - Liking 喜好原则
D - Darity 稀缺性
E - Emotional 情感共鸣
```

#### 需要补充的位置

**文件**: `server_data.json`

**目标节点**: `skillModules.influence`

#### 具体要求

##### 1. 理论课程 (theoryLessons)

至少需要 **6个课程**，每个课程讲解一个原则：

```json
{
  "id": "influence_01",
  "title": "原则1：承诺一致 - 让人言行一致",
  "content": "<h4>什么是承诺一致原则？</h4><p>详细说明...</p><h4>应用场景</h4><ul><li>销售</li><li>恋爱</li><li>职场</li></ul><h4>⚠️ 伦理提醒</h4><p>影响力不等于操纵，必须尊重对方意愿...</p>",
  "examples": [
    {
      "scenario": "销售场景",
      "bad": "强迫顾客购买",
      "good": "先让顾客小承诺，再逐步引导"
    }
  ]
}
```

**课程数量**: 6个（对应6个原则）
**内容要求**:
- 每个课程讲解一个影响力原则
- **必须包含"伦理提醒"章节**（影响力≠操纵）
- 至少2个场景示例（销售/恋爱/职场）
- 总字数：每个课程600-900字

##### 2. 练习题目 (exercises)

至少需要 **18个练习题**：

**题型A: 识别原则** (type: "identify_principle")
```json
{
  "id": "influence_ex_01",
  "type": "identify_principle",
  "scenario": "销售员先让顾客试穿衣服，再推荐其他配饰",
  "question": "这运用了哪个影响力原则？",
  "options": ["承诺一致", "社会认同", "权威效应", "稀缺性"],
  "correctAnswer": 0,
  "explanation": "试穿是承诺，顾客承诺后会倾向购买更多"
}
```

**题型B: 设计策略** (type: "design_strategy")
```json
{
  "id": "influence_ex_07",
  "type": "design_strategy",
  "scenario": "你想约暗恋的人出来，但对方比较害羞",
  "goal": "运用喜好原则设计邀请策略",
  "prompt": "请设计一个邀请方案：",
  "keyPoints": ["找到共同兴趣", "创造相似感", "真诚赞美"]
}
```

**题型C: 话术填空** (type: "fill_script")
```json
{
  "id": "influence_ex_13",
  "type": "fill_script",
  "scenario": "客户犹豫购买你的产品",
  "framework": "稀缺性原则",
  "template": "王先生，这个套餐_______，目前_______，如果您_______",
  "hint": "运用稀缺性，但不要过度制造焦虑"
}
```

**题目数量**: 至少18个
**题型分布**: 识别原则(6个) + 设计策略(6个) + 话术填空(6个)

##### 3. 实战场景 (scenarios)

至少需要 **6个实战场景**：

```json
{
  "id": "influence_scenario_01",
  "title": "销售谈判 - 高端客户",
  "description": "客户是一位成功的企业家，对你的产品有兴趣但还在犹豫...",
  "role": "你扮演那位成功的企业家客户",
  "goal": "运用影响力原则说服客户，但不能操纵或强迫",
  "principle": "混合运用多个原则",
  "difficulty": "高级",
  "openingLine": "你们的产品确实不错，但价格方面还需要再考虑考虑"
}
```

**场景数量**: 至少6个
**场景分布**: 销售(2个) + 恋爱(2个) + 职场(2个)

#### 评分Prompt文件

需要创建新文件: `js/modules/skills/InfluenceModule.js`

**评分维度**:
- 策略运用 (40%)
- 逻辑性 (25%)
- 情感共鸣 (20%)
- **伦理边界 (15%)** ⚠️ 重要

**文件模板**:
```javascript
export class InfluenceModule {
  static getScoringPrompt(userAnswer) {
    return `
你是一个影响力与说服专家。评估用户的回答：${userAnswer}

评分维度（每项0-100分）：
1. 策略运用（40%）：是否有效运用影响力原则
2. 逻辑性（25%）：论证是否合理，是否有说服力
3. 情感共鸣（20%）：是否能打动对方，建立连接
4. 伦理边界（15%）：是否尊重对方，不操纵不强迫

⚠️ 伦理检测：
如果检测到以下操纵行为，总分不超过50分：
- 制造过度焦虑
- 利用对方弱点
- 虚假承诺
- 伪装信息

请以JSON格式返回：
{
  "score": 总分（0-100）,
  "dimensionScores": {
    "strategy": 分数,
    "logic": 分数,
    "empathy": 分数,
    "ethics": 分数
  },
  "feedback": "简短评价（100字内）",
  "highlights": ["亮点1", "亮点2"],
  "suggestions": ["改进建议1", "改进建议2"],
  "betterAnswer": "更有效的说服示例",
  "ethicsAlert": "伦理警告（如有）"
}
`;
  }

  static getChatPrompt(scenario) {
    return `
你是一个影响力与说服训练的AI对话伙伴。
场景：${scenario.description}
你的角色：${scenario.role}
用户目标：${scenario.goal}

请你扮演${scenario.role}，用${scenario.openingLine}开始对话。

⚠️ 重要：你要持续评估用户的伦理边界：
- 是否在说服而非操纵
- 是否尊重你的选择权
- 是否使用正当手段

如果检测到操纵行为，请提醒："⚠️ 这可能接近操纵边界，建议..."
`;
  }
}
```

---

### 任务3️⃣: 🛡️ 反操纵与拒绝模块

#### 理论框架（5大操纵模式）

```
1. Gaslighting（煤气灯效应）- 质疑你的记忆/理智
2. Guilt-tripping（道德绑架）- 让你感到内疚
3. Love bombing（爱情轰炸）- 过度好意后控制
4. Negging（打压式赞美）- 先贬后褒
5. Moving goalposts（移动目标）- 永远不够好
```

#### 需要补充的位置

**文件**: `server_data.json`

**目标节点**: `skillModules.anti_pua`

#### 具体要求

##### 1. 理论课程 (theoryLessons)

至少需要 **5个课程**，每个课程讲解一种操纵模式：

```json
{
  "id": "anti_pua_01",
  "title": "模式1：煤气灯效应 - 当你开始怀疑自己",
  "content": "<h4>什么是煤气灯效应？</h4><p>详细说明...</p><h4>典型话术</h4><ul><li>'你记错了吧？'</li><li>'你想太多了'</li></ul><h4>识别信号</h4><ol><li>开始怀疑自己的记忆</li><li>...</li></ol><h4>应对策略</h4><p>建立边界，信任自己...</p>",
  "examples": [
    {
      "manipulation": "对方说：'我从没那么说，是你记错了'",
      "response": "正确回应：'我清楚地记得你说过，请不要质疑我的记忆'"
    }
  ]
}
```

**课程数量**: 5个（对应5种操纵模式）
**内容要求**:
- 每个课程包含：定义、典型话术、识别信号、应对策略
- 至少2个对话示例
- 总字数：每个课程600-900字

##### 2. 练习题目 (exercises)

至少需要 **15个练习题**：

**题型A: 识别操纵** (type: "identify_manipulation")
```json
{
  "id": "anti_pua_ex_01",
  "type": "identify_manipulation",
  "dialogue": "男友说：'如果你真的爱我，就会为我做这件事'",
  "question": "这是什么类型的操纵？",
  "options": ["煤气灯效应", "道德绑架", "爱情轰炸", "打压式赞美"],
  "correctAnswer": 1,
  "explanation": "这是典型的道德绑架，用'爱'来绑架你的选择"
}
```

**题型B: 拆解操纵手法** (type: "analyze_manipulation")
```json
{
  "id": "anti_pua_ex_06",
  "type": "analyze_manipulation",
  "dialogue": "完整的对话段落（3-5句）",
  "question": "请圈出哪些句子是操纵行为，并说明属于哪种类型",
  "manipulationPoints": [
    {"sentence": "句子1", "type": "道德绑架", "reason": "理由"},
    {"sentence": "句子3", "type": "打压式赞美", "reason": "理由"}
  ]
}
```

**题型C: 设计拒绝话术** (type: "design_refusal")
```json
{
  "id": "anti_pua_ex_11",
  "type": "design_refusal",
  "scenario": "同事总是把自己的工作推给你，说'你能力强，帮个忙呗'",
  "manipulationType": "道德绑架 + 捧杀",
  "prompt": "请用'我字句'设计一个坚定的拒绝话术：",
  "requirements": ["使用'我觉得'/'我需要'", "不带歉意", "不解释过多", "提供替代方案（可选）"],
  "example": "我理解你的需求，但我现在手头有重要工作。建议你可以找其他同事或和主管沟通分配。"
}
```

**题目数量**: 至少15个
**题型分布**: 识别操纵(5个) + 拆解手法(5个) + 设计拒绝(5个)

##### 3. 实战场景 (scenarios)

至少需要 **5个实战场景**：

```json
{
  "id": "anti_pua_scenario_01",
  "title": "识别并拒绝情感操纵",
  "description": "你在一段关系中，对方总是让你感到不安，但你又说不出哪里不对...",
  "role": "你扮演有操纵倾向的伴侣",
  "goal": "识别操纵模式，建立边界，优雅拒绝",
  "manipulationTypes": ["爱情轰炸", "打压式赞美", "煤气灯效应"],
  "difficulty": "高级",
  "openingLine": "亲爱的，你看我对你多好，别人都做不到我这样。但你今天怎么对我这么冷淡？"
}
```

**场景数量**: 至少5个
**场景类型**: 情感关系(2个) + 职场(2个) + 销售/消费(1个)

#### 评分Prompt文件

需要创建新文件: `js/modules/skills/AntiPuaModule.js`

**评分维度**:
- 识别准确度 (35%)
- 拒绝坚定度 (30%)
- 表达技巧 (20%)
- 自我保护意识 (15%)

**文件模板**:
```javascript
export class AntiPuaModule {
  static getScoringPrompt(userAnswer) {
    return `
你是一个反操纵专家。评估用户的回答：${userAnswer}

评分维度（每项0-100分）：
1. 识别准确度（35%）：是否准确识别操纵模式
2. 拒绝坚定度（30%）：是否明确拒绝，不含糊其辞
3. 表达技巧（20%）：是否使用"我字句"，是否有理有据
4. 自我保护意识（15%）：是否建立边界，保护自己

请以JSON格式返回：
{
  "score": 总分（0-100）,
  "dimensionScores": {
    "identification": 分数,
    "firmness": 分数,
    "expression": 分数,
    "selfProtection": 分数
  },
  "feedback": "简短评价（100字内）",
  "highlights": ["亮点1", "亮点2"],
  "suggestions": ["改进建议1", "改进建议2"],
  "betterAnswer": "更有效的拒绝示例",
  "identifiedManipulation": "识别出的操纵类型"
}
`;
  }

  static getChatPrompt(scenario) {
    return `
你是一个反操纵训练的AI对话伙伴。
场景：${scenario.description}
你的角色：${scenario.role}
用户目标：${scenario.goal}

操纵模式：${scenario.manipulationTypes.join(', ')}

请你扮演${scenario.role}，用${scenario.openingLine}开始对话。

你要使用${scenario.manipulationTypes.join('、')}等操纵手段。

评估用户：
- 是否识别出你的操纵意图
- 拒绝是否坚定明确
- 是否用"我字句"表达
- 是否建立了有效边界

每轮回复后，给用户简短反馈。
`;
  }
}
```

---

## 扩展幽默模块题目

### 当前状态

幽默模块已有：
- ✅ 3个理论课程
- ✅ 15个练习题目
- ✅ 3个实战场景

### 扩展目标

将练习题目从 **15个扩展到50个**

### 扩展位置

**文件**: `server_data.json`
**目标节点**: `server_data.skillModules.humor.exercises`

### 扩展策略

#### 按技能点分类扩展

| 技能点 | 当前数量 | 目标数量 | 新增 |
|--------|----------|----------|------|
| 意外性（铺垫+反转） | 5 | 15 | +10 |
| 共情（自嘲+观察） | 5 | 15 | +10 |
| 语言技巧（夸张+比喻+双关） | 5 | 20 | +15 |

#### 题目类型分布

**补全句子** (60% = 30题)
```json
{
  "id": "humor_ex_16",
  "type": "complete_sentence",
  "prompt": "朋友问你现在是不是单身，你幽默地回应：",
  "skill": ["自嘲"],
  "hint": "用自嘲的方式，既幽默又不失体面"
}
```

**改写练习** (25% = 12题)
```json
{
  "id": "humor_ex_30",
  "type": "rewrite",
  "originalText": "今天工作好累，我不想说话。",
  "targetSkill": "夸张",
  "prompt": "请用夸张手法改写这句话，让它更幽默",
  "exampleAnswer": "今天工作累到我觉得自己的灵魂已经离职了，身体还在自动运行。"
}
```

**技巧配对** (10% = 5题)
```json
{
  "id": "humor_ex_45",
  "type": "match_technique",
  "question": "将左边的笑话与右边的幽默技巧配对：",
  "pairs": [
    {"joke": "我减肥不是因为我胖，是因为我太重了", "technique": "双关"},
    {"joke": "我这人有三好：你好、他好、大家好", "technique": "谐音"}
  ]
}
```

**情景创作** (5% = 3题)
```json
{
  "id": "humor_ex_50",
  "type": "create_humor",
  "scenario": "电梯里遇到老板，气氛尴尬",
  "skill": "观察式幽默",
  "prompt": "请用观察式幽默化解尴尬",
  "constraints": ["不超过2句话", "不冒犯他人", "符合场合"]
}
```

### 场景扩展

将实战场景从 **3个扩展到10个**

**场景类型分布**:
- 聚会破冰: 3个
- 化解尴尬: 3个
- 活跃气氛: 2个
- 自我介绍: 2个

```json
{
  "id": "humor_scenario_04",
  "title": "相亲破冰",
  "description": "你和一个陌生人相亲，刚开始双方都比较拘谨...",
  "role": "你扮演相亲对象",
  "goal": "用幽默打破僵局，让气氛轻松起来",
  "difficulty": "中级",
  "openingLine": "呃...那个，这里的菜还不错吧？"
}
```

---

## 数据格式规范

### JSON格式要求

1. **编码**: UTF-8
2. **缩进**: 2个空格
3. **引号**: 双引号
4. **逗号**: 对象/数组最后一项不加逗号

### 字段验证清单

#### 理论课程 (theoryLessons)
- [ ] `id`: 唯一标识，格式：`{模块id}_{数字}`
- [ ] `title`: 课程标题
- [ ] `content`: HTML格式内容
- [ ] `examples`: 至少2个示例对比

#### 练习题目 (exercises)
- [ ] `id`: 唯一标识，格式：`{模块id}_ex_{数字}`
- [ ] `type`: 题型（complete_sentence/rewrite/identify等）
- [ ] `prompt`: 题目描述
- [ ] `skill`: 关联技能标签（数组）
- [ ] `hint`: 提示信息（可选）

#### 实战场景 (scenarios)
- [ ] `id`: 唯一标识，格式：`{模块id}_scenario_{数字}`
- [ ] `title`: 场景标题
- [ ] `description`: 场景描述
- [ ] `role`: AI扮演的角色
- [ ] `goal`: 用户目标
- [ ] `difficulty`: 难度等级
- [ ] `openingLine`: 开场白

### 内容质量标准

#### 理论课程
- ✅ 结构清晰，逻辑严密
- ✅ 举例恰当，易于理解
- ✅ 语言生动，不枯燥
- ✅ 符合中文表达习惯
- ❌ 避免过于学术化

#### 练习题目
- ✅ 题目描述清晰明确
- ✅ 难度适中，循序渐进
- ✅ 答案开放性合理（非标准答案题）
- ✅ 提示信息有帮助但不剧透
- ❌ 避免歧义或多解

#### 实战场景
- ✅ 场景真实贴近生活
- ✅ 目标明确可达成
- ✅ 开场白自然引发互动
- ✅ 难度评级准确
- ❌ 避免极端或虚构场景

---

## 质量检查清单

### 完成后必做检查

#### JSON格式检查
```bash
# 使用Python验证JSON格式
python -m json.tool server_data.json
```

应该无错误输出。

#### 数据完整性检查
- [ ] 所有4个模块的 `skillModules` 节点都存在
- [ ] 每个模块都有 `theoryLessons`, `exercises`, `scenarios`
- [ ] 所有 `id` 字段唯一
- [ ] 所有数组项都有必需字段

#### 内容质量检查
- [ ] 所有课程内容使用HTML格式正确
- [ ] 所有示例对比（bad vs good）有意义
- [ ] 练习题目覆盖所有技能点
- [ ] 实战场景难度分布合理

#### Prompt文件检查
- [ ] 每个新模块都有对应的 `*Module.js` 文件
- [ ] 评分维度与设计文档一致
- [ ] JSON返回格式完整
- [ ] 包含伦理提醒（影响力模块）

### 测试验证

#### 1. 启动服务器
```bash
python server.py
```

#### 2. 访问应用
打开浏览器访问 `http://localhost:8000`

#### 3. 功能测试
- [ ] 主页显示4个技能卡片
- [ ] 点击卡片进入模块界面
- [ ] 理论Tab正常显示课程
- [ ] 练习Tab可正常答题
- [ ] AI评分返回正确JSON
- [ ] 进度正确保存到LocalStorage

#### 4. 数据测试
- [ ] 完成理论课程后解锁练习
- [ ] 练习评分后更新XP和等级
- [ ] 刷新页面数据不丢失

---

## 附录：文件位置速查表

### 需要修改的文件

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| **补充内容** | `server_data.json` | 所有模块的内容数据 |
| **反击模块Prompt** | `js/modules/skills/RetaliationModule.js` | 新建 |
| **影响力模块Prompt** | `js/modules/skills/InfluenceModule.js` | 新建 |
| **反操纵模块Prompt** | `js/modules/skills/AntiPuaModule.js` | 新建 |
| **注册新模块** | `js/app.js` | 导入新Prompt类 |

### 需要在app.js中添加的代码

当创建新的Module文件后，需要在 `js/app.js` 中添加导入：

```javascript
// 在文件顶部的导入区域添加
import { RetaliationModule } from './modules/skills/RetaliationModule.js';
import { InfluenceModule } from './modules/skills/InfluenceModule.js';
import { AntiPuaModule } from './modules/skills/AntiPuaModule.js';

// 在 PracticeEngine 类的 scoreAnswer 方法中添加路由
async scoreAnswer(userAnswer, moduleId) {
  switch (moduleId) {
    case 'humor':
      return this.scoreHumorAnswer(userAnswer);
    case 'retaliation':
      return this.scoreWithModule(userAnswer, RetaliationModule);
    case 'influence':
      return this.scoreWithModule(userAnswer, InfluenceModule);
    case 'anti_pua':
      return this.scoreWithModule(userAnswer, AntiPuaModule);
    default:
      throw new Error(`Unknown module: ${moduleId}`);
  }
}

// 添加通用评分方法
async scoreWithModule(userAnswer, moduleClass) {
  const prompt = moduleClass.getScoringPrompt(userAnswer);
  // ... 调用API的代码
}
```

---

## 常见问题

### Q1: 如何确保ID不重复？
**A**: 建议按以下规则命名：
- 课程: `{模块id}_{两位数序号}`，如 `retaliation_01`, `retaliation_02`
- 练习: `{模块id}_ex_{两位数序号}`，如 `retaliation_ex_01`
- 场景: `{模块id}_scenario_{两位数序号}`，如 `retaliation_scenario_01`

### Q2: HTML内容可以使用哪些标签？
**A**: 推荐使用安全的HTML标签：
- 标题: `<h4>`, `<h5>`
- 段落: `<p>`
- 列表: `<ul>`, `<ol>`, `<li>`
- 强调: `<strong>`, `<em>`
- 分隔: `<hr>`

避免使用：`<script>`, `<iframe>`, `<style>` 等可能引发安全问题的标签。

### Q3: 练习题目是否需要标准答案？
**A**: 取决于题型：
- **补全句子/改写练习**: 不需要标准答案，AI会评分
- **识别题/选择题**: 需要在JSON中提供 `correctAnswer`
- **创作题**: 不需要标准答案，AI会评分

### Q4: 如何确定题目难度？
**A**: 参考标准：
- **简单**: 直接应用技巧，场景熟悉
- **中等**: 需要组合技巧，场景稍复杂
- **困难**: 需要灵活应变，场景压力大

### Q5: 伦理提醒应该如何写？
**A**: 针对影响力模块，每个理论课程都应该包含：
```html
<h4>⚠️ 伦理提醒</h4>
<p>影响力的核心是<strong>双赢</strong>，而非<strong>操纵</strong>。</p>
<p>❌ 不要：利用他人弱点、制造焦虑、虚假承诺</p>
<p>✅ 应该：尊重对方意愿、提供真实价值、建立长期关系</p>
```

---

## 总结

本指南提供了完整的补充内容说明：

1. **3个待补充模块**（反击、影响力、反操纵）
   - 每个模块：理论课程 + 练习题目 + 实战场景 + Prompt文件

2. **幽默模块扩展**
   - 练习题目：15 → 50
   - 实战场景：3 → 10

3. **质量保证**
   - JSON格式验证
   - 内容完整性检查
   - 功能测试验证

请按照本指南逐个模块、逐项内容进行补充，确保质量和一致性。

---

*文档版本: 1.0*
*最后更新: 2026-01-13*
*维护者: Claude Code*
