import fs from 'fs';
import path from 'path';
import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import type { Task } from '../types/index.ts';

export class Executor {
  /**
   * Executes a task based on its type.
   */
  public async execute(task: Task): Promise<boolean> {
    if (task.type === 'SHELL' && task.command) {
      return this.executeShell(task.command);
    }
    
    if (task.type === 'CREATE_FILE' && task.file && task.content) {
      return this.createFile(task.file, task.content);
    }

    // Manual tasks are just marked done by the user interface flow, 
    // but if we are called here, we assume success.
    return true;
  }

  private async executeShell(command: string): Promise<boolean> {
    const spinner = ora(`Running: ${command}`).start();
    try {
      // Split command into tool and args
      const parts = command.split(' ');
      const tool = parts[0];
      const args = parts.slice(1);

      await execa(tool, args, { stdio: 'inherit' });
      spinner.succeed(chalk.green(`Executed: ${command}`));
      return true;
    } catch (error) {
      spinner.fail(chalk.red(`Failed: ${command}`));
      console.error(error);
      return false;
    }
  }

  private async createFile(filePath: string, content: string): Promise<boolean> {
    const spinner = ora(`Creating file: ${filePath}`).start();
    try {
      const fullPath = path.resolve(process.cwd(), filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, content);
      spinner.succeed(chalk.green(`Created: ${filePath}`));
      return true;
    } catch (error) {
      spinner.fail(chalk.red(`Error creating file: ${filePath}`));
      console.error(error);
      return false;
    }
  }
}
