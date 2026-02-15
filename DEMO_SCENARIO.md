# Intent CLI - Multi-Framework Demo

## 1. Laravel Scenario
```bash
cd demo-app
# Register generic intent
npx ts-node --esm ../bin/intent.ts add "users can reset password via email"
# Result: Detects Laravel, suggests Artisan commands, Migration, Model trait.
npx ts-node --esm ../bin/intent.ts explain
# Result: Explains Auth flow in Laravel context.
```

## 2. React/Next.js Scenario
```bash
cd demo-react
# Register UI intent
npx ts-node --esm ../bin/intent.ts add "create dashboard page with stats component"
# Result: Detects Next.js, suggests creating 'app/page.tsx', 'src/components'.
npx ts-node --esm ../bin/intent.ts explain
# Result: Explains Component composition and State management.
```

## 3. Generic Scenario (Node/Python)
```bash
mkdir demo-node
echo {} > demo-node/package.json
cd demo-node
npx ts-node --esm ../bin/intent.ts add "process data from CSV"
# Result: Suggests generic Logic implementation and Unit Tests.
```
