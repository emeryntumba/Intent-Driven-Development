#!/usr/bin/env node --loader ts-node/esm --no-warnings
import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

import ora from 'ora';
import inquirer from 'inquirer';
import { Memory } from '../src/core/Memory.ts';
import { Parser } from '../src/core/Parser.ts';
import { Analyzer } from '../src/core/Analyzer.ts';
import { Impact } from '../src/core/Impact.ts';
import { Roadmap } from '../src/core/Roadmap.ts';
import { GitPlanner } from '../src/core/GitPlanner.ts';
import { Executor } from '../src/core/Executor.ts';
import { Brain } from '../src/core/Brain.ts';
import { Storyteller } from '../src/core/Storyteller.ts';
import { Matrix } from '../src/core/Matrix.ts';

const program = new Command();
const memory = Memory.getInstance();
// Initialize core modules
const analyzer = new Analyzer(process.cwd());
const parser = new Parser(memory);
const brain = new Brain();
const executor = new Executor();


console.log(
  chalk.cyan(
    figlet.textSync('Intent CLI', { horizontalLayout: 'full' })
  )
);

program
  .name('intent')
  .description('Intent Driven Development CLI - Focus on WHAT, not HOW')
  .version('1.0.0');


program
  .command('story')
  .description('Visualize project history as an interactive story (Live Project Story Mode)')
  .action(async () => {
    const storyteller = new Storyteller();
    await storyteller.tellStory();
  });

program
  .command('matrix')
  .description('Enter the Project Matrix (WOW Mode)')
  .action(async () => {
    const matrix = new Matrix();
    await matrix.enter();
  });

program
  .command('add')
  .argument('<intent>', 'The feature intent you want to register')
  .description('Register a new feature intent')
  .action(async (intentStr) => {
    const inputSpinner = ora('Parsing intent...').start();
    const intent = await parser.parse(intentStr);
    inputSpinner.succeed(chalk.green(`Parsed intent: ${chalk.bold(intent.type)}`));

    const projectSpinner = ora('Analyzing project context...').start();
    // Re-analyze or use cached? Let's analyze fresh for demo.
    const projectInfo = analyzer.analyze();
    const projectFiles = await analyzer.scanFiles(); 
    
    projectSpinner.stopAndPersist({
      symbol: '🔍',
      text: chalk.blue(`Analyzed ${projectInfo.framework} project (${projectFiles.length} files scanned)`)
    });

    const impactSpinner = ora('Calculating impact (AI Analysis)...').start();
    const impact = Impact.calculate(intent, projectFiles);
    // Simulate AI thinking with context
    await brain.generateExplanation(intent, projectInfo); 
    
    intent.impact = impact;

    impactSpinner.succeed(chalk.yellow(`Impact analysis complete: ${impact.files.length} files affected`));

    const planSpinner = ora('Generating roadmap with GitHub Copilot...').start();
    
    // Combining Heuristics with AI logic, using project context
    const baseTasks = Roadmap.generate(intent, projectInfo);
    const aiTasks = await brain.generateSmartTasks(intent, projectInfo);
    
    // Merge tasks
    intent.tasks = [...baseTasks, ...aiTasks].filter((v,i,a)=>a.findIndex(t=>(t.description === v.description))===i);

    intent.status = 'PLANNED';
    planSpinner.succeed(chalk.magenta(`Roadmap generated: ${intent.tasks.length} tasks ready`));
    
    memory.addIntent(intent);

    // Git Planner Integration
    const branchName = GitPlanner.generateBranchName(intent);
    const commitMsg = await brain.generateCommitMessage(intent);

    console.log(boxen(
      `${chalk.bold(intent.original)}\n\n` +
      `${chalk.green('✔ Intent Registered')}\n` +
      `${chalk.blue('✔ Context Loaded')}\n` +
      `${chalk.yellow('✔ Impact Calculated')}\n` +
      `${chalk.magenta('✔ Plan Ready')}\n\n` +
      `${chalk.gray('Git Recommendation:')}\n` +
      `Branch: ${chalk.cyan(branchName)}\n` +
      `Commit: ${chalk.cyan(commitMsg)}`,
      { padding: 1, borderStyle: 'round', borderColor: 'green', title: 'Intent Summary' }
    ));

    console.log(`\nRun ${chalk.cyan('intent tasks')} to see the implementation plan.`);
    
    // Auto-run tasks command
    await executeTasks();
  });


program
  .command('analyze')
  .description('Analyze the current project architecture')
  .action(async () => {
    const spinner = ora('Analyzing...').start();
    const info = analyzer.analyze();
    const files = await analyzer.scanFiles();
    
    spinner.succeed(chalk.green('Analysis Complete'));
    
    // Generate AI Context Summary
    const structureSummary = Object.entries(info.structure)
        .filter(([_, exists]) => exists)
        .map(([key]) => key.replace('has', ''))
        .join(', ');

    console.log(boxen(
        `${chalk.bold('Project Analysis')}\n\n` +
        `Framework: ${chalk.green(info.framework)}\n` +
        `Language:  ${chalk.blue(info.language)}\n` +
        `Files:     ${chalk.yellow(files.length)}\n` +
        `Root:      ${chalk.gray(info.root)}\n\n` +
        `${chalk.bold('AI Context (Copilot Ready)')}\n` +
        `Structure: ${chalk.cyan(structureSummary || 'Minimal')}\n` +
        `Pkg Mgr:   ${chalk.magenta(info.packageManager)}\n` +
        `Context:   ${chalk.italic('Provides grounding for relevant suggestions')}`,
        { padding: 1, borderStyle: 'single', borderColor: 'blue' }
    ));
  });

program
  .command('plan')
  .description('Show the implementation plan for the active intent')
  .action(() => {
    const intents = memory.getIntents();
    const active = intents[intents.length - 1]; // Last added intent
    if (!active || active.status === 'COMPLETED') {
        console.log(chalk.yellow('No active plan found. Use "intent add <feature>" first.'));
        return;
    }
    
    console.log(chalk.bold(`\nPlan for: "${active.original}"`));
    (active.tasks || []).forEach(task => {
        const icon = task.status === 'DONE' ? '✅' : '⬜';
        console.log(`${icon} ${chalk.white(task.description)} ${task.file ? chalk.gray('(' + task.file + ')') : ''}`);
    });
  });

program
  .command('tasks')
  .description('Interactive task runner and executor')
  .action(executeTasks);

async function executeTasks() {
    const intents = memory.getIntents();
    const active = intents[intents.length - 1];

    if (!active || !active.tasks || active.tasks.length === 0) {
        console.log(chalk.yellow('No tasks available. Use "intent add" first.'));
        return;
    }

    // Filter tasks that are not yet done
    const todoTasks = active.tasks.filter(t => t.status !== 'DONE');

    if (todoTasks.length === 0) {
        console.log(chalk.green('🎉 All tasks are already completed!'));
        active.status = 'COMPLETED';
        memory.updateIntent(active.id, active);
        return;
    }

    // Ask user which tasks to execute/complete
    const answers = await inquirer.prompt([{
        type: 'checkbox',
        name: 'tasksToRun',
        message: 'Select tasks to EXECUTE:',
        choices: todoTasks.map(t => ({
            name: `${t.description} ${t.type && t.type !== 'MANUAL' ? chalk.cyan('['+t.type+']') : ''} ${t.file ? chalk.gray('(' + t.file + ')') : ''}`,
            value: t.id,
            checked: true
        }))
    }]);

    const selectedIds = answers.tasksToRun;
    
    if (!selectedIds || selectedIds.length === 0) {
        console.log('No tasks selected.');
        return;
    }

    console.log(chalk.cyan('\n🚀 Executing selected tasks...\n'));

    for (const task of active.tasks) {
        if (selectedIds.includes(task.id)) {
            // Execute automation if available
            if (task.type === 'SHELL' || task.type === 'CREATE_FILE') {
                const success = await executor.execute(task);
                if (success) {
                    task.status = 'DONE';
                } else {
                    console.log(chalk.red(`Task failed: ${task.description}`));
                }
            } else {
                // Manual tasks are strictly "marked" as done
                task.status = 'DONE';
            }
        }
    }

    // Check overall completion
    const remaining = active.tasks.filter(t => t.status !== 'DONE').length;
    if (remaining === 0) {
        active.status = 'COMPLETED';
        console.log(chalk.green('\n🎉 All tasks completed! Intent fulfilled.'));
    } else {
        console.log(chalk.yellow(`\n${remaining} tasks remaining.`));
    }

    memory.updateIntent(active.id, active);
    console.log(chalk.green('\nTask status updated.'));
}

// Brain is already imported at the top
// import { Brain } from '../src/core/Brain.ts';

// Add the brain instance at the top
// const brain = new Brain();

program
  .command('explain')
  .description('Explain the architectural decisions with AI')
  .action(async () => {
    const intents = memory.getIntents();
    const active = intents[intents.length - 1];

    if (!active) {
        console.log(chalk.red('No active intent found.'));
        return;
    }

    const spinner = ora('Generating explanation...').start();
    
    // We need to re-analyze to get the context for explanation if we are running in a fresh command (not add)
    // For simplicity in this demo, we assume the environment hasn't changed drastically or we scan quickly.
    // In a real app, we would store ProjectInfo in memory/storage.
    // Let's do a quick scan since we are in a different process usually.
    const tempInfo = analyzer.analyze();
    
    const explanation = await brain.generateExplanation(active, tempInfo);
    spinner.succeed(chalk.green('Explanation Ready'));

    console.log(boxen(
      chalk.white(explanation),
      { 
        padding: 1, 
        margin: 1, 
        borderStyle: 'double', 
        borderColor: 'cyan', 
        title: `AI Architect: ${active.original}` 
      }
    ));
  });

program
  .command('status')
  .description('Show the status of the current intent')
  .action(() => {
    const intents = memory.getIntents();
    const active = intents[intents.length - 1];
    
    const content = active 
        ? `${chalk.bold(active.original)}\nStatus: ${active.status}\nTasks: ${active.tasks?.filter(t => t.status === 'DONE').length}/${active.tasks?.length}`
        : 'No active intent.';

    const statusBox = boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: active ? 'green' : 'gray',
      title: 'Current Status',
    });
    console.log(statusBox);
  });

program.parse(process.argv);
