import { getAllCategories, getScenarioById } from './scenarios.js';
import { getHistory } from './storage.js';

export class Analytics {
    constructor() {
        this.history = [];
        this.categories = getAllCategories();
    }

    refreshData() {
        this.history = getHistory();
    }

    getBasicStats() {
        this.refreshData();
        if (this.history.length === 0) {
            return {
                totalSessions: 0,
                averageScore: 0,
                totalTime: 0 // Optional if we tracked time
            };
        }

        const totalSessions = this.history.length;
        const totalScore = this.history.reduce((sum, record) => sum + (record.score || 0), 0);
        const averageScore = Math.round(totalScore / totalSessions);

        return {
            totalSessions,
            averageScore
        };
    }

    getCategoryStats() {
        this.refreshData();
        
        // Map category ID to stats
        const catStats = {};
        this.categories.forEach(cat => {
            catStats[cat.id] = {
                name: cat.name,
                totalScore: 0,
                count: 0,
                average: 0
            };
        });

        this.history.forEach(record => {
            // Find category for this scenario
            let categoryId = 'unknown';
            
            // Try to deduce from ID prefix first (faster)
            if (record.scenarioId.startsWith('work_')) categoryId = 'work';
            else if (record.scenarioId.startsWith('emotion_')) categoryId = 'emotion';
            else if (record.scenarioId.startsWith('social_')) categoryId = 'social';
            else if (record.scenarioId.startsWith('conflict_')) categoryId = 'conflict';
            else if (record.scenarioId.startsWith('custom_')) categoryId = 'custom';
            else {
                // Fallback: Look up scenario
                const scenario = getScenarioById(record.scenarioId);
                if (scenario) {
                    // We need to map scenario.category (string name) back to ID if possible
                    // But simpler is to assume prefix convention holds or scenario has categoryId
                    // Current scenario objects have 'category' name, not ID.
                    // Let's stick to prefix matching for MVP or try to match name.
                    const catObj = this.categories.find(c => c.name === scenario.category);
                    if (catObj) categoryId = catObj.id;
                }
            }

            if (catStats[categoryId]) {
                catStats[categoryId].totalScore += (record.score || 0);
                catStats[categoryId].count += 1;
            }
        });

        // Calculate averages
        Object.keys(catStats).forEach(id => {
            if (catStats[id].count > 0) {
                catStats[id].average = Math.round(catStats[id].totalScore / catStats[id].count);
            }
        });

        return catStats;
    }

    getWeaknessAnalysis() {
        const stats = this.getCategoryStats();
        let minScore = 101;
        let weakCat = null;

        Object.values(stats).forEach(stat => {
            if (stat.count > 0 && stat.average < minScore) {
                minScore = stat.average;
                weakCat = stat.name;
            }
        });

        if (!weakCat) {
            return {
                dimension: null,
                suggestion: "快开始第一次训练吧！"
            };
        }
        
        return {
            dimension: weakCat,
            suggestion: `在「${weakCat}」方面还有提升空间（平均 ${minScore}分），建议多加练习。`
        };
    }

    // Prepare data for Chart.js
    getRadarData() {
        const stats = this.getCategoryStats();
        // 使用实际存在的分类 ID (与 scenarios.js 保持一致)
        const coreCategories = ['职场', '情感', '社交', '冲突化解']; 
        
        const labels = [];
        const data = [];

        // 检查是否有任何分类匹配
        let hasAnyData = false;
        coreCategories.forEach(id => {
            // 查找统计数据中对应的分类
            // stats 对象的键是分类名称/ID
            const catStat = stats[id];
            
            labels.push(id); // 直接使用预定义的维度名称
            const score = catStat ? (catStat.average || 0) : 0;
            data.push(score);
            if (score > 0) hasAnyData = true;
        });

        // 如果没有数据，且 labels 为空（极端情况），补全默认维度
        if (labels.length === 0) {
            ['职场', '情感', '社交', '冲突'].forEach(l => {
                labels.push(l);
                data.push(10);
            });
        } else if (!hasAnyData) {
            // 填充一个小基础值
            for (let i = 0; i < data.length; i++) {
                data[i] = 10; 
            }
        }

        return {
            labels,
            datasets: [{
                label: '能力维度',
                data: data,
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.2)', // 使用主题绿色
                borderColor: 'rgba(76, 175, 80, 0.8)',
                pointBackgroundColor: 'rgb(255, 152, 0)', // 橙色点缀
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 152, 0)'
            }]
        };
    }
}
