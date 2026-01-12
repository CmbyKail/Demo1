import { getHistory } from './storage.js';
import { getAllCategories, getScenarioById } from './scenarios.js';

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
        // Filter out 'custom' or 'favorites' if they are not main abilities
        // For EQ model, we usually care about the core dimensions
        const coreCategories = ['work', 'emotion', 'social', 'conflict']; 
        
        const labels = [];
        const data = [];

        coreCategories.forEach(id => {
            if (stats[id]) {
                labels.push(stats[id].name);
                data.push(stats[id].average || 0); // Use 0 if no data
            }
        });

        // Add 'Other' if significant? No, keep it clean for Radar.

        return {
            labels,
            datasets: [{
                label: '能力维度',
                data: data,
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgb(79, 70, 229)',
                pointBackgroundColor: 'rgb(249, 115, 22)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(249, 115, 22)'
            }]
        };
    }
}
