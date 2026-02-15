import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface ProjectInfo {
  framework: string; // Primary or combined display string
  frameworks: string[]; // List of all detected frameworks
  language: 'PHP' | 'JS' | 'TS' | 'PYTHON' | 'MULTI';
  packageManager: 'NPM' | 'YARN' | 'PNPM' | 'COMPOSER' | 'PIP' | 'UNKNOWN';
  root: string;
  structure: {
    hasControllers: boolean;
    hasComponents: boolean;
    hasModels: boolean;
    hasRoutes: boolean;
    routesPath?: string;
  };
}

export class Analyzer {
  private root: string;

  constructor(root: string = process.cwd()) {
    this.root = root;
  }

  public analyze(): ProjectInfo {
    const files = fs.readdirSync(this.root);
    
    const frameworks: string[] = [];
    let language: ProjectInfo['language'] = 'JS';
    let packageManager: ProjectInfo['packageManager'] = 'UNKNOWN';

    // Package Manager Detection
    if (files.includes('composer.json')) packageManager = 'COMPOSER';
    if (files.includes('yarn.lock')) packageManager = 'YARN';
    if (files.includes('pnpm-lock.yaml')) packageManager = 'PNPM';
    if (files.includes('package-lock.json')) packageManager = 'NPM';
    if (files.includes('requirements.txt') || files.includes('Pipfile')) packageManager = 'PIP';

    // Framework & Language Detection
    if (files.includes('composer.json')) {
      const composer = JSON.parse(fs.readFileSync(path.join(this.root, 'composer.json'), 'utf-8'));
      if (composer.require?.['laravel/framework']) {
        frameworks.push('LARAVEL');
        language = 'PHP';
      }
    }

    if (files.includes('package.json')) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(this.root, 'package.json'), 'utf-8'));
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        
        if (deps['next']) frameworks.push('NEXT.JS');
        if (deps['react']) {
           if (!frameworks.includes('NEXT.JS')) frameworks.push('REACT');
        }
        if (deps['vue']) frameworks.push('VUE');
        if (deps['@nestjs/core']) frameworks.push('NEST');
        if (deps['express']) frameworks.push('EXPRESS');
        
        if (files.includes('tsconfig.json')) {
            language = language === 'PHP' ? 'MULTI' : 'TS';
        }
      } catch (e) {
          // Ignore bad package.json
      }
    }

    // Python Framework Detection
    if (files.includes('requirements.txt')) {
        const reqs = fs.readFileSync(path.join(this.root, 'requirements.txt'), 'utf-8');
        if (reqs.includes('Django')) frameworks.push('DJANGO');
        if (reqs.includes('flask')) frameworks.push('FLASK');
        if (reqs.includes('fastapi')) frameworks.push('FASTAPI');
        language = 'PYTHON';
    }
    if (files.includes('manage.py')) {
        if (!frameworks.includes('DJANGO')) frameworks.push('DJANGO');
        language = 'PYTHON';
    }

    // Determine primary framework string
    const framework = frameworks.length > 0 ? frameworks.join(' + ') : 'UNKNOWN';

    // Structure Detection
    const structure = {
      hasControllers: this.exists('app/Http/Controllers') || this.exists('src/controllers') || this.exists('controllers'),
      hasComponents: this.exists('src/components') || this.exists('components'),
      hasModels: this.exists('app/Models') || this.exists('src/models') || this.exists('models'),
      hasRoutes: this.exists('routes') || this.exists('src/routes'),
      routesPath: this.findPath(['routes/api.php', 'routes/web.php', 'src/routes.ts', 'src/app.ts'])
    };

    return { framework, frameworks, language, packageManager, root: this.root, structure };
  }

  private exists(p: string): boolean {
    return fs.existsSync(path.join(this.root, p));
  }

  private findPath(candidates: string[]): string | undefined {
    return candidates.find(p => fs.existsSync(path.join(this.root, p)));
  }

  public async scanFiles(): Promise<string[]> {
    // Optimized scan ignoring heavy folders
    const ignore = ['**/node_modules/**', '**/vendor/**', '**/dist/**', '**/.git/**', '**/build/**'];
    return glob('**/*', { cwd: this.root, ignore, dot: false });
  }
}
