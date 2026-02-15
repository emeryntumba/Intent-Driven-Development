
import chalk from 'chalk';
import { Analyzer } from './Analyzer.ts';
import { Brain } from './Brain.ts';
import fs from 'fs';
import path from 'path';

export class Matrix {
  private analyzer: Analyzer;
  private brain: Brain;
  private isRunning: boolean = true;

  constructor() {
    this.analyzer = new Analyzer();
    this.brain = new Brain();
  }

  public async enter() {
    const projectInfo = this.analyzer.analyze();
    
    console.clear();
    // Intro Sequence
    await this.typewriter(chalk.green('Initializing Neural Interface...'), 20);
    await this.delay(200);
    await this.typewriter(chalk.cyan(`Target: ${projectInfo.root}`), 10);
    await this.delay(100);
    await this.typewriter(chalk.magenta(`Framework Core: [ ${projectInfo.framework.toUpperCase()} ]`), 10);
    await this.delay(300);
    
    console.clear();

    // Start Live Loop
    await this.renderDashboard(projectInfo);
  }

  private async renderDashboard(info: any) {
    let files: string[] = [];
    try {
        const scanned = await this.analyzer.scanFiles();
        if (scanned && scanned.length > 0) {
            files = scanned;
        } else {
             // Deep fallback scan
             const manualScan = (dir: string): string[] => {
                let results: string[] = [];
                const list = fs.readdirSync(dir);
                list.forEach(file => {
                    const full = path.join(dir, file);
                    const stat = fs.statSync(full);
                    if (stat && stat.isDirectory() && !full.includes('node_modules') && !full.includes('.git')) {
                        results = results.concat(manualScan(full));
                    } else if (!full.includes('node_modules')) {
                        results.push(path.relative(process.cwd(), full));
                    }
                });
                return results;
             };
             files = manualScan(process.cwd());
        }
    } catch (e) {
        // Absolute fallback
        files = ['package.json', 'README.md'];
    }
    
    // Ensure we have something
    if (files.length === 0) files = ['package.json'];

    const coreColor = info.language === 'PHP' ? chalk.red : info.language === 'PYTHON' ? chalk.yellow : chalk.blue;
    
    // AI Loop Variables
    let currentInference = '';
    let targetInference = '';
    let currentFile = '';
    let currentSnippet = '';
    let lastInferenceTime = Date.now() - 5000; // Trigger immediately
    let isAnalyzing = false;
    let inferenceIndex = 0;

    const startTime = Date.now();
    process.stdout.write('\x1B[?25l'); // Hide cursor
    console.clear(); // Clear once at start

    // Enable keypress handling
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => {
            // Check for 'x', 'q', or Ctrl+C
            if (key.toString() === 'x' || key.toString() === 'q' || key.toString() === '\u0003') {
                this.isRunning = false;
            }
        });
    }

    // Main Loop
    while (this.isRunning) {
        const pulse = Math.sin(Date.now() / 200) > 0 ? '●' : '○';
        
        // Random usage generators
        const cpu = Math.floor(Math.abs(Math.sin(Date.now() / 1000) * 100));
        const mem = Math.floor(256 + Math.abs(Math.cos(Date.now() / 2000) * 50));
        const net = (Math.random() * 2).toFixed(1);

        // Copilot "Ghost in the Machine" Logic
        if (!isAnalyzing && (Date.now() - lastInferenceTime > 4000) && files.length > 0) {
            isAnalyzing = true;
            lastInferenceTime = Date.now();
            
            this.prepareGhostAnalysis(files).then(result => {
                currentFile = result.file;
                currentSnippet = result.snippet;
                targetInference = result.thought;
                inferenceIndex = 0;
                currentInference = ''; // Reset for typing effect
                isAnalyzing = false;
            }).catch(() => {
                isAnalyzing = false;
            });
        }

        // Typewriter Effect for AI Thought
        if (targetInference && currentInference.length < targetInference.length) {
            currentInference += targetInference.charAt(inferenceIndex);
            inferenceIndex++;
        } else if (!targetInference && !isAnalyzing) {
             // Fallback if no AI active
             targetInference = "Scanning project execution flow...";
             inferenceIndex = 0;
        }

        const dashboard = [
          chalk.bold.white('╔══════════════════════════════════════════════════════════╗'),
          chalk.bold.white(`║ ${chalk.cyan('INTENT MATRIX')} v3.4   ${chalk.gray('Status:')} ${chalk.green('ONLINE')} ${pulse} ║`),
          chalk.bold.white('╚══════════════════════════════════════════════════════════╝'),
          `Project Root:   ${process.cwd().padEnd(40)}`,
          `Framework:      ${coreColor.bold(info.framework)}         `,
          `Active File:    ${(currentFile ? chalk.yellow(currentFile) : chalk.gray('Scanning...')).padEnd(50)}`,
          '',
          chalk.bgBlack.white.underline('REALTIME VITALS'.padEnd(58)),
          `CPU: ${this.drawBar(cpu, 15)} ${cpu}%  MEM: ${this.drawBar((mem/512)*100, 15)} ${mem}MB     `,
          '',
          chalk.bgBlack.white.underline('NEURAL INTERFACE'.padEnd(58)),
          (currentSnippet ? chalk.dim(currentSnippet.split('\n').slice(0, 2).map(l => `> ${l.padEnd(50)}`).join('\n')) : chalk.dim('> Waiting for stream...'.padEnd(56))),
          '',
          chalk.bgBlack.white.underline('COPILOT INSIGHT'.padEnd(58)),
          `${chalk.magenta('>>>')} ${(currentInference + '_').padEnd(54)}`, 
          '',
          chalk.gray('  Press [x] or [q] to disconnect from the Matrix.'.padEnd(58))
        ].join('\n');

        // Move cursor to top-left (H) instead of clearing (2J) to stop flickering
        process.stdout.write('\x1B[H'); 
        process.stdout.write(dashboard);
        
        await this.delay(80); 
    }
    
    // Cleanup
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeAllListeners('data');
    }

    process.stdout.write('\x1B[?25h'); // Show cursor
    console.clear();
  }

  private async prepareGhostAnalysis(files: string[]): Promise<{file: string, snippet: string, thought: string}> {
      let randomFile = '';
      try {
          randomFile = files[Math.floor(Math.random() * files.length)];
          const fullPath = path.resolve(process.cwd(), randomFile);
          
          if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
              return { file: '', snippet: '', thought: '' };
          }
          
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');
          // flexible random chunk reading
          const maxStart = Math.max(0, lines.length - 5);
          const startLine = Math.floor(Math.random() * maxStart);
          const snippet = lines.slice(startLine, startLine + 4).join('\n').trim();
          
          if (!snippet) return { file: randomFile, snippet: '<empty>', thought: 'File appears empty.' };

          // Real brain call (simulated or real depending on Brain.ts implementation)
          // We wrap in timeout to ensure responsiveness
          const brainPromise = this.brain.ask(`Analyze this code snippet in 10 words: "${snippet}"`);
          const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000));
          
          let thought = await Promise.race([brainPromise, timeoutPromise]).catch(() => '');

          // Fallback Simulation if Brain fails or times out
          if (!thought || thought.length < 5) {
              const filename = path.basename(randomFile);
              if (filename.endsWith('.json')) thought = `Validating JSON structure in ${filename}...`;
              else if (filename.endsWith('.ts') || filename.endsWith('.js')) thought = `Optimizing function calls in ${filename}...`;
              else if (filename.endsWith('.php')) thought = `Checking PSR-4 compliance in ${filename}...`;
              else thought = `Indexing content of ${filename}...`;
          }
          
          // Cleanup thought (remove quotes, trim)
          thought = thought.replace(/^"|"$/g, '').trim();
          if (thought.length > 80) thought = thought.substring(0, 77) + '...';

          return { file: randomFile, snippet, thought };
      } catch (e) {
          // Absolute fail-safe
          return { 
              file: randomFile || 'unknown', 
              snippet: '// Reading sector...', 
              thought: 'Re-calibrating neural sensors...' 
          };
      }
  }

  private drawBar(percent: number, width: number): string {
      const p = Math.max(0, Math.min(100, percent));
      const filled = Math.round((p / 100) * width);
      return '[' + chalk.green('='.repeat(filled)) + chalk.gray('-'.repeat(Math.max(0, width - filled))) + ']';
  }

  private async typewriter(text: string, speed: number = 30) {
    for (const char of text) {
      process.stdout.write(char);
      await this.delay(speed);
    }
    process.stdout.write('\n');
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

