import type { Intent } from '../types/index.ts';
import { Memory } from './Memory.ts';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class Parser {
  private memory: Memory;

  constructor(memory: Memory) {
    this.memory = memory;
  }

  public async parse(input: string): Promise<Intent> {
    console.log(chalk.gray(`Parsing intent: "${input}"`));

    // Improved heuristic
    let type: Intent['type'] = 'UNKNOWN';
    const lower = input.toLowerCase();
    if (lower.startsWith('add') || lower.includes('feature') || lower.includes('create') || lower.includes('implement') || lower.includes('can')) {
      type = 'FEATURE';
    } else if (lower.includes('fix') || lower.includes('bug') || lower.includes('error') || lower.includes('issue')) {
      type = 'BUGFIX';
    } else if (lower.includes('refactor') || lower.includes('clean') || lower.includes('optimize')) {
      type = 'REFACTOR';
    }

    // Identify impact (mock logic)
    const impact = {
      files: [],
      modules: [] // Would require deeper analysis
    };

    return {
      id: Math.random().toString(36).substring(7),
      original: input,
      status: 'PENDING',
      type,
      impact,
      createdAt: new Date().toISOString()
    };
  }

  public async validate(intent: Intent): Promise<boolean> {
    if (intent.type === 'UNKNOWN') {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Could not determine intent type automatically. Is it a FEATURE request?',
        default: true
      }]);
      if (confirm) intent.type = 'FEATURE';
      return confirm;
    }
    return true;
  }
}
