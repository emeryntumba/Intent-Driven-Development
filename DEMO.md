# Intent CLI Demo Scenario

## 1. Setup
Make sure you have dependencies installed:
```bash
npm install
npm run build
```

## 2. Initialize a Mock Project
Since we don't have a full Laravel app, let's create a mock structure to test the Analyzer.

```bash
mkdir -p demo-app/app/Models
mkdir -p demo-app/app/Http/Controllers
mkdir -p demo-app/routes
echo '{"require": {"laravel/framework": "^10.0"}}' > demo-app/composer.json
echo "<?php" > demo-app/routes/api.php
echo "<?php" > demo-app/app/Models/User.php
cd demo-app
```

## 3. Run the CLI
Use the `intent` command (linked or via node).

### Register an Intent
```bash
node --loader ts-node/esm ../bin/intent.ts add "users can subscribe to newsletter"
```
**Expected Output:**
- Parser detects "FEATURE"
- Analyzer detects "LARAVEL"
- Impact detects `User.php`, `routes/api.php`
- Roadmap creates tasks for Migration, Model, Controller.

### Check Status
```bash
node --loader ts-node/esm ../bin/intent.ts status
```

### View Plan
```bash
node --loader ts-node/esm ../bin/intent.ts plan
```

### Execute Tasks
```bash
node --loader ts-node/esm ../bin/intent.ts tasks
```
(Select tasks to mark as done)

## 4. Explain
```bash
node --loader ts-node/esm ../bin/intent.ts explain
```
