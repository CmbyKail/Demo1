# Design Document - EQ Trainer (MVP)

## Overview

EQ Trainer is a single-page web application (SPA) designed to run entirely in the browser. It leverages modern HTML5/CSS3/JavaScript (ES6+) to provide a responsive interface for scenario-based emotional intelligence training. The core intelligence is powered by external AI APIs (OpenAI compatible), with Zeng Shiqiang's wisdom injected via system prompts (Scheme C).

## Steering Document Alignment

### Technical Standards
- **Pure Frontend**: No custom backend server. All logic runs in the client's browser.
- **LocalStorage**: Used for persistence of settings, history, favorites, and custom scenarios.
- **ES Modules**: JavaScript code will be modularized using native ES Modules (`<script type="module">`).

### Project Structure
The project will follow a flat, simple structure suitable for a standalone web app:
```
finalwork/
├── index.html          # Main entry point
├── css/
│   └── style.css       # Global styles
├── js/
│   ├── app.js          # Main application controller
│   ├── ai-service.js   # AI API integration & Prompt Engineering
│   ├── scenarios.js    # Static & Custom scenario management
│   └── storage.js      # LocalStorage wrapper
└── assets/             # Icons, images (if any)
```

## Architecture

### Modular Design Principles
- **Separation of Concerns**: UI rendering is separated from business logic (Timer, AI) and data persistence.
- **Service-based**: AI interaction is encapsulated in `ai-service.js`, allowing easy switching between providers or future upgrades to Vector DB.

```mermaid
graph TD
    UI[User Interface (DOM)] <--> App[App Controller (app.js)]
    App --> Scenarios[Scenario Library (scenarios.js)]
    App --> Timer[Timer Logic]
    App --> Storage[Storage Service (storage.js)]
    App --> AI[AI Service (ai-service.js)]
    AI --> API[External AI API]
    Storage --> LocalStorage[Browser LocalStorage]
```

## Components and Interfaces

### 1. App Controller (`app.js`)
- **Purpose**: Manages the application state (current view, current scenario, timer status) and coordinates between services.
- **Interfaces**:
    - `init()`: Initialize app, load settings, load custom scenarios.
    - `startScenario(category)`: Pick a scenario and switch to practice view.
    - `cancelScenario()`: Stop timer and return to home.
    - `submitAnswer(answer)`: Handle user submission.
    - `viewHistoryItem(index)`: Load a specific history record into the Feedback view.
    - `toggleFavorite()`: Toggle favorite status for current scenario.
    - `saveCustomScenario(data)`: Handle form submission for new scenario.
    - `renderContributionGraph()`: Calculates and renders the GitHub-style heatmap based on `eq_history`.

### 2. Scenario Library (`scenarios.js`)
- **Purpose**: Provides a static list of scenarios and manages user-created custom scenarios.
- **Interfaces**:
    - `getRandomScenario(category)`: Returns a random scenario object (including custom ones).
    - `getAllCategories()`: Returns list of available categories (including "Custom", "Favorites", "Self-Inflicted", "Social Rules").
    - `addCustomScenario(scenario)`: Adds a new scenario to the runtime list.
    - `loadCustomScenarios(list)`: Merges stored custom scenarios into the active pool.
    - `getScenarioById(id)`: Helper to retrieve specific scenario (e.g., for favorites).

### 3. AI Service (`ai-service.js`)
- **Purpose**: Encapsulates API calls to LLM providers and constructs the prompt with Zeng Shiqiang's wisdom.
- **Interfaces**:
    - `analyzeResponse(scenario, userAnswer, settings)`: Sends request to AI. Returns structured feedback including `key_formula`.
    - `generateSimilarScenario(baseScenario, settings)`: Generates a new scenario object based on the input scenario's theme.
    - `_constructSystemPrompt()`: (Internal) Builds the prompt with "Core Principles" AND "Social Rules" (Rule 1-4 from text).

### 7. Analytics Service (`js/analytics.js`)
- **Purpose**: Compute statistics for the dashboard and radar chart.
- **Interfaces**:
    - `calculateRadarData(history)`: Returns scores for 6 dimensions (Empathy, Communication, etc.).
    - `getWeaknessAnalysis(history)`: Returns the weakest dimension and suggestion.
    - `getDashboardStats(history)`: Returns aggregate stats.

### 8. Gamification Service (`js/gamification.js`)
- **Purpose**: Manage levels, badges, and daily challenges.
- **Interfaces**:
    - `checkAchievements(history)`: Returns list of unlocked badges.
    - `getLevelProgress()`: Returns current level and progress to next level.
    - `getDailyChallenge()`: Returns today's special scenario ID.

### 9. AI Chat Service (`js/ai-chat.js`) (Month 2)
- **Purpose**: Handle multi-turn dialogue state.
- **Interfaces**:
    - `startChat(scenario)`: Initialize a chat session.
    - `sendMessage(text)`: Send user message, get AI persona reply.
    - `finishChat()`: End chat and request final analysis from `ai-service.js`.

### 4. Storage Service (`storage.js`)
- **Updates**:
    - `saveGamificationState(state)`, `getGamificationState()`
- **Purpose**: Wrapper for LocalStorage to handle JSON serialization and error handling.
- **Interfaces**:
    - `saveSettings(settings)`, `getSettings()`
    - `saveHistory(record)`, `getHistory()`
    - `saveFavorites(list)`, `getFavorites()`: Manage list of favorite scenario IDs.
    - `saveCustomScenarios(list)`, `getCustomScenarios()`: Manage user-created scenarios.

### 5. Server-Side Sync (`server.py` + `storage.js`)
- **Purpose**: Facilitate data synchronization between different clients (IDE, Browser) via a central JSON file.
- **Components**:
    - `server.py`: Simple HTTP server with `/api/storage` endpoint (GET/POST).
    - `storage.js`: Logic to sync with server.
- **Sync Strategy (Scheme 1: Smart Sync)**:
    - **On Init**: Fetch server data.
        - Case A (Server has data): `LocalStorage = ServerData` (Download).
        - Case B (Server empty, Local has data): `ServerData = LocalStorage` (Upload/Migrate).
        - Case C (Both empty): Do nothing.
    - **On Save**: `ServerData = LocalStorage` (Push update immediately).

### 6. Massive Scenario Database (`js/data/scenario_db.js`)
- **Purpose**: Store the large static dataset of built-in scenarios (Req 14) to keep the main bundle light and organized.
- **Structure**: Exports a large JSON object keyed by category.
- **Integration**: `scenarios.js` imports this database and merges it with runtime custom scenarios.

### 10. UI/UX System (Edu-Clay)
- **Palette**:
    - Primary: `#4F46E5` (Indigo 600)
    - Secondary: `#818CF8` (Indigo 400)
    - Accent: `#F97316` (Orange 500)
    - Background: `#EEF2FF` (Indigo 50)
    - Card BG: `#FFFFFF`
    - Text: `#1E1B4B` (Indigo 950)
- **Typography**:
    - Headings: 'Fredoka', sans-serif (Google Fonts)
    - Body: 'Nunito', sans-serif
- **Layout Structure**:
    - **Dashboard View**: Gamification Header -> Daily Challenge -> Category Grid (Start) -> Stats/Heatmap.
    - **Training View**: Focused card with Timer, Scenario, Input.
    - **Feedback View**: Score centered, Formula highlighted, Action buttons.

## Data Models

### Scenario Object
```javascript
{
    "id": "work_001", // or "custom_timestamp"
    "category": "Workplace",
    "title": "Criticism in Public",
    "description": "Your boss criticizes you harshly in front of the whole team...",
    "context": "Team meeting, Monday morning",
    "isCustom": false // true for user-created
}
```

### Settings Object (`eq_settings`)
```javascript
{
    "apiKey": "6716060f-dcd6-4e54-a001-7e593c589efb",
    "apiEndpoint": "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    "model": "doubao-seed-1-8-251228"
}
```

### History Record (`eq_history`)
```javascript
[
    {
        "date": "2023-10-27T10:00:00Z",
        "scenarioId": "work_001",
        "scenarioTitle": "Criticism in Public",
        "userAnswer": "I would listen calmly...",
        "score": 85,
        "feedback": {
            "score": 85,
            "pros": ["..."],
            "cons": ["..."],
            "model_answer": "...",
            "zeng_quote": "...",
            "key_formula": "Situation + Principle = Action" // New field
        }
    }
]
```

### Favorites List (`eq_favorites`)
```javascript
["work_001", "custom_123456789"]
```

### Custom Scenarios List (`eq_custom_scenarios`)
```javascript
[
    {
        "id": "custom_1700000000",
        "category": "Custom",
        "title": "My Tough Situation",
        "description": "...",
        "context": "..."
    }
]
```
