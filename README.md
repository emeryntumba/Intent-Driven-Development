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

## 🛠 Installation Guide (New Machine)

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- **GitHub CLI** (optional, recommended for AI features)

### 2. Setup (Quick Way)

**Windows:**
Double-click `setup.bat` or run:
```bash
./setup.bat
```

**Linux / Mac:**
Make the script executable and run it:
```bash
chmod +x setup.sh && ./setup.sh
```

### 3. Manual Installation (If script fails)
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/intent-driven-development.git
cd intent-driven-development
npm install
```

### 4. Build & Link
Compile the TypeScript code and link the command globally:

```bash
# Compile TypeScript to JavaScript
npm run build

# Make 'intent' command available in your terminal
npm link
```
*Note: You may need `sudo npm link` on macOS/Linux.*

### 4. Verify
Close and reopen your terminal, then run:

```bash
intent --version
```

## 🎮 Usage Workflow

1.  **Navigate to your project** (e.g., a Laravel or React app).
    ```bash
    cd my-laravel-app
    ```

2.  **Declare your Intent**
    Tell the CLI what feature you want to build.
    ```bash
    intent add "users can reset password via email"
    ```
    *The specific tasks for Laravel/PHP will be generated.*

3.  **Review the Plan**
    See the roadmap and AI architectural advice.
    ```bash
    intent explain
    intent plan
    ```

4.  **Track Progress**
    Use the interactive checklist as you code.
    ```bash
    intent tasks
    ```

## 📟 Command Reference

| Command | Description & Utility |
| :--- | :--- |
| **`intent matrix`** | **The Dashboard.** Launches a high-performance TUI (Terminal User Interface) providing a real-time "Neural Interface" view of your project. It visualizes file structure, AI analysis, and system load in a sci-fi style. *Perfect for getting a high-level overview or impressing stakeholders.* |
| **`intent add <intent>`** | **The Core.** Registers a new feature intent (e.g., "Add dark mode"). It triggers the AI to analyze your project context, calculate impact ("Blast Radius"), and generate a tailored implementation roadmap. |
| **`intent tasks`** | **The Executor.** Opens an interactive checklist of the generated plan. Allows you to mark tasks as done, run automated scripts, and keep focus without switching to a project management tool. |
| **`intent explain`** | **The Mentor.** Uses **GitHub Copilot CLI** to explain *why* the architectural choices were made. Great for understanding complex patterns or justifying decisions to a team. |
| **`intent plan`** | **The Map.** Displays the current implementation roadmap as a clean list. Useful for a quick check of what needs to be done next without entering interactive mode. |
| **`intent analyze`** | **The Scanner.** Performs a deep scan of your codebase to detect frameworks (Laravel, React, etc.), languages, and patterns. It feeds this context to the AI for better suggestions. |
| **`intent status`** | **The Tracker.** Shows a summary box of the current active intent, including progress (e.g., "3/5 tasks completed") and status (PLANNED, IN_PROGRESS, COMPLETED). |
| **`intent story`** | **The Historian.** Visualizes your project's history and evolution in a gamified, narrative format. Turns your git log and intent history into an engaging story of progress. |

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
