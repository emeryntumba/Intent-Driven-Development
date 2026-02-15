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

5.  **Check Status**
    Get a summary dashboard.
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
