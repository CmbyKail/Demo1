# Design: Humor & Wit Content Enhancement

## 1. Architecture
No major architectural changes. We will utilize the existing `SkillModuleManager` and `server_data.json` structure.
The enhancement involves:
1.  **Data Layer**: Extending `server_data.json` with new content for the `humor` module and adding a new `rebuttal` module.
2.  **UI Layer**: No code changes needed in `SkillModuleRenderer.js` as it dynamically renders based on JSON data (assuming `title` fields are present).

## 2. Data Structure Design

### 2.1 Existing Module: Humor (幽默表达)
**Enhancements:**
-   **Lessons**: Add Lesson 04 & 05.
-   **Exercises**: Add Exercises 04-08.
-   **Scenarios**: Add Scenarios 03-05.

**New Content Outline:**
-   **Lesson 04: Call Back (呼应)**
    -   *Concept*: Referring back to a previous joke or context.
    -   *Example*: "Remember the subway guy? He's here too."
-   **Lesson 05: Benign Violation (冒犯的艺术)**
    -   *Concept*: Safe violation of norms.
    -   *Example*: Roasting friends vs. strangers.

### 2.2 New Module: High EQ Rebuttal (高情商回击) - "骂人不带脏字"
**Module Metadata:**
-   `id`: "rebuttal"
-   `name`: "高情商回击"
-   `icon`: "🛡️"
-   `description`: "学习不带脏字的优雅回击，维护尊严又不失风度"

**Lessons:**
1.  **Lesson 01: 绵里藏针 (Irony & Politeness)**
    -   *Concept*: Using excessive politeness or praise to imply criticism.
    -   *Example*: "您这智商，真是不给爱因斯坦留活路啊。" (Complimenting intelligence sarcastically)
2.  **Lesson 02: 借力打力 (The Boomerang)**
    -   *Concept*: Using the attacker's logic against them.
    -   *Example*: A: "You're fat." B: "Yeah, my body is expanding to contain my awesome personality." (Or better example: A: "You're late." B: "I wanted to ensure you had ample time to miss me.")
3.  **Lesson 03: 降维打击 (Reframing)**
    -   *Concept*: Ignoring the insult and focusing on the hidden emotion or motive.
    -   *Example*: A: "You're stupid." B: "You seem really stressed today. Do you want to talk about it?"

**Exercises:**
-   3-5 exercises focusing on identifying the technique or rewriting responses.

**Scenarios:**
-   Workplace conflict (Unreasonable boss).
-   Social conflict (Rude relative).

## 3. JSON Schema
All data will be appended to `server_data.json` under `skillModules`.

```json
"rebuttal": {
  "id": "rebuttal",
  "name": "高情商回击",
  "icon": "🛡️",
  "description": "...",
  "theoryLessons": [...],
  "exercises": [...],
  "scenarios": [...]
}
```

## 4. Implementation Plan
1.  **Backup**: Backup `server_data.json`.
2.  **Update Humor**: Append new lessons/exercises to `humor` object.
3.  **Create Rebuttal**: Add `rebuttal` object to `skillModules`.
4.  **Verify**: Reload app and check both modules.
