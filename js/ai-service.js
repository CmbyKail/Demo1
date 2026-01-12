// js/ai-service.js

// 曾仕强智慧核心原则 (Scheme C)
const ZENG_PRINCIPLES = `
1. **外圆内方 (Round Outside, Square Inside)**: 为人处世要圆融，但内心原则要坚定。不可没有原则，也不可棱角太尖伤人。
2. **留面子 (Save Face)**: 无论是给别人还是给自己，都要留有余地。看破不说破，批评人要先肯定再指出不足。
3. **推拖拉 (Push, Drag, Pull)**: 不是为了偷懒，而是为了争取缓冲时间，让对方冷静，也让自己思考最稳妥的对策。
4. **合理 (Reasonableness)**: 中国人讲究"合理"而非绝对的"真理"。根据情境调整，合情合理才是最高标准。
5. **先做人后做事**: 事情做好了人没做好，功劳也是白搭；人做好了，事情做差了也有人帮你兜底。

【社会生存潜规则】
6. **先斩后奏 (Rule of Action)**: 如果想打破规矩做事，在不伤害对方前提下，直接做比先问许可更好。问了，对方为了避责只能拒绝；做了，对方往往睁只眼闭只眼（谁担责谁受益）。
7. **信息不对称 (Mystery & Control)**: 保持三分神秘，不要别人问什么答什么。对于不确定的邀约或敏感问题，模糊应对（"我不确定"、"再看看"），直到对方暴露真实意图，掌握主动权。
8. **利益绑定 (Respect Self-interest)**: 人性经不起考验，要百分百尊重人性趋利避害的本能。确保你的利益与对方一致，或者背叛你的成本极高，对方才不会背叛你。
`;

export async function analyzeResponse(scenario, userAnswer, settings) {
    if (!settings.apiKey) {
        throw new Error("请先在设置中配置 API Key");
    }

    const systemPrompt = `
你是一位精通中国传统智慧和人际关系的大师，深谙曾仕强教授的"中国式管理"和"人性管理"哲学。
你的任务是评估用户在特定高压场景下的回答，并给出基于曾仕强智慧的反馈。

【核心原则】
${ZENG_PRINCIPLES}

【输出格式】
请返回一个纯 JSON 对象（不要Markdown格式），包含以下字段：
{
    "score": 0-100的整数,
    "pros": ["优点1", "优点2", "优点3"],
    "cons": ["不足1", "不足2", "不足3"],
    "zeng_quote": "引用一句最贴切的曾仕强语录或上述原则",
    "key_formula": "公式总结：情境 + 核心原则 = 行动策略 (例如：老板批评 + 先做人后做事 = 诚恳认错不辩解)",
    "model_answer": "基于曾仕强智慧的满分示范回答",
    "radar_scores": {
        "empathy": 0-100 (共情能力),
        "communication": 0-100 (沟通技巧),
        "emotion_management": 0-100 (情绪管理),
        "conflict_resolution": 0-100 (冲突化解),
        "resilience": 0-100 (抗压能力),
        "social_insight": 0-100 (社会洞察)
    }
}
`;

    const userMessage = `
【场景】
标题：${scenario.title}
描述：${scenario.description}
背景：${scenario.context}

【用户的回答】
${userAnswer}

请根据场景评估用户的回答。
`;

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
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
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
        
        // 尝试解析 JSON
        try {
            // 有时候模型会包裹在 ```json ... ``` 中，需要清洗
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanContent);
        } catch (e) {
            console.error("JSON Parse Error:", content);
            throw new Error("AI 返回格式解析失败，请重试");
        }

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
}

export async function chatWithPersona(messages, scenario, settings) {
    if (!settings.apiKey) {
        throw new Error("请先在设置中配置 API Key");
    }

    const systemPrompt = `
你现在正在进行一个情商训练的角色扮演。
请根据场景描述扮演其中的关键角色（例如：愤怒的老板、哭泣的伴侣、挑衅的同事）。
你需要根据用户的回答做出真实的、符合人性的反应。
不要出戏，不要解释你的行为，直接以角色的身份对话。
反应要真实，如果用户回答得好，你可以态度软化；如果回答不好，你可以继续生气或刁难。

【场景信息】
标题：${scenario.title}
描述：${scenario.description}
背景：${scenario.context}

请保持对话简短有力，给用户压力。
`;

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
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} ${errorData.error?.message || ''}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("AI Chat Error:", error);
        throw error;
    }
}

export async function generateSimilarScenario(baseScenario, settings) {
    if (!settings.apiKey) {
        throw new Error("请先在设置中配置 API Key");
    }

    const systemPrompt = `
你是一位专业的情商训练场景设计师。
你的任务是根据用户提供的一个现有场景，设计一个新的、类似的高压场景，用于"举一反三"的练习。
新场景应该保持相同的核心冲突类型（如：被误解、被施压、情感危机），但必须改变具体的情境、人物和细节。

【输出格式】
请返回一个纯 JSON 对象（不要Markdown格式），包含以下字段：
{
    "id": "generated_${Date.now()}",
    "category": "${baseScenario.category}",
    "title": "新场景标题",
    "description": "新场景的详细描述（制造紧迫感）",
    "context": "新的时间、地点、人物背景",
    "isCustom": true
}
`;

    const userMessage = `
【原场景】
标题：${baseScenario.title}
描述：${baseScenario.description}
背景：${baseScenario.context}
分类：${baseScenario.category}

请设计一个新的类似场景。
`;

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
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.8 // slightly higher for creativity
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} ${errorData.error?.message || ''}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const scenario = JSON.parse(cleanContent);
            // Ensure ID is unique if the AI generated a static string
            scenario.id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            return scenario;
        } catch (e) {
            console.error("JSON Parse Error:", content);
            throw new Error("AI 生成场景格式解析失败");
        }

    } catch (error) {
        console.error("AI Gen Scenario Error:", error);
        throw error;
    }
}
