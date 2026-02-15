# 🧩 Intent CLI

> **Build WHAT, not HOW.**
> The first AI-powered Intent Driven Development tool for your terminal.

## 🚀 Vision

Developers spend too much time on "How do I implement this?" (wiring files, creating boilerplate) instead of "What am I building?". 
**Intent CLI** allows you to declare your intent, and the system handles the architecture, planning, and task generation.

## ✨ Features

- **🗣 Natural Language Intents**: `intent add "allow users to reset password"`
- **🧠 Context Awareness**: Detects Laravel, React, or Node.js projects automatically.
- **🗺 Smart Roadmap**: Generates step-by-step implementation plans.
- **📂 Git Integration**: Suggests atomic commits and branches (Planned).
- **💾 Local Memory**: Remembers your project context and decisions.

## 🛠 Installation

```bash
npm install
npm run build
npm link
```

## 🎮 Usage

### 1. Register an Intent
```bash
intent add "users can subscribe to newsletter"
```
*The system analyzes your project and creates a plan.*

### 2. View the Plan
```bash
intent plan
```

### 3. Execute Tasks
```bash
intent tasks
```
*Interactive checklist to track progress.*

### 4. Check Status
```bash
intent status
```

## 🏗 Architecture

- **Core**: TypeScript + Node.js
- **CLI**: Commander.js
- **UI**: Inquirer, Chalk, Ora, Boxen
- **Storage**: LowDB (Local JSON)

## 📂 Project Structure

- `bin/`: CLI Entry point
- `src/core/`: Logic modules (Parser, Analyzer, Impact, Roadmap)
- `src/modules/`: Extended capabilities
- `demo-app/`: Sample Laravel environment for testing

---
*Built for GitHub Copilot CLI Challenge 2026*
