# Tasks Document - EQ Trainer (MVP)

- [x] 1. Initialize project structure and base files
  - File: index.html, css/style.css, js/app.js, js/ai-service.js, js/scenarios.js, js/storage.js
  - Create the folder structure defined in design
  - Create empty files with basic comments
  - Purpose: Set up the foundation for the project
  - _Leverage: N/A_
  - _Requirements: Technical Standards, Project Structure_
  - _Prompt: Role: Frontend Developer | Task: Initialize the project folder structure and create empty files (index.html, css/style.css, js/app.js, js/ai-service.js, js/scenarios.js, js/storage.js) as defined in the design document. | Restrictions: Use standard HTML5 boilerplate for index.html. Ensure correct relative paths. | Success: All files exist in correct folders._

- [x] 2. Implement Scenario Library (scenarios.js)
  - File: js/scenarios.js
  - Define the `scenarios` array with at least 2 categories (Workplace, Emotional) and 3 scenarios each.
  - Export functions `getRandomScenario(category)` and `getAllCategories()`.
  - Purpose: Provide content for the application.
  - _Leverage: N/A_
  - _Requirements: Requirement 1 (Scenario Generation)_
  - _Prompt: Role: Content Creator / JS Developer | Task: Implement `js/scenarios.js` as an ES Module. Create a constant array of scenario objects (id, category, title, description, context). Implement and export `getRandomScenario(category)` and `getAllCategories()`. | Restrictions: Use ES Modules export syntax. | Success: Importing and calling getRandomScenario returns a valid scenario object._

- [x] 3. Implement Storage Service (storage.js)
  - File: js/storage.js
  - Implement wrapper functions for `localStorage`.
  - Handle JSON serialization/deserialization.
  - **New**: `getSettings` should return Doubao defaults (Endpoint: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`, Model: `doubao-seed-1-8-251228`, Key: `6716060f-dcd6-4e54-a001-7e593c589efb`) if no data exists.
  - Purpose: Persist user settings and history.
  - _Leverage: Window.localStorage_
  - _Requirements: Requirement 5 (Settings/Doubao), Non-functional (Privacy)_
  - _Prompt: Role: Frontend Developer | Task: Implement `js/storage.js`. Export `saveSettings`, `getSettings`, `saveHistory`, `getHistory`. If `eq_settings` is missing, `getSettings` returns Doubao defaults. | Restrictions: Handle JSON.parse errors gracefully. | Success: Data persists, and defaults are loaded on fresh start._

- [x] 4. Implement AI Service with Prompt Engineering (ai-service.js)
  - File: js/ai-service.js
  - Implement `analyzeResponse` function that calls OpenAI-compatible API.
  - **CRITICAL**: Construct the system prompt injecting "Zeng Shiqiang's Core Principles" (Scheme C).
  - Purpose: The core intelligence of the app.
  - _Leverage: fetch API_
  - _Requirements: Requirement 3 (Wisdom Integration), Requirement 4 (AI Analysis)_
  - _Prompt: Role: AI Engineer | Task: Implement `js/ai-service.js`. Create `analyzeResponse(scenario, userAnswer, settings)`. Construct a system prompt that includes Zeng Shiqiang's principles (e.g., "Round outside, square inside"). Call the API endpoint specified in settings. Return structured JSON (score, pros, cons, modelAnswer). | Restrictions: Do not hardcode API keys (use settings). Handle API errors. | Success: Function returns valid analysis object from API._

- [x] 5. Implement UI Structure and Styles (index.html, style.css)
  - File: index.html, css/style.css
  - Build the HTML layout: Header, Settings Panel (modal/toggle), Scenario Display, Timer, Input Area, Feedback Area.
  - **Style Update**: Implement **Claymorphism** style (Requirement 6). Use soft 3D floating cards, high border-radius, and vibrant pastel colors (playful educational platform).
  - Purpose: Visual interface.
  - _Leverage: Standard CSS Flexbox/Grid_
  - _Requirements: Requirement 6 (Claymorphism), Usability_
  - _Prompt: Role: UI Designer / Frontend Developer | Task: Build `index.html` and `css/style.css`. Use Claymorphism design: floating white cards with soft shadows (`box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff`), rounded corners (20px+), and a vibrant background. | Restrictions: Responsive design. | Success: UI looks fun, modern, and "squeezable"._

- [x] 6. Implement App Controller and Timer Logic (app.js)
  - File: js/app.js
  - Import services.
  - Implement `init()` to load settings and bind events.
  - Implement `startScenario()` logic.
  - Implement **Countdown Timer** logic (2 minutes).
  - Handle form submission -> call AI Service -> render Feedback.
  - **New**: Implement History Click Handler. Clicking a history item opens the Feedback view with that record's data (Requirement 7).
  - Purpose: Glue everything together.
  - _Leverage: js/scenarios.js, js/ai-service.js, js/storage.js_
  - _Requirements: Requirement 2 (Timed Response), Requirement 4 (Feedback), Requirement 7 (History Replay)_
  - _Prompt: Role: Frontend Developer | Task: Implement `js/app.js`. Bind UI events. Implement 2-min timer. Handle 'Submit' click. Handle clicks on history items to replay feedback. | Restrictions: Ensure timer stops on submission. | Success: Full user flow works including history replay._

- [x] 7. Implement Storage for Favorites & Custom Scenarios (storage.js)
  - File: js/storage.js
  - Add `saveFavorites`, `getFavorites`, `toggleFavorite`.
  - Add `saveCustomScenarios`, `getCustomScenarios`.
  - Purpose: Backend logic for new features.
  - _Requirements: Requirement 8 (Favorites), Requirement 9 (Custom Scenarios)_

- [x] 8. Update Scenario Management (scenarios.js)
  - File: js/scenarios.js
  - Add `addCustomScenario` logic to runtime list.
  - Update `getRandomScenario` to support "Favorites" psuedo-category.
  - Purpose: Integrate custom content into the app flow.
  - _Requirements: Requirement 9_

- [x] 9. Implement UI for Favorites (index.html, app.js, style.css)
  - File: index.html, js/app.js, css/style.css
  - Add "Star" icon to Training and Feedback views.
  - Add "Favorites" category card to Welcome view.
  - Bind click events.
  - Purpose: Allow users to bookmark.
  - _Requirements: Requirement 8_

- [x] 10. Implement UI for Custom Scenarios (index.html, app.js, style.css)
  - File: index.html, js/app.js, css/style.css
  - Add "Add Scenario" button (floating action button or in header).
  - Create Modal for adding scenario (Title, Desc, Context, Category).
  - Handle submission and saving.
  - Purpose: Allow users to create content.
  - _Requirements: Requirement 9_

- [x] 11. Update AI Service for Formula and Analogy (ai-service.js)
  - File: js/ai-service.js
  - Update `analyzeResponse` prompt to request `key_formula` (Situation + Principle = Action).
  - Implement `generateSimilarScenario(baseScenario, settings)`: Prompt AI to create a new scenario with the same theme but different context.
  - Purpose: Core logic for new features.
  - _Requirements: Requirement 10 (Analogy), Requirement 11 (Formula)_
  - _Prompt: Role: AI Engineer | Task: Update `js/ai-service.js`. 1) In `analyzeResponse`, update system prompt to ask for `key_formula` in JSON response. 2) Export `generateSimilarScenario(baseScenario, settings)` which asks AI to "Generate a new high-pressure scenario based on the theme of '${baseScenario.title}' but with different context/characters". Return valid scenario JSON. | Restrictions: Maintain existing error handling. | Success: Analysis returns formula; generate function returns valid scenario._

- [x] 12. Update UI/Logic for Formula and Analogy (index.html, app.js, style.css)
  - File: index.html, js/app.js, css/style.css
  - **HTML**: Add "Formula" section in Feedback view (and History modal). Add "Practice Similar" button in Feedback view/History modal.
  - **JS**: 
    - Update `renderFeedback` and `showHistoryDetail` to display `key_formula`.
    - Handle "Practice Similar" click: Call `generateSimilarScenario`, then `startScenario` with the result.
  - **CSS**: Style the formula card (highlighted) and the new button.
  - Purpose: User interaction for new features.
  - _Requirements: Requirement 10, Requirement 11_
  - _Prompt: Role: Frontend Developer | Task: Update UI to show formula and enable "Practice Similar". 1) Add formula display in `renderFeedback` and `showHistoryDetail`. 2) Add "Practice Similar" button. 3) In `app.js`, handle button click -> `aiService.generateSimilarScenario` -> `currentScenario = newScenario` -> `startTimer` -> switch to training view. | Restrictions: Show loading state while generating. | Success: Formula visible, "Practice Similar" button works and starts new test._

- [x] 13. Implement Back Button in Training View (index.html, app.js)
  - File: index.html, js/app.js
  - **HTML**: Add a "Cancel" or "Back" button in the Training View (e.g., next to the timer or at the bottom).
  - **JS**: Implement `cancelScenario` function: clear timer, switch to Welcome view.
  - Purpose: Allow users to exit a scenario without submitting.
116→  - _Requirements: Requirement 12_
117→
118→- [x] 14. Implement Smart Data Synchronization (server.py, js/storage.js)
119→  - File: server.py, js/storage.js, js/app.js
120→  - **Server**: Create `server.py` with `/api/storage` endpoint to read/write `server_data.json`.
121→  - **Client**: Update `js/storage.js` to implement `initStorage` with Scheme 1 logic (Upload if server empty & local has data; Download if server has data).
122→  - **Integration**: Call `initStorage` in `js/app.js` startup. Ensure all save operations call `syncToServer`.
123→  - Purpose: Enable seamless data usage across IDE and Chrome.
124→  - _Requirements: Requirement 13 (Smart Sync)_

- [x] 15. Implement Massive Scenario Bank (js/data/scenario_db.js, js/scenarios.js)
  - File: js/data/scenario_db.js, js/scenarios.js
  - **Data**: Create `js/data/scenario_db.js` containing a large array of pre-generated scenarios (aiming for 100/category, or as many as feasible in MVP) for all categories.
  - **Logic**: Update `js/scenarios.js` to import this data and use it as the base source.
  - Purpose: Provide the "Brush up" experience with 100+ questions.
  - _Leverage: AI Generation for content creation_
  - _Requirements: Requirement 14 (Massive Bank)_
  - _Prompt: Role: Content Creator | Task: Generate a massive list of high-quality scenarios (JSON) for Workplace, Love, Family, etc. Create `js/data/scenario_db.js`. Update `js/scenarios.js` to use this data. | Restrictions: Ensure valid JSON. | Success: App has hundreds of questions available offline._

- [x] 16. Generate and write remaining 420 scenarios to js/data/scenario_db.js to reach 600 total (100 per category) (js/data/scenario_db.js)

- [x] 17. Implement Contribution Graph (Heatmap)
  - File: index.html, js/app.js, css/style.css
  - **HTML**: Add container for contribution graph in Welcome View.
  - **CSS**: Add styles for the grid and intensity colors (gray, light green, dark green).
  - **JS**: Implement `renderContributionGraph()` in `app.js` to calculate activity from `eq_history` and render the grid.
  - Purpose: Visualize progress.
  - _Requirements: Requirement 15_
  - _Prompt: Role: Frontend Developer | Task: Implement GitHub-style contribution graph. 1) Add container in HTML. 2) In `app.js`, create `renderContributionGraph` to parse `eq_history` dates and render a grid (e.g., last 30 days). 3) Style with CSS. | Restrictions: Handle empty history. | Success: Heatmap visible on welcome screen._

- [x] 18. Implement "Self-Inflicted" Category & Scenarios
  - File: js/data/scenario_db.js, js/scenarios.js
  - **Data**: Add "Self-Inflicted" (Critical Errors) category to `scenario_db.js` with initial scenarios (e.g., "Caught bad-mouthing").
  - **Logic**: Ensure `scenarios.js` exposes this category.
  - Purpose: Practice crisis management for user-created problems.
  - _Requirements: Requirement 16_
  - _Prompt: Role: Content Creator | Task: Add "Self-Inflicted" category to `scenario_db.js` with 10+ scenarios. Scenarios must have `context` like "Close Friend" or "Stranger". | Restrictions: JSON format. | Success: Category selectable in app._

- [x] 19. Implement "Social Rules" Integration (Prompt & Scenarios)
  - File: js/ai-service.js, js/data/scenario_db.js, js/scenarios.js
  - **Logic**: Update `ai-service.js` `_constructSystemPrompt` to include the 4 Social Rules.
  - **Data**: Add "Social Rules" category to `scenario_db.js` with scenarios testing these rules.
  - Purpose: Advanced social strategy training.
  - _Requirements: Requirement 17_
  - _Prompt: Role: AI Engineer | Task: 1) Update `ai-service.js` system prompt with the 4 Social Rules (Don't ask permission, Keep mystery, Respect self-interest, etc.). 2) Add "Social Rules" category with scenarios. | Restrictions: Ensure prompt is concise. | Success: AI feedback references these rules._

## Month 1: Basic Experience Upgrade

- [x] 20. Implement Analytics Service (Radar & Stats)
  - File: js/analytics.js, index.html, js/app.js, css/style.css
  - **JS**: Create `js/analytics.js`. Implement `calculateRadarData` (map categories to dimensions), `getDashboardStats`, `getWeaknessAnalysis`.
  - **UI**: Add "Stats Dashboard" section in Welcome View (Radar chart via Canvas/SVG or simple bars).
  - Purpose: Visual feedback.
  - _Requirements: Requirement 18_

- [x] 21. Implement Gamification Service (Levels & Badges)
  - File: js/gamification.js, js/storage.js, index.html, js/app.js
  - **Storage**: Update `storage.js` to save gamification state (level, xp, badges).
  - **JS**: Create `js/gamification.js`. Implement level up logic and badge unlocking (First Blood, Streak).
  - **UI**: Display Level/XP bar and Badge Wall in Welcome View.
  - Purpose: User retention.
  - _Requirements: Requirement 19_

- [x] 22. Implement Daily Challenge
  - File: js/gamification.js, js/app.js, index.html
  - **Logic**: Pick a random scenario based on date hash as "Daily Challenge".
  - **UI**: Show "Daily Challenge" card prominently.
  - **Reward**: Double XP (simulated).
  - Purpose: Daily engagement.
  - _Requirements: Requirement 19_

## Month 2: AI Capability Upgrade

- [x] 23. Implement AI Chat Service (Multi-turn)
  - File: js/ai-chat.js, js/app.js, index.html
  - **JS**: Create `js/ai-chat.js` to manage conversation history.
  - **UI**: Create a new "Chat Mode" view (bubble interface).
  - **Logic**: 3-turn limit.
  - Purpose: Realistic simulation.
  - _Requirements: Requirement 20_

- [x] 25. UI Redesign - Foundation (CSS)
  - File: css/style.css, index.html
  - **CSS**: Replace existing colors with "Edu-Clay" palette (`#4F46E5`, `#F97316`, `#EEF2FF`). Import 'Fredoka' font. Update card styles to be cleaner.
  - **HTML**: Update classes to reflect new structure if needed.
  - Purpose: Modernize look and feel.
  - _Requirements: Requirement 22_

- [x] 26. UI Redesign - Navigation & Dashboard (index.html, js/app.js)
  - File: index.html, js/app.js
  - **HTML**: Restructure Welcome View. Make Category Cards bigger and clearly clickable ("Start" button inside).
  - **JS**: Ensure `renderCategories` generates interactive cards. Verify `startScenario` triggers correctly.
  - Purpose: Fix navigation confusion.
  - _Requirements: Requirement 23_
