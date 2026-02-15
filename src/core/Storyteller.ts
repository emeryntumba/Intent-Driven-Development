
import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import inquirer from 'inquirer';
import { Brain } from './Brain.ts';

interface StoryEvent {
  hash: string;
  date: string;
  message: string;
  author: string;
  type: 'feat' | 'fix' | 'chore' | 'docs' | 'refactor' | 'other';
  dayOffset: number;
}

export class Storyteller {
  private brain: Brain;

  constructor() {
    this.brain = new Brain();
  }

  public async tellStory() {
    const spinner = ora('Reading project history...').start();
    
    try {
      const commits = await this.getCommits();
      spinner.stop();

      if (commits.length === 0) {
        console.log(chalk.yellow('No history found. Is this a git repository?'));
        return;
      }

      console.log(boxen(chalk.bold('📖 Project Story Mode'), { 
        padding: 1, 
        borderStyle: 'double', 
        borderColor: 'cyan' 
      }));

      this.displayTimeline(commits);
      
      await this.interact(commits);

    } catch (error) {
      spinner.fail('Failed to read git history.');
      console.error(error);
    }
  }

  private async getCommits(): Promise<StoryEvent[]> {
    // Format: hash|date|message|author
    const { stdout } = await execa('git', ['log', '--pretty=format:%h|%ad|%s|%an', '--date=short', '--reverse']);
    
    const lines = stdout.split('\n');
    if (!lines[0]) return [];

    const firstDate = new Date(lines[0].split('|')[1]);

    return lines.map(line => {
      const [hash, dateStr, message, author] = line.split('|');
      const date = new Date(dateStr);
      
      // Calculate day offset
      const diffTime = Math.abs(date.getTime() - firstDate.getTime());
      const dayOffset = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Determine type
      let type: StoryEvent['type'] = 'other';
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('feat') || lowerMsg.includes('add') || lowerMsg.includes('create')) type = 'feat';
      else if (lowerMsg.includes('fix') || lowerMsg.includes('bug')) type = 'fix';
      else if (lowerMsg.includes('chore')) type = 'chore';
      
      return { hash, date: dateStr, message, author, type, dayOffset };
    });
  }

  private displayTimeline(commits: StoryEvent[]) {
    console.log(chalk.gray('--------------------------------------------------'));
    
    let lastDay = -1;

    commits.forEach(commit => {
      // Group by day roughly or just show day offset
      const dayLabel = `Day ${commit.dayOffset}`.padEnd(6);
      
      let icon = '⚪';
      let color = chalk.white;
      
      if (commit.type === 'feat') { icon = '🟢'; color = chalk.green; }
      if (commit.type === 'fix') { icon = '🔴'; color = chalk.red; }
      if (commit.type === 'chore') { icon = '🔧'; color = chalk.gray; }

      // Logic to not repeat Day if same
      const dateDisplay = lastDay !== commit.dayOffset ? chalk.bold(dayLabel) : '      ';
      lastDay = commit.dayOffset;

      console.log(`${chalk.dim(dateDisplay)} ${icon} ${color(commit.message)} ${chalk.dim(`(${commit.author})`)}`);
      
      // Simulated AI Insight for "Fixes"
      if (commit.type === 'fix') {
         console.log(`       ${chalk.blue('🔵 AI Insight: Consider adding a regression test for this scenario.')}`);
      }
    });

    console.log(chalk.gray('--------------------------------------------------'));
    console.log(chalk.blue('🧠 Suggested next step: ') + this.generateSuggestion(commits));
    console.log('');
  }

  private generateSuggestion(commits: StoryEvent[]): string {
    const lastCommit = commits[commits.length - 1];
    if (lastCommit.type === 'feat') return `Add unit tests for "${lastCommit.message}"`;
    if (lastCommit.type === 'fix') return "Refactor module to prevent recurrence.";
    return "Review project structure for optimization.";
  }

  private async interact(commits: StoryEvent[]) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Explore the story:',
        choices: [
          ...commits.map(c => ({
            name: `${c.type === 'fix'?'🔴':'🟢'} ${c.message}`,
            value: c.hash
          })),
          new inquirer.Separator(),
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    if (action === 'exit') return;

    await this.showCommitDetails(action);
    await this.interact(commits); // Loop back
  }

  private async showCommitDetails(hash: string) {
    const spinner = ora('Analyzing commit...').start();
    
    try {
      // Get commit diff
      const { stdout: diff } = await execa('git', ['show', hash, '--stat', '--color=always']);
      spinner.stop();
      
      console.log(boxen(diff, { padding: 1, borderColor: 'gray' }));

      // Copilot Explanation (Simulated or Real via Brain)
      // For now, simple simulation
      console.log(chalk.cyan('🤖 Copilot Explanation:'));
      console.log(chalk.italic(`Analysis of commit ${hash}:`));
      console.log(`This change modified files to implement the intended behavior. 
Key changes involve logic updates and structure adjustments.`);
      
    } catch (e) {
      spinner.fail('Could not retrieve commit details.');
    }
  }
}
