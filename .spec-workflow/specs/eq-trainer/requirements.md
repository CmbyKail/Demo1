# Requirements Document - EQ Trainer (Scenario-based Emotional Intelligence Training)

## Introduction

EQ Trainer is a lightweight, web-based application designed to improve users' emotional intelligence through high-pressure scenario simulations. It presents users with diverse, critical situations (Workplace, Emotional, Family, etc.) and requires them to respond within a limited time (2 minutes). The system then uses AI to analyze the response, providing scores, feedback, and a "model answer" enriched with the wisdom of Professor Zeng Shiqiang.

The application uses a "Pure Frontend" architecture (HTML/JS). In this MVP version, it integrates Zeng Shiqiang's wisdom through Prompt Engineering (Scheme C), with a planned roadmap to integrate Qdrant (Vector Database) for advanced retrieval in future iterations.

## Alignment with Product Vision

This project aims to provide a private, low-cost, and effective tool for personal growth in interpersonal relationships and emergency response capabilities. It combines modern AI interaction with traditional wisdom.

## Requirements

### Requirement 1: Scenario Generation & Selection

**User Story:** As a user, I want to select a specific scenario category (e.g., Workplace, Emotional) or choose "Random Mode," so that I can practice handling specific types of situations.

#### Acceptance Criteria

1. WHEN the user opens the app, THEN the system SHALL display category options: Workplace, Emotional, Family, Academic, Social, Unexpected.
2. WHEN the user selects a category, THEN the system SHALL randomly generate or retrieve a specific, high-pressure scenario description from that category.
3. The scenario description SHALL include context (time, location, characters) and the specific conflict/problem.

### Requirement 2: Timed Response System

**User Story:** As a user, I want to answer the scenario question within a strict time limit (2 minutes), so that I can train my quick-thinking and emergency response skills.

#### Acceptance Criteria

1. WHEN the scenario is displayed, THEN a 2-minute countdown timer SHALL start immediately.
2. WHEN the timer reaches the last 30 seconds, THEN the visual display SHALL change (e.g., turn red) to warn the user.
3. WHEN the timer reaches 0, THEN the system SHALL automatically submit the current text in the input box (or disable input).
4. The user SHALL be able to submit their answer manually before the time runs out.

### Requirement 3: Zeng Shiqiang Wisdom Integration (Prompt Engineering Strategy)

**User Story:** As a user, I want the AI to analyze my answers based on the core principles of Zeng Shiqiang's wisdom, so that I can learn traditional Chinese interpersonal philosophy without setting up a complex database initially.

**Note:** This is the MVP implementation (Scheme C). Future versions will migrate to a Vector Database (Scheme B) using Qdrant for more precise retrieval.

#### Acceptance Criteria

1. The system SHALL store a set of "Core Principles" derived from Zeng Shiqiang's teachings (e.g., "Round outside, square inside", "Save face for others") as part of the system prompt or local configuration.
2. WHEN sending a request to the AI, THEN the system SHALL inject these principles into the system prompt context.
3. The AI SHALL be instructed to explicitly reference these principles when providing the "Model Answer" and feedback.

### Requirement 4: AI Analysis & Feedback

**User Story:** As a user, I want to receive a comprehensive analysis of my response, including a score, pros/cons, and a better alternative answer, so that I can understand my gaps and improve.

#### Acceptance Criteria

1. WHEN the user submits an answer, THEN the system SHALL send the Scenario, User Answer, and the "Core Principles" context to the AI API.
2. The AI SHALL generate a response containing:
    - Overall Score (0-100).
    - 3 Pros and 3 Cons of the user's response.
    - Specific suggestions for improvement.
    - A "Model Answer" that applies the injected Zeng Shiqiang principles.
    - A specific section quoting or explaining the principle used.
3. The UI SHALL display this feedback clearly to the user.

### Requirement 5: Settings & Configuration

**User Story:** As a user, I want the app to be pre-configured with the Doubao (Volcengine) API so I can use it immediately, while retaining the ability to change it.

#### Acceptance Criteria

1. The app SHALL use the following defaults:
    - Endpoint: `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
    - Model: `doubao-seed-1-8-251228`
    - API Key: (User provided key pre-filled)
2. These settings SHALL be saved in LocalStorage.

### Requirement 6: Playful UI (Claymorphism)

**User Story:** As a user, I want a "playful educational platform" interface with Claymorphism style, vibrant colors, and engaging cards, so that the learning experience feels fun and modern.

#### Acceptance Criteria

1. The UI SHALL implement **Claymorphism** design principles:
    - Floating cards with soft, inflated 3D look.
    - Rounded corners (high border-radius).
    - Vibrant, pastel color palette (e.g., soft blues, pinks, purples).
2. Buttons and inputs SHALL have a tactile, "squeezable" feel.

### Requirement 7: History Replay

**User Story:** As a user, I want to click on a past training record to view the full details (my answer + AI feedback), so I can review my progress.

#### Acceptance Criteria

1. The History list on the Welcome screen SHALL be clickable.
2. WHEN a history item is clicked, THEN the system SHALL navigate to the Feedback View and populate it with the stored data (Score, Pros/Cons, Model Answer).

### Requirement 8: Favorites System (New)

**User Story:** As a user, I want to "favorite" specific scenarios so I can bookmark interesting or difficult questions for later review.

#### Acceptance Criteria

1. In the Training View and Feedback View, there SHALL be a "Favorite" (Star) button.
2. Toggling this button SHALL save/remove the current scenario ID to a favorites list in LocalStorage.
3. The UI SHALL provide a way to view a list of favorited scenarios (e.g., a "Favorites" filter or tab).

### Requirement 9: Custom Scenarios (New)

**User Story:** As a user, I want to create my own custom scenarios (questions), so I can record real-life problems I've encountered and use them to accumulate experience.

#### Acceptance Criteria

1. The UI SHALL provide an "Add Custom Scenario" feature.
2. The user SHALL be able to input: Title, Description, Context, and Category (defaulting to "Custom" or user-selected).
3. Custom scenarios SHALL be saved to LocalStorage.
4. Custom scenarios SHALL appear in the main category selection (e.g., under a "Custom" category or mixed in).

### Requirement 10: Analogy Practice (举一反三)

**User Story:** As a user, after reviewing a completed scenario (in history or immediate feedback), I want to generate a similar but new scenario based on the same principles, so I can practice applying what I just learned in a different context.

#### Acceptance Criteria

1. In the Feedback View (and History Detail Modal), there SHALL be a "Practice Similar Scenario" button.
2. WHEN clicked, THEN the system SHALL call the AI to generate a *new* scenario object (Title, Description, Context) that shares the same core conflict/theme as the current one but with different details.
3. The system SHALL immediately load this new scenario into the Training View and start the timer.

### Requirement 11: Logic Formula Summary (公式总结)

**User Story:** As a user, I want the AI feedback to include a concise "Logic Formula" that abstracts the solution and connects it to Zeng Shiqiang's wisdom, so I can easily memorize and apply the principle.

#### Acceptance Criteria

1. The AI analysis prompt SHALL be updated to request a `key_formula` (or similar field).
2. The formula SHALL follow a format like "Situation + Core Principle = Action" or similar abstraction.
3. The formula SHALL explicitly reference the relevant Zeng Shiqiang principle.
4. The Feedback View SHALL display this formula prominently (e.g., in a dedicated card or highlighted section).

### Requirement 12: Cancel/Back Navigation
**User Story:** As a user, I want to be able to cancel a training session and return to the main menu if I selected the wrong category or changed my mind, so that I don't feel trapped in a scenario.

#### Acceptance Criteria

1.143→1. In the Training View, there SHALL be a visible "Cancel" or "Back" button.
144→2. WHEN clicked, the system SHALL stop the current timer.
145→3. The system SHALL navigate back to the Welcome View.
146→4. No history record SHALL be saved for the cancelled session.

### Requirement 13: Smart Data Synchronization (Scheme 1)
**User Story:** As a user, I want my data (history, settings) to be synchronized between my local environment (IDE) and the browser (Chrome), and if I open the app in a new environment (Chrome) where the server data is empty, it should automatically upload my existing local data instead of overwriting it with nothing.

#### Acceptance Criteria

1. The system SHALL maintain a central data store (server-side file `server_data.json`).
2. WHEN the application initializes (`initStorage`):
    - It SHALL fetch the data from the server.
    - IF the server data is empty AND the local storage (LocalStorage) has data (Migration Scenario):
        - The system SHALL upload the local data to the server.
    - IF the server has data:
        - The system SHALL overwrite the local storage with the server data (Server is Source of Truth).
3. WHEN the user saves any data (Settings, History, Favorites, Custom Scenarios):
    - The system SHALL save to LocalStorage.
    - The system SHALL immediately sync the updated state to the server.

### Requirement 14: Massive Scenario Bank (Built-in)
**User Story:** As a user, I want a large, built-in library of questions (e.g., 100 per category) covering diverse situations, so that I can practice extensively ("brush up") without constantly relying on API generation or running out of content.

#### Acceptance Criteria

1. The system SHALL include a built-in database of 100 scenarios per category (Workplace, Emotional, Family, Academic, Social, Unexpected), totaling 600 scenarios.
2. These scenarios SHALL be loaded locally (no API call required to fetch the question).
3. The "Random Scenario" logic SHALL pick from this expanded pool.
4. The scenarios SHALL be distinct and cover the "Knowledge Base" of typical high-EQ challenges.

### Requirement 15: Training Contribution Graph (Heatmap)
**User Story:** As a user, I want to see a visual representation of my training frequency and intensity (like GitHub's contribution graph), so that I can feel motivated by seeing my progress over time.

#### Acceptance Criteria

1. On the Welcome View (or a dedicated stats area), the system SHALL display a contribution heatmap grid.
2. The grid SHALL represent days (e.g., last 30 days or last year).
3. The color of each cell SHALL indicate the training intensity (number of scenarios completed that day).
    - Gray: No activity
    - Light Green: Low activity (1-2 scenarios)
    - Dark Green: High activity (3+ scenarios)
4. The graph SHALL be calculated based on the timestamps in the `eq_history` data.

### Requirement 16: "Self-Inflicted Trouble" (Critical Social Errors) Category
**User Story:** As a user, I want a specific category for scenarios where I am at fault (e.g., caught bad-mouthing someone), with specific context about the relationship (Friend vs. Stranger), so I can learn how to de-escalate crises I created myself.

#### Acceptance Criteria

1. The system SHALL include a new category "Self-Inflicted" (Critical Errors / 自我闹事).
2. Scenarios in this category SHALL include specific `context` details regarding the relationship level (e.g., "Close Friend", "Stranger", "Boss").
3. The AI prompt SHALL be updated to recognize this context:
    - If "Close Friend": Suggest using emotional bonds and humor to de-escalate.
    - If "Stranger/Formal": Suggest formal apology and taking responsibility.

### Requirement 17: "Social Rules" (Wisdom) Integration
**User Story:** As a user, I want to practice scenarios based on specific "Social Rules" (e.g., "Don't ask permission to break rules," "Keep mystery," "Respect self-interest"), so I can internalize these advanced social survival strategies.

#### Acceptance Criteria

1. The system SHALL ingest the "Social Rules" provided in the knowledge base (`社会四条规则.txt`).
2. The AI System Prompt SHALL be updated to include these rules as part of the core wisdom (alongside Zeng Shiqiang's principles).
3. A new category or tag "Social Rules" (社会潜规则) SHALL be added.
4. Specific scenarios SHALL be generated that test the application of these rules (e.g., "Checking into a hotel alone first" vs. "Asking front desk").

## Month 1: Basic Experience Upgrade

### Requirement 18: Data Visualization & Analytics
**User Story:** As a user, I want to see a detailed analysis of my EQ capabilities so that I can understand my strengths and weaknesses across different dimensions.

#### Acceptance Criteria
1. **Ability Radar Chart**: The system SHALL display a radar chart in the statistics area, evaluating 6 dimensions:
    - Empathy (共情能力)
    - Communication (沟通技巧)
    - Emotion Management (情绪管理)
    - Conflict Resolution (冲突化解)
    - Resilience (抗压能力)
    - Social Insight (社会洞察)
2. **Stats Dashboard**: The system SHALL display:
    - Total training count.
    - Average score.
    - Best/Worst performing category.
    - Total training duration.
3. **Weakness Diagnosis**: The system SHALL analyze history to identify the weakest dimension and provide a one-sentence improvement suggestion.

### Requirement 19: Gamification System (Basic)
**User Story:** As a user, I want a gamified experience (levels, badges) to make training more fun and addictive.

#### Acceptance Criteria
1. **Adventure Mode (Levels)**:
    - Implement a "Level" system (Level 1 to Level 10).
    - Each level requires completing 3 specific scenarios with an average score > 75.
    - Unlocking mechanism: Level N unlocks only after Level N-1 is passed.
2. **Achievement System**:
    - Users can earn badges for milestones (e.g., "First Blood" for 1st training, "Streak Master" for 3 days in a row, "High Scorer" for getting 90+).
    - A "Badge Wall" SHALL be visible in the profile/stats area.
3. **Daily Challenge**:
    - The system SHALL highlight one "Daily Challenge" scenario every day.
    - Completing it gives double "Experience Points" (XP).

## Month 2: AI Capability Upgrade

### Requirement 20: AI Multi-turn Dialogue Simulation
**User Story:** As a user, I want to have a multi-turn conversation with the AI (role-playing), rather than just a single Q&A, to simulate real-life dynamic interactions.

#### Acceptance Criteria
1. **Multi-turn Engine**:
    - The "Training View" SHALL support a chat interface (user message -> AI reply -> user reply...).
    - Limit to 3 turns per scenario for the MVP (to control token costs).
2. **Role Playing**:
    - The AI SHALL adopt a specific persona based on the scenario (e.g., "Angry Boss", "Crying Partner").
    - The AI's responses SHALL reflect the emotional state of that persona.
3. **Post-Chat Analysis**:
    - Feedback and scoring SHALL happen *after* the conversation ends (or user clicks "Finish").

### Requirement 22: UI Redesign (Education Style)
**User Story:** As a user, I want a modern, clean, and educational-themed interface so that the learning experience feels professional and engaging.

#### Acceptance Criteria
1. **Color Palette**: Implement the "Educational App" palette:
    - Primary: `#4F46E5` (Indigo 600)
    - Secondary: `#818CF8` (Indigo 400)
    - Accent/CTA: `#F97316` (Orange 500)
    - Background: `#EEF2FF` (Indigo 50)
    - Text: `#1E1B4B` (Indigo 950)
2. **Typography**: Use **Fredoka** for headings (friendly, rounded) and **Nunito** for body text.
3. **Style**: Refine Claymorphism to be softer and less "bulky", aligning with modern educational apps (Item 10 in `colors.csv`).

### Requirement 23: Navigation & Dashboard Separation
**User Story:** As a user, I want a clear separation between the "Dashboard" (Welcome View) and the "Training Room" so that I can easily find where to start and not feel overwhelmed.

#### Acceptance Criteria
1. **Dashboard Layout**: The Welcome View SHALL act as a Dashboard.
    - Top: User Level & XP Bar.
    - Middle: "Start Training" area with large, clickable Category Cards.
    - Bottom: Stats & History.
2. **Clear Call-to-Action**: The Category Cards must be clearly interactive (hover effects, cursor pointer, distinct buttons).
3. **Navigation Bar**: (Optional) A simple bottom or top nav to switch between "Home", "Stats", and "Profile" (if needed), or just clear "Back" buttons.
