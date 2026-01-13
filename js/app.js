import { analyzeResponse, generateSimilarScenario, chatWithPersona } from './ai-service.js';
import { getAllCategories, getRandomScenario, getScenarioById, getAllScenarios } from './scenarios.js';
import { getHistory, getSettings, initStorage, isFavorite, saveCustomScenario, saveHistory, saveSettings, toggleFavorite } from './storage.js';
import { Analytics } from './analytics.js';
import { Gamification } from './gamification.js';

// 技能模块
import { skillManager } from './modules/skills/SkillModuleManager.js';
// import { HumorModule } from './modules/skills/HumorModule.js'; // TODO: Task 6创建后启用

// DOM Elements
const views = {
    welcome: document.getElementById('welcome-view'),
    training: document.getElementById('training-view'),
    feedback: document.getElementById('feedback-view')
};

const elements = {
    categoryList: document.getElementById('category-list'),
    historyList: document.getElementById('history-list'),
    scenarioTitle: document.getElementById('scenario-title'),
    scenarioCategory: document.getElementById('scenario-category'),
    scenarioDescription: document.getElementById('scenario-description'),
    scenarioContext: document.getElementById('scenario-context'),
    timer: document.getElementById('timer'),
    userAnswer: document.getElementById('user-answer'),
    submitBtn: document.getElementById('submit-btn'),
    cancelTrainingBtn: document.getElementById('cancel-training-btn'),
    backHomeBtn: document.getElementById('back-home-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    cancelSettingsBtn: document.getElementById('cancel-settings-btn'),
    injectTestDataBtn: document.getElementById('inject-test-data-btn'),
    
    // Custom Scenario Elements
    addScenarioBtn: document.getElementById('add-scenario-btn'),
    addScenarioModal: document.getElementById('add-scenario-modal'),
    saveScenarioBtn: document.getElementById('save-scenario-btn'),
    cancelScenarioBtn: document.getElementById('cancel-scenario-btn'),
    customTitle: document.getElementById('custom-title'),
    customCategory: document.getElementById('custom-category'),
    customDesc: document.getElementById('custom-desc'),
    customContext: document.getElementById('custom-context'),

    // Favorites
    favBtn: document.getElementById('fav-btn'),

    // Feedback
    feedbackScore: document.getElementById('feedback-score'),
    feedbackPros: document.getElementById('feedback-pros'),
    feedbackCons: document.getElementById('feedback-cons'),
    zengQuote: document.getElementById('zeng-quote'),
    modelAnswer: document.getElementById('model-answer'),
    feedbackFormula: document.getElementById('feedback-formula'),
    practiceSimilarBtn: document.getElementById('practice-similar-btn'),
    
    // History Modal
    historyModal: document.getElementById('history-modal'),
    closeHistoryBtn: document.getElementById('close-history-btn'),
    histTitle: document.getElementById('hist-title'),
    histAnswer: document.getElementById('hist-answer'),
    histScore: document.getElementById('hist-score'),
    histFeedback: document.getElementById('hist-feedback'),
    histModel: document.getElementById('hist-model'),
    histFormula: document.getElementById('hist-formula'),
    histPracticeBtn: document.getElementById('hist-practice-btn')
};

// State
let currentScenario = null;
let timerInterval = null;
let timeLeft = 120; // 2 minutes
let chatHistory = [];

// Initialization
async function init() {
    await initStorage();
    await skillManager.loadModules();
    renderCategories();
    renderHistory();
    renderContributionGraph();
    renderGamification();
    renderStats();
    renderRecommendation();
    setupDailyChallenge();
    bindEvents();
}

function renderCategories() {
    const categories = getAllCategories();
    elements.categoryList.innerHTML = categories.map(cat => `
        <div class="category-card" data-id="${cat.id}">
            <span class="category-icon">${cat.icon}</span>
            <h4>${cat.name}</h4>
            <span class="start-tag">开始练习</span>
        </div>
    `).join('');
}

function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
        elements.historyList.innerHTML = '<li>暂无记录</li>';
        return;
    }
    elements.historyList.innerHTML = history.slice(0, 5).map((record, index) => `
        <li data-index="${index}">
            <div>
                <strong>${record.scenarioTitle}</strong>
                <div style="font-size:0.8em;color:#666">${new Date(record.date).toLocaleDateString()}</div>
            </div>
            <span style="font-weight:bold;color:var(--primary-color)">${record.score}分</span>
        </li>
    `).join('');
}

function bindEvents() {
    // Category Selection
    elements.categoryList.addEventListener('click', (e) => {
        const card = e.target.closest('.category-card');
        if (card) {
            startScenario(card.dataset.id);
        }
    });

    // History Click (Playback)
    elements.historyList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li) {
            const index = li.dataset.index;
            showHistoryDetail(index);
        }
    });

    // Close History Modal
    elements.closeHistoryBtn.addEventListener('click', () => {
        elements.historyModal.classList.add('hidden');
    });

    // Submit Answer
    elements.submitBtn.addEventListener('click', handleSubmit);

    // Cancel Training
    elements.cancelTrainingBtn.addEventListener('click', cancelScenario);

    // Practice Similar (Feedback View)
    elements.practiceSimilarBtn.addEventListener('click', () => {
        if (currentScenario) {
            handlePracticeSimilar(currentScenario);
        }
    });

    // Practice Similar (History Modal)
    elements.histPracticeBtn.addEventListener('click', () => {
        // Need to find the scenario from history
        // But history records store scenarioId, title, etc.
        // We can reconstruct a basic scenario object for the generator
        const histTitle = elements.histTitle.textContent;
        // Ideally we should pass the full record or scenario object.
        // Let's modify showHistoryDetail to store the current viewed record index or data.
        const currentHistIndex = elements.historyModal.dataset.currentIndex;
        if (currentHistIndex !== undefined) {
            const history = getHistory();
            const record = history[currentHistIndex];
            if (record) {
                // Construct a partial scenario object enough for the AI
                const baseScenario = {
                    title: record.scenarioTitle,
                    description: "（来自历史记录）", // AI might need description, but title/category usually enough for "similar"
                    category: "历史练习", // Or try to find original category if stored
                    context: "..."
                };
                handlePracticeSimilar(baseScenario);
            }
        }
    });

    // Back Home
    elements.backHomeBtn.addEventListener('click', () => switchView('welcome'));

    // Settings
    elements.settingsBtn.addEventListener('click', () => {
        const settings = getSettings();
        document.getElementById('api-endpoint').value = settings.apiEndpoint;
        document.getElementById('api-key').value = settings.apiKey;
        document.getElementById('api-model').value = settings.model;
        elements.settingsModal.classList.remove('hidden');
    });

    elements.cancelSettingsBtn.addEventListener('click', () => {
        elements.settingsModal.classList.add('hidden');
    });

    elements.saveSettingsBtn.addEventListener('click', () => {
        const newSettings = {
            apiEndpoint: document.getElementById('api-endpoint').value,
            apiKey: document.getElementById('api-key').value,
            model: document.getElementById('api-model').value
        };
        saveSettings(newSettings);
        elements.settingsModal.classList.add('hidden');
        alert('设置已保存');
    });

    // Inject Test Data
    elements.injectTestDataBtn.addEventListener('click', () => {
        if (!confirm('这将写入3条测试历史记录，确定吗？')) return;
        
        const testData = [
            {
                date: new Date().toISOString(),
                scenarioId: 'work_1',
                scenarioTitle: '领导分配不合理任务',
                userAnswer: '我会先尝试理解任务的背景，然后委婉地提出我的困难...',
                score: 85,
                feedback: {
                    score: 85,
                    pros: ['态度端正', '沟通技巧不错'],
                    cons: ['可以更具体一些'],
                    zeng_quote: '做事要圆融，做人要方正。',
                    key_formula: '接受态度 + 实际困难 + 替代方案 = 有效拒绝',
                    model_answer: '领导，我非常想承担这个任务，但是目前手头项目工期很紧...'
                }
            },
            {
                date: new Date(Date.now() - 86400000).toISOString(),
                scenarioId: 'emotion_1',
                scenarioTitle: '伴侣抱怨你没时间陪TA',
                userAnswer: '对不起，最近太忙了，周末一定陪你。',
                score: 70,
                feedback: {
                    score: 70,
                    pros: ['有道歉意愿'],
                    cons: ['回应过于敷衍', '没有具体行动计划'],
                    zeng_quote: '家庭是讲爱的地方，不是讲理的地方。',
                    key_formula: '共情认可 + 诚恳道歉 + 具体补偿 = 情感修复',
                    model_answer: '亲爱的，我知道最近忽略了你的感受，让你受委屈了，真的对不起...'
                }
            }
        ];

        testData.forEach(record => saveHistory(record));
        alert('测试数据已写入！');
        renderHistory();
        elements.settingsModal.classList.add('hidden');
    });

    // Custom Scenario Events
    elements.addScenarioBtn.addEventListener('click', () => {
        elements.addScenarioModal.classList.remove('hidden');
    });

    elements.cancelScenarioBtn.addEventListener('click', () => {
        elements.addScenarioModal.classList.add('hidden');
    });

    elements.saveScenarioBtn.addEventListener('click', () => {
        const title = elements.customTitle.value.trim();
        const category = elements.customCategory.value;
        const desc = elements.customDesc.value.trim();
        const context = elements.customContext.value.trim();

        if (!title || !desc) {
            alert('标题和描述不能为空');
            return;
        }

        const newScenario = {
            id: 'custom_' + Date.now(),
            title: title,
            category: category,
            description: desc,
            context: context || '无特定背景'
        };

        if (saveCustomScenario(newScenario)) {
            alert('题目添加成功！');
            elements.addScenarioModal.classList.add('hidden');
            // Clear inputs
            elements.customTitle.value = '';
            elements.customDesc.value = '';
            elements.customContext.value = '';
            // Refresh categories
            renderCategories();
        } else {
            alert('保存失败，请重试');
        }
    });

    // Favorite Button
    elements.favBtn.addEventListener('click', () => {
        if (!currentScenario) return;
        
        const isFav = toggleFavorite(currentScenario.id);
        updateFavoriteBtn(isFav);
    });

    // Chat Mode Toggle
    document.querySelectorAll('input[name="training-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'single') {
                document.getElementById('single-mode-area').classList.remove('hidden');
                document.getElementById('chat-mode-area').classList.add('hidden');
            } else {
                document.getElementById('single-mode-area').classList.add('hidden');
                document.getElementById('chat-mode-area').classList.remove('hidden');
                initChat();
            }
        });
    });

    document.getElementById('send-chat-btn').addEventListener('click', handleChatSend);
    document.getElementById('end-chat-btn').addEventListener('click', endChat);
}

function updateFavoriteBtn(isFav) {
    if (isFav) {
        elements.favBtn.classList.add('active');
        elements.favBtn.textContent = '★';
    } else {
        elements.favBtn.classList.remove('active');
        elements.favBtn.textContent = '☆';
    }
}

function showHistoryDetail(index) {
    const history = getHistory();
    const record = history[index];
    if (!record) return;

    elements.histTitle.textContent = record.scenarioTitle;
    elements.histAnswer.textContent = record.userAnswer;
    elements.histScore.textContent = record.score;
    elements.histModel.textContent = record.feedback.model_answer || '暂无参考回答';
    
    // Render Feedback Pros/Cons
    const pros = record.feedback.pros.map(p => `<li>${p}</li>`).join('');
    const cons = record.feedback.cons.map(c => `<li>${c}</li>`).join('');
    elements.histFeedback.innerHTML = `<ul class="pros"><h4>✅ 优点</h4>${pros}</ul><ul class="cons"><h4>⚠️ 建议</h4>${cons}</ul>`;

    elements.historyModal.classList.remove('hidden');
}

function switchView(viewName) {
    Object.values(views).forEach(el => el.classList.remove('active'));
    Object.values(views).forEach(el => el.classList.add('hidden'));

    views[viewName].classList.remove('hidden');
    views[viewName].classList.add('active');

    if (viewName === 'welcome') {
        renderHistory();
        renderCategories();
        renderContributionGraph();
    }
}

// 扩展路由系统 - 支持技能模块
function showView(viewName, viewData = {}) {
    // 首先尝试使用旧的 switchView 处理基础视图
    if (views[viewName]) {
        switchView(viewName);
        return;
    }

    // 处理新的技能模块路由
    switch (viewName) {
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
        default:
            console.warn('Unknown view:', viewName);
    }
}

function cancelScenario() {
    const hasContent = elements.userAnswer.value.trim().length > 0;
    if (hasContent) {
        if (!confirm('您已输入内容，确定要放弃本次训练并返回主页吗？')) {
            return;
        }
    }
    
    clearInterval(timerInterval);
    switchView('welcome');
}

function startScenario(categoryId) {
    currentScenario = getRandomScenario(categoryId);
    
    if (!currentScenario) {
        alert('该分类下暂无题目');
        return;
    }

    // Render Scenario
    elements.scenarioCategory.textContent = currentScenario.category;
    elements.scenarioTitle.textContent = currentScenario.title;
    elements.scenarioDescription.textContent = currentScenario.description;
    elements.scenarioContext.textContent = currentScenario.context;
    elements.userAnswer.value = '';

    // Update Favorite Button
    updateFavoriteBtn(isFavorite(currentScenario.id));

    // Start Timer
    startTimer();
    
    switchView('training');
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 120;
    updateTimerDisplay();
    
    elements.timer.classList.remove('warning');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 30) {
            elements.timer.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('时间到！请提交您的回答。');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    elements.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function handleSubmit() {
    const answer = elements.userAnswer.value.trim();
    if (!answer) {
        alert('请输入您的回答');
        return;
    }

    clearInterval(timerInterval);
    
    elements.submitBtn.textContent = '分析中...';
    elements.submitBtn.disabled = true;

    try {
        const settings = getSettings();
        const feedback = await analyzeResponse(currentScenario, answer, settings);
        
        renderFeedback(feedback);
        
        // Save History
        saveHistory({
            date: new Date().toISOString(),
            scenarioId: currentScenario.id,
            scenarioTitle: currentScenario.title,
            userAnswer: answer,
            score: feedback.score,
            feedback: feedback
        });

    } catch (error) {
        alert('AI分析失败: ' + error.message);
        console.error(error);
    } finally {
        elements.submitBtn.textContent = '提交回答';
        elements.submitBtn.disabled = false;
    }
}

function renderFeedback(feedback) {
    elements.feedbackScore.textContent = feedback.score;
    elements.feedbackPros.innerHTML = feedback.pros.map(p => `<li>${p}</li>`).join('');
    elements.feedbackCons.innerHTML = feedback.cons.map(c => `<li>${c}</li>`).join('');
    elements.zengQuote.textContent = feedback.zeng_quote || '暂无语录';
    elements.modelAnswer.textContent = feedback.model_answer || '暂无参考';
    elements.feedbackFormula.textContent = feedback.key_formula || '暂无公式总结';
    
    switchView('feedback');
}

async function handlePracticeSimilar(baseScenario) {
    // Determine which button triggered this (visible one)
    const btn = !elements.historyModal.classList.contains('hidden') ? elements.histPracticeBtn : elements.practiceSimilarBtn;
    const originalText = btn.textContent;
    btn.textContent = '生成中...';
    btn.disabled = true;

    try {
        const settings = getSettings();
        const newScenario = await generateSimilarScenario(baseScenario, settings);
        
        // Save to custom scenarios so it persists and can be favorited
        saveCustomScenario(newScenario);
        
        // Close modals if open
        elements.historyModal.classList.add('hidden');
        
        // Start new scenario
        currentScenario = newScenario;
        
        elements.scenarioCategory.textContent = newScenario.category;
        elements.scenarioTitle.textContent = newScenario.title;
        elements.scenarioDescription.textContent = newScenario.description;
        elements.scenarioContext.textContent = newScenario.context;
        elements.userAnswer.value = '';

        // Reset favorite button
        updateFavoriteBtn(false); 

        // Start Timer
        startTimer();
        
        switchView('training');

    } catch (error) {
        alert('生成类似题目失败: ' + error.message);
        console.error(error);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function renderContributionGraph() {
    const graphContainer = document.getElementById('contribution-graph');
    if (!graphContainer) return;

    const history = getHistory();
    // Calculate date range: Last 84 days (12 weeks)
    const today = new Date();
    const daysToShow = 84; 
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToShow + 1);

    // Count activities per day
    const activityMap = {};
    history.forEach(record => {
        try {
            const dateStr = new Date(record.date).toISOString().split('T')[0];
            activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
        } catch (e) {
            console.warn('Invalid date in history:', record);
        }
    });

    // Generate grid cells
    let html = '';
    // We want to fill column by column (7 rows per column)
    // Grid CSS is set to auto-flow: column, rows: 7.
    // So simply outputting divs will fill Top-Down, Left-Right.
    // We need to order dates correctly.
    // Actually, contribution graphs usually go Left-Right (Weeks), Top-Bottom (Days).
    // GitHub: Columns are weeks. Rows are Days (Sun-Sat).
    
    // Logic: Iterate days from startDate to today.
    // BUT, CSS `grid-auto-flow: column` fills the first column (Sun-Sat) then next.
    // So we just need to ensure startDate is a Sunday (or align it).
    // For simplicity, we just dump the last 84 days.
    
    for (let i = 0; i < daysToShow; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        const count = activityMap[dateStr] || 0;
        
        // Determine level
        let level = 0;
        if (count > 0) level = 1; // 1-2
        if (count > 2) level = 2; // 3-5
        if (count > 5) level = 3; // 6+

        html += `<div class="contribution-cell level-${level}" title="${dateStr}: ${count} 次练习"></div>`;
    }

    graphContainer.innerHTML = html;
}

// Gamification & Analytics Renderers
function renderGamification() {
    const history = getHistory();
    const progress = Gamification.getLevelProgress(history);
    const badges = Gamification.checkAchievements(history);

    // Update Level Bar
    document.getElementById('user-level').textContent = progress.level;
    document.getElementById('user-xp').textContent = progress.xp;
    document.getElementById('next-level-xp').textContent = progress.nextLevelXp;
    document.getElementById('xp-bar-fill').style.width = `${progress.progress}%`;

    // Update Badge Wall
    const badgeWall = document.getElementById('badge-wall');
    if (badges.length === 0) {
        badgeWall.innerHTML = '<span style="color:#999;font-size:0.8rem;">暂无徽章，快去训练吧！</span>';
    } else {
        badgeWall.innerHTML = badges.map(b => `
            <div class="badge" title="${b.desc}">
                <span class="badge-icon">${b.icon}</span>
                <span class="badge-name">${b.name}</span>
            </div>
        `).join('');
    }
}

let radarChart = null;
const analytics = new Analytics();

function renderStats() {
    const stats = analytics.getBasicStats();
    const weakness = analytics.getWeaknessAnalysis();
    
    // Update Stats Cards
    const safeSetText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    safeSetText('stat-total', stats.totalSessions);
    safeSetText('stat-avg', stats.averageScore);
    safeSetText('weakness-text', weakness.suggestion);

    // Render Radar
    if (typeof Chart !== 'undefined') {
        const radarData = analytics.getRadarData();
        const canvas = document.getElementById('ability-radar');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (radarChart) radarChart.destroy();
        
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: radarData,
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { display: false },
                        pointLabels: {
                            font: { size: 10, family: "'Nunito', sans-serif" }
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                },
                maintainAspectRatio: false
            }
        });
    }
}

function setupDailyChallenge() {
    const seed = Gamification.getDailyChallenge();
    const allScenarios = getAllScenarios();
    
    if (allScenarios.length === 0) {
        document.getElementById('daily-title').textContent = "暂无题目";
        return;
    }

    const index = seed % allScenarios.length;
    const challengeScenario = allScenarios[index];
    
    document.getElementById('daily-title').textContent = challengeScenario.title;
    
    document.getElementById('start-daily-btn').onclick = () => {
        currentScenario = challengeScenario;
        // Start logic
        elements.scenarioCategory.textContent = currentScenario.category;
        elements.scenarioTitle.textContent = currentScenario.title;
        elements.scenarioDescription.textContent = currentScenario.description;
        elements.scenarioContext.textContent = currentScenario.context;
        elements.userAnswer.value = '';
        updateFavoriteBtn(isFavorite(currentScenario.id));
        startTimer();
        switchView('training');
    };
}

// Chat Functions
async function initChat() {
    chatHistory = [];
    const chatContainer = document.getElementById('chat-history');
    chatContainer.innerHTML = `
        <div class="chat-msg system" style="text-align:center;color:#666;font-size:0.8rem;margin-bottom:1rem;">
            <span>正在初始化角色...</span>
        </div>
    `;
    
    // Initial AI message (Persona)
    try {
        const settings = getSettings();
        // Pass empty history to get opening line
        const initialMsg = await chatWithPersona([], currentScenario, settings);
        chatContainer.innerHTML = ''; // Clear loading
        addChatMessage('assistant', initialMsg);
        chatHistory.push({ role: 'assistant', content: initialMsg });
    } catch (e) {
        chatContainer.innerHTML = `<div style="color:red;text-align:center;">角色初始化失败: ${e.message}</div>`;
    }
}

async function handleChatSend() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    addChatMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    input.value = '';
    
    // Call AI
    const btn = document.getElementById('send-chat-btn');
    const originalText = btn.textContent;
    btn.textContent = '...';
    btn.disabled = true;
    
    try {
        const reply = await chatWithPersona(chatHistory, currentScenario, getSettings());
        addChatMessage('assistant', reply);
        chatHistory.push({ role: 'assistant', content: reply });
    } catch (e) {
        addChatMessage('system', 'AI回复失败: ' + e.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function addChatMessage(role, text) {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.style.marginBottom = '1rem';
    div.style.display = 'flex';
    div.style.justifyContent = role === 'user' ? 'flex-end' : 'flex-start';
    
    const bubble = document.createElement('div');
    bubble.style.padding = '0.8rem 1rem';
    bubble.style.borderRadius = '15px';
    bubble.style.maxWidth = '80%';
    bubble.style.lineHeight = '1.4';
    bubble.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.05)';
    
    if (role === 'user') {
        bubble.style.background = 'var(--primary-color)';
        bubble.style.color = 'white';
        bubble.style.borderBottomRightRadius = '0';
    } else if (role === 'assistant') {
        bubble.style.background = '#fff';
        bubble.style.border = '1px solid #eee';
        bubble.style.borderBottomLeftRadius = '0';
    } else {
        bubble.style.background = 'transparent';
        bubble.style.color = '#666';
        bubble.style.fontSize = '0.8rem';
        div.style.justifyContent = 'center';
    }
    
    bubble.textContent = text;
    div.appendChild(bubble);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function endChat() {
    if (!confirm('确定要结束对话并进行评估吗？')) return;

    // Analyze the whole conversation
    const conversationText = chatHistory.map(m => `${m.role === 'user' ? '我' : '对方'}: ${m.content}`).join('\n');
    
    // Switch back to single mode logic to submit
    elements.userAnswer.value = "【对话记录】\n" + conversationText; 
    handleSubmit(); 
}

function renderRecommendation() {
    const weakness = analytics.getWeaknessAnalysis();
    
    // Weakness dimension to category mapping
    const map = {
        '共情能力': ['情感', '家庭'],
        '沟通技巧': ['职场', '社交', '社会潜规则'],
        '情绪管理': ['情感', '自我闹事'],
        '冲突化解': ['职场', '突发'],
        '抗压能力': ['突发', '学术'],
        '社会洞察': ['社交', '社会潜规则']
    };
    
    const targetCats = map[weakness.dimension] || ['职场'];
    const allScenarios = getAllScenarios();
    const candidates = allScenarios.filter(s => targetCats.some(tc => s.category.includes(tc) || tc.includes(s.category)));
    
    if (candidates.length > 0) {
        // Random pick
        const rec = candidates[Math.floor(Math.random() * candidates.length)];
        const card = document.getElementById('recommendation-card');
        if (!card) return;

        card.classList.remove('hidden');
        document.getElementById('rec-reason').textContent = weakness.dimension;
        document.getElementById('rec-title').textContent = rec.title;
        document.getElementById('rec-cat').textContent = rec.category;
        document.getElementById('rec-desc').textContent = rec.description;
        
        document.getElementById('rec-scenario-content').onclick = () => {
             currentScenario = rec;
             elements.scenarioCategory.textContent = currentScenario.category;
             elements.scenarioTitle.textContent = currentScenario.title;
             elements.scenarioDescription.textContent = currentScenario.description;
             elements.scenarioContext.textContent = currentScenario.context;
             elements.userAnswer.value = '';
             updateFavoriteBtn(isFavorite(currentScenario.id));
             
             // Default to single mode
             document.querySelector('input[value="single"]').checked = true;
             document.getElementById('single-mode-area').classList.remove('hidden');
             document.getElementById('chat-mode-area').classList.add('hidden');
             
             startTimer();
             switchView('training');
        };
    }
}

// ==================== 技能模块视图函数 ====================

/**
 * 显示技能模块主界面
 * @param {string} moduleId - 模块ID (如 'humor')
 */
function showSkillModuleView(moduleId) {
    const module = skillManager.getModule(moduleId);
    if (!module) {
        console.error('Module not found:', moduleId);
        return;
    }

    // 渲染技能模块界面（Task 4实现）
    renderSkillModuleInterface(module);
}

/**
 * 显示理论课界面
 * @param {string} moduleId - 模块ID
 * @param {string} lessonId - 课程ID
 */
function showTheoryView(moduleId, lessonId) {
    const lesson = skillManager.getLesson(moduleId, lessonId);
    if (!lesson) return;

    // 渲染理论课界面（Task 4实现）
    renderTheoryInterface(lesson);
}

/**
 * 显示练习界面
 * @param {string} moduleId - 模块ID
 * @param {string} practiceType - 练习类型 ('quiz', 'scenario', 'reflection')
 */
function showPracticeView(moduleId, practiceType) {
    // 渲染练习界面（Task 4实现）
    renderPracticeInterface(moduleId, practiceType);
}

/**
 * 显示实战界面
 * @param {string} moduleId - 模块ID
 */
function showRealWorldView(moduleId) {
    // 渲染实战界面（Task 4实现）
    renderRealWorldInterface(moduleId);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
