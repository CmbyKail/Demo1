export class Gamification {
    
    static getLevelProgress(history) {
        // Simple XP system: 100 XP per session + score
        // Level N requires N * 500 XP
        
        let totalXP = 0;
        history.forEach(record => {
            totalXP += 100; // Base XP for completing
            totalXP += (record.score || 0); // Bonus XP based on score
        });

        let level = 1;
        let xpForNext = 500;
        
        while (totalXP >= xpForNext) {
            totalXP -= xpForNext;
            level++;
            xpForNext = level * 500;
        }

        const progress = Math.min(100, Math.round((totalXP / xpForNext) * 100));

        return {
            level,
            xp: totalXP,
            nextLevelXp: xpForNext,
            progress
        };
    }

    static checkAchievements(history) {
        const badges = [];

        if (history.length >= 1) {
            badges.push({ name: '初出茅庐', icon: '🐣', desc: '完成第1次训练' });
        }
        if (history.length >= 10) {
            badges.push({ name: '熟能生巧', icon: '🔨', desc: '完成10次训练' });
        }
        if (history.length >= 50) {
            badges.push({ name: '情商大师', icon: '👑', desc: '完成50次训练' });
        }

        // Check for streaks (consecutive days)
        // Sort history by date descending
        const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        let streak = 0;
        if (sorted.length > 0) {
            streak = 1;
            let lastDate = new Date(sorted[0].date).setHours(0,0,0,0);
            
            for (let i = 1; i < sorted.length; i++) {
                const curDate = new Date(sorted[i].date).setHours(0,0,0,0);
                const diff = (lastDate - curDate) / (1000 * 60 * 60 * 24);
                
                if (diff === 1) {
                    streak++;
                    lastDate = curDate;
                } else if (diff === 0) {
                    continue; // Same day
                } else {
                    break;
                }
            }
        }

        if (streak >= 3) {
            badges.push({ name: '坚持不懈', icon: '🔥', desc: '连续3天训练' });
        }
        if (streak >= 7) {
            badges.push({ name: '自律达人', icon: '📅', desc: '连续7天训练' });
        }

        // High Scores
        const perfectScores = history.filter(h => h.score >= 90).length;
        if (perfectScores >= 1) {
            badges.push({ name: '完美主义', icon: '✨', desc: '获得一次90分以上' });
        }
        if (perfectScores >= 5) {
            badges.push({ name: '登峰造极', icon: '🌟', desc: '获得5次90分以上' });
        }

        return badges;
    }

    static getDailyChallenge() {
        // Return a pseudo-random number based on today's date
        // to pick a consistent scenario for everyone for the day
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        // Simple hash
        let hash = 0;
        const str = seed.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
