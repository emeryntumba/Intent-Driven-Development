#!/usr/bin/env node
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

const program = new Command();
const memory = Memory.getInstance();
// Initialize core modules
const analyzer = new Analyzer(process.cwd());
const parser = new Parser(memory);


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

    const impactSpinner = ora('Calculating impact...').start();
    const impact = Impact.calculate(intent, projectFiles);
    intent.impact = impact;
    impactSpinner.succeed(chalk.yellow(`Impact analysis complete: ${impact.files.length} files affected`));

    const planSpinner = ora('Generating roadmap...').start();
    const tasks = Roadmap.generate(intent);
    intent.tasks = tasks;
    intent.status = 'PLANNED';
    planSpinner.succeed(chalk.magenta(`Roadmap generated: ${tasks.length} tasks created`));

    memory.addIntent(intent);

    console.log(boxen(
      `${chalk.bold(intent.original)}\n\n` +
      `${chalk.green('✔ Intent Registered')}\n` +
      `${chalk.blue('✔ Project Context Loaded')}\n` +
      `${chalk.yellow('✔ Impact Calculated')}\n` +
      `${chalk.magenta('✔ Plan Ready')}`,
      { padding: 1, borderStyle: 'round', borderColor: 'green', title: 'Intent Summary' }
    ));

    console.log(`\nRun ${chalk.cyan('intent tasks')} to see the implementation plan.`);
  });

program
  .command('analyze')
  .description('Analyze the current project architecture')
  .action(async () => {
    const spinner = ora('Analyzing...').start();
    const info = analyzer.analyze();
    const files = await analyzer.scanFiles();
    
    spinner.succeed(chalk.green('Analysis Complete'));
    console.log(boxen(
        `${chalk.bold('Project Analysis')}\n\n` +
        `Framework: ${chalk.green(info.framework)}\n` +
        `Language:  ${chalk.blue(info.language)}\n` +
        `Files:     ${chalk.yellow(files.length)}\n` +
        `Root:      ${chalk.gray(info.root)}`,
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
  .description('Interactive task runner')
  .action(async () => {
    const intents = memory.getIntents();
    const active = intents[intents.length - 1];

    if (!active || !active.tasks || active.tasks.length === 0) {
        console.log(chalk.yellow('No tasks available. Use "intent add" first.'));
        return;
    }

    const answers = await inquirer.prompt([{
        type: 'checkbox',
        name: 'completed',
        message: 'Mark tasks as completed:',
        choices: active.tasks.map(t => ({
            name: `${t.description} ${t.file ? chalk.gray('(' + t.file + ')') : ''}`,
            value: t.id,
            checked: t.status === 'DONE'
        }))
    }]);

    const selectedIds = answers.completed;

    // Update status locally
    let allDone = true;
    active.tasks.forEach(t => {
        if (selectedIds.includes(t.id)) {
            t.status = 'DONE';
        } else {
            t.status = 'TODO'; // Toggle back if unchecked
            allDone = false;
        }
    });

    if (allDone) {
        active.status = 'COMPLETED';
        console.log(chalk.green('\n🎉 All tasks completed! Intent fulfilled.'));
    }

    memory.updateIntent(active.id, active);
    console.log(chalk.green('\nTask status updated.'));
  });

program
  .command('explain')
  .description('Explain the architectural decisions')
  .action(() => {
    console.log(chalk.cyan('💡 Architecture explanation:'));
    console.log(chalk.gray('This feature requires database migration changes due to "user" entity modification...'));
    // Mock explanation
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
