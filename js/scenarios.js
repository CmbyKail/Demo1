
import { getCustomScenarios, getFavorites } from './storage.js';
import { SCENARIO_DB } from './data/scenario_db.js';

const SCENARIOS = Object.values(SCENARIO_DB).flat();

const BASE_CATEGORIES = [
    { id: "职场", icon: "💼", name: "职场场景" },
    { id: "情感", icon: "❤️", name: "情感场景" },
    { id: "家庭", icon: "👨‍👩‍👧‍👦", name: "家庭场景" },
    { id: "学术", icon: "🎓", name: "学术场景" },
    { id: "社交", icon: "🤝", name: "社交场景" },
    { id: "突发", icon: "🚨", name: "突发场景" },
    { id: "自我闹事", icon: "🤦‍♂️", name: "自我闹事" },
    { id: "社会潜规则", icon: "🕶️", name: "社会潜规则" }
];

export function getAllCategories() {
    const categories = [...BASE_CATEGORIES];
    
    // Check if we have custom scenarios
    const customScenarios = getCustomScenarios();
    if (customScenarios.length > 0) {
        categories.push({ id: "自定义", icon: "✍️", name: "我的题目" });
    }

    // Check if we have favorites
    const favorites = getFavorites();
    if (favorites.length > 0) {
        categories.unshift({ id: "favorites", icon: "⭐", name: "收藏夹" });
    }
    
    return categories;
}

export function getRandomScenario(categoryId) {
    const customScenarios = getCustomScenarios();
    const allScenarios = [...SCENARIOS, ...customScenarios];

    let pool = [];

    if (categoryId === "favorites") {
        const favoriteIds = getFavorites();
        pool = allScenarios.filter(s => favoriteIds.includes(s.id));
        if (pool.length === 0) {
            // Fallback if empty (shouldn't happen if UI handles it right)
            return allScenarios[0];
        }
    } else if (categoryId === "自定义") {
        pool = customScenarios;
    } else {
        // Normal category
        pool = allScenarios.filter(s => s.category === categoryId);
        // Fallback to all scenarios if category is empty
        if (pool.length === 0) pool = allScenarios;
    }
    
    // 随机选择一个
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

export function getScenarioById(id) {
    const customScenarios = getCustomScenarios();
    const allScenarios = [...SCENARIOS, ...customScenarios];
    return allScenarios.find(s => s.id === id);
}

export function getAllScenarios() {
    const customScenarios = getCustomScenarios();
    return [...SCENARIOS, ...customScenarios];
}
