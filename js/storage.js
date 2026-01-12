// js/storage.js

const SETTINGS_KEY = 'eq_settings';
const HISTORY_KEY = 'eq_history';
const FAVORITES_KEY = 'eq_favorites';
const CUSTOM_SCENARIOS_KEY = 'eq_custom_scenarios';
const SYNC_API = 'http://localhost:8000/api/storage';

const DEFAULT_SETTINGS = {
    apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: '6716060f-dcd6-4e54-a001-7e593c589efb',
    model: 'doubao-seed-1-8-251228'
};

// Sync Logic
async function syncToServer() {
    try {
        const data = {
            [SETTINGS_KEY]: localStorage.getItem(SETTINGS_KEY),
            [HISTORY_KEY]: localStorage.getItem(HISTORY_KEY),
            [FAVORITES_KEY]: localStorage.getItem(FAVORITES_KEY),
            [CUSTOM_SCENARIOS_KEY]: localStorage.getItem(CUSTOM_SCENARIOS_KEY)
        };
        
        await fetch(SYNC_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log('Data synced to server');
    } catch (e) {
        console.warn('Server sync failed (offline mode?):', e);
    }
}

export async function initStorage() {
    try {
        const res = await fetch(SYNC_API);
        if (res.ok) {
            const serverData = await res.json();
            
            // Check if server is empty but local has data (Migration scenario)
            const serverHistory = serverData[HISTORY_KEY] ? JSON.parse(serverData[HISTORY_KEY]) : [];
            const localHistory = localStorage.getItem(HISTORY_KEY) ? JSON.parse(localStorage.getItem(HISTORY_KEY)) : [];
            
            const serverIsEmpty = serverHistory.length === 0;
            const localHasData = localHistory.length > 0;

            if (serverIsEmpty && localHasData) {
                console.log('Server empty, uploading local data to server...');
                await syncToServer(); // Push local data to server
            } else if (Object.keys(serverData).length > 0) {
                // Server has data, overwrite local (Source of Truth)
                if (serverData[SETTINGS_KEY]) localStorage.setItem(SETTINGS_KEY, serverData[SETTINGS_KEY]);
                if (serverData[HISTORY_KEY]) localStorage.setItem(HISTORY_KEY, serverData[HISTORY_KEY]);
                if (serverData[FAVORITES_KEY]) localStorage.setItem(FAVORITES_KEY, serverData[FAVORITES_KEY]);
                if (serverData[CUSTOM_SCENARIOS_KEY]) localStorage.setItem(CUSTOM_SCENARIOS_KEY, serverData[CUSTOM_SCENARIOS_KEY]);
                console.log('Storage initialized from server');
            }
        }
    } catch (e) {
        console.warn('Failed to load from server (offline mode?):', e);
    }
}

export function getSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (e) {
        console.error('Error loading settings:', e);
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        syncToServer();
        return true;
    } catch (e) {
        console.error('Error saving settings:', e);
        return false;
    }
}

export function getHistory() {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading history:', e);
        return [];
    }
}

export function saveHistory(record) {
    try {
        const history = getHistory();
        history.unshift(record);
        if (history.length > 50) {
            history.pop();
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        syncToServer();
        return true;
    } catch (e) {
        console.error('Error saving history:', e);
        return false;
    }
}

// Favorites
export function getFavorites() {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading favorites:', e);
        return [];
    }
}

export function toggleFavorite(scenarioId) {
    try {
        const favorites = getFavorites();
        const index = favorites.indexOf(scenarioId);
        if (index === -1) {
            favorites.push(scenarioId);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        syncToServer();
        return index === -1; // returns true if added, false if removed
    } catch (e) {
        console.error('Error saving favorites:', e);
        return false;
    }
}

export function isFavorite(scenarioId) {
    const favorites = getFavorites();
    return favorites.includes(scenarioId);
}

// Custom Scenarios
export function getCustomScenarios() {
    try {
        const stored = localStorage.getItem(CUSTOM_SCENARIOS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading custom scenarios:', e);
        return [];
    }
}

export function saveCustomScenario(scenario) {
    try {
        const scenarios = getCustomScenarios();
        scenarios.push(scenario);
        localStorage.setItem(CUSTOM_SCENARIOS_KEY, JSON.stringify(scenarios));
        syncToServer();
        return true;
    } catch (e) {
        console.error('Error saving custom scenario:', e);
        return false;
    }
}
