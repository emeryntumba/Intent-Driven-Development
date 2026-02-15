import { execa } from 'execa';
import type { Intent, Task } from '../types/index.ts';
import type { ProjectInfo } from './Analyzer.ts';
import chalk from 'chalk';

/*
 * This module integrates GitHub Copilot CLI for AI reasoning.
 * Falls back to simulation if the CLI is not configured.
 */

export class Brain {
  /**
   * Calls the local GitHub Copilot CLI to generate an explanation.
   * Uses `gh copilot explain` for context.
   */
  public async ask(prompt: string, context?: string): Promise<string> {
    try {
      // Trying to execute the official GitHub CLI extension
      // We use a timeout to avoid hanging if it waits for input
      const { stdout } = await execa('gh', ['copilot', 'explain', prompt], {
        timeout: 8000,
        reject: false
      });

      if (!stdout || stdout.includes('Error') || stdout.trim().length === 0) {
        throw new Error('Copilot CLI returned empty or error');
      }

      return stdout;
    } catch (err) {
      // console.error(chalk.yellow("⚠️ Copilot CLI not available, switching to simulation."));
      return this.simulate(prompt, context);
    }
  }

  /**
   * Credible simulation for the hackathon demo (no API key needed)
   * ADAPTS TO THE PROJECT CONTEXT (Semantic Simulation)
   */
  private simulate(prompt: string, contextString: string = 'Generic'): string {
    const isLaravel = contextString.includes('LARAVEL');
    const isReact = JSON.stringify(contextString).includes('REACT') || contextString.includes('NEXT') || contextString.includes('JS');
    const isPython = contextString.includes('PYTHON') || contextString.includes('DJANGO');

    // Rule-Based Knowledge Base for "Essential Rules" Request
    if (prompt.toLowerCase().includes('regles') || prompt.toLowerCase().includes('rules')) {
        let rules = `### Essential Project Rules & Best Practices:\n\n`;
        
        if (isLaravel) {
            rules += `**Laravel (PHP)**:\n- Use **FormRequests** for complex validation.\n- Keep Controllers thin: move logic to **Actions** or **Services**.\n- Use **Eloquent Resources** for structured API responses.\n- Enforce code style with **Laravel Pint**.\n\n`;
        }
        
        if (isReact) {
            rules += `**React / Next.js**:\n- Prefer **Functional Components** & Hooks.\n- Use **Server Components** by default in Next.js (App Router).\n- Enforce strict type checking with **TypeScript**.\n- Configure **ESLint** + **Prettier** for consistency.\n- Structure pattern: /components/ui (atomic), /features (domain logic).\n\n`;
        }
        
        if (isPython) {
            rules += `**Python**:\n- Follow **PEP8** style guide (auto-format with **Black** or **Ruff**).\n- Always use **Virtual Environments** (venv/poetry).\n- Enforce type hinting with **MyPy**.\n- Include docstrings (Google style).\n\n`;
        }

        return rules + `I have analyzed the project structure and suggest applying these patterns. Checking configured linters...`;
    }

    if (prompt.includes('reset password') || prompt.includes('auth')) {
        if (isLaravel) {
            return `To implement "${prompt}" in Laravel:
1. Update **User** model (use StartPasswordReset trait).
2. Generate Notification: \`php artisan make:notification ResetPassword\`.
3. Create controller: \`php artisan make:controller Auth/ResetPasswordController\`.`;
        }
        if (isReact) {
             return `To implement "${prompt}" in React/Next.js:
1. Create a **ResetPassword** page/component with a form.
2. Integrate with your Auth provider (Firebase/Auth0/NextAuth).
3. Handle API calls to request reset link.`;
        }
    }
    
    if (prompt.includes('newsletter') || prompt.includes('form')) {
        if (isLaravel) {
            return `This feature requires:
1. **Migration**: 'newsletter_subscribers'.
2. **Model**: Subscriber.
3. **Controller**: NewsletterController@store.
4. **Queue**: Configure Redis/Database driver for email dispatch during demo.`;
        }
    }

    // Fallback generic
    return `Analysis for "${prompt}" in ${contextString} environment:
It appears to be a ${prompt.includes('fix') ? 'Bugfix' : 'Feature'} request.
I recommend isolating the domain logic and writing tests first.`;
  }

  public async generateExplanation(intent: Intent, info: ProjectInfo): Promise<string> {
    const contextStr = `${info.framework} (${info.language})`;
    return this.ask(intent.original, contextStr);
  }

  public async generateCommitMessage(intent: Intent): Promise<string> {
    // Simulate AI generation for clear, conventional commits
    const verbs = ['feat', 'fix', 'refactor', 'docs', 'style'];
    const type = verbs.find(v => intent.original.toLowerCase().startsWith(v)) || 'feat';
    
    // Simulate rephrasing for clarity
    const cleanMsg = intent.original
        .replace(/^feat:|^fix:|^refactor:/, '')
        .trim();
        
    return `${type}: ${cleanMsg}`;
  }

  public narrateCommit(message: string, author: string, type: string): string {
    // Clean Git conventional prefix
    let content = message.replace(/^(feat|fix|chore|docs|refactor|style|test)(\(.*\))?:/, '').trim();
    
    // Natural Language Generation (Simulated)
    const vars = { author, content };
    
    // Basic template engine
    const t = (str: string) => str.replace(/\${(.*?)}/g, (_, k) => vars[k as keyof typeof vars] || '');

    if (type === 'feat') {
       const templates = [
           "${author} shipped a new feature: ${content}",
           "${author} implemented ${content}",
           "The project grew as ${author} added ${content}"
       ];
       return t(templates[Math.floor(Math.random() * templates.length)]);
    }
    if (type === 'fix') {
       return t("${author} fixed a problem: ${content}");
    }
    if (type === 'chore') {
       return t("${author} performed maintenance: ${content}");
    }
    if (type === 'docs') {
       return t("${author} documented ${content}");
    }
    
    return `${author} worked on ${content}`; 
  }

  public async generateSmartTasks(intent: Intent, info: ProjectInfo): Promise<Task[]> {
    // For tasks, we still use a heuristic/simulation mix 
    // because parsing CLI text output into JSON tasks is unstable.
    
    await new Promise(r => setTimeout(r, 1500)); // Thinking delay
    const tasks: Task[] = [];
    let id = 1;

    // AI logic simulation
    const original = intent.original.toLowerCase();
    
    if (info.frameworks.includes('LARAVEL')) {
        tasks.push({
            id: `AI-${id++}`,
            description: 'Draft Database Migration',
            status: 'TODO',
            type: 'SHELL',
            command: `php artisan make:migration create_feature_table`
        });
    } 
    
    if (info.frameworks.includes('NEXT') || info.frameworks.includes('REACT')) {
         tasks.push({
            id: `AI-${id++}`,
            description: 'Create Container Component',
            status: 'TODO',
            type: 'CREATE_FILE',
            file: `src/components/Feature/Container.tsx`,
            content: `import React from 'react';

export const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">
    {children}
  </div>
);`
        });
    }
    
    return tasks;
  }
}
