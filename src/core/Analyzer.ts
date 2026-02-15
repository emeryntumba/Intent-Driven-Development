import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface ProjectInfo {
  framework: 'LARAVEL' | 'REACT' | 'NEXT' | 'VUE' | 'NEST' | 'EXPRESS' | 'DJANGO' | 'UNKNOWN';
  language: 'PHP' | 'JS' | 'TS' | 'PYTHON';
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
    
    let framework: ProjectInfo['framework'] = 'UNKNOWN';
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
        framework = 'LARAVEL';
        language = 'PHP';
      }
    }

    if (files.includes('package.json')) {
      const pkg = JSON.parse(fs.readFileSync(path.join(this.root, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps['next']) framework = 'NEXT';
      else if (deps['react']) framework = 'REACT';
      else if (deps['vue']) framework = 'VUE';
      else if (deps['@nestjs/core']) framework = 'NEST';
      else if (deps['express']) framework = 'EXPRESS';

      if (files.includes('tsconfig.json')) language = 'TS';
    }

    if (files.includes('manage.py')) {
        framework = 'DJANGO';
        language = 'PYTHON';
    }

    // Structure Detection
    const structure = {
      hasControllers: this.exists('app/Http/Controllers') || this.exists('src/controllers') || this.exists('controllers'),
      hasComponents: this.exists('src/components') || this.exists('components'),
      hasModels: this.exists('app/Models') || this.exists('src/models') || this.exists('models'),
      hasRoutes: this.exists('routes') || this.exists('src/routes'),
      routesPath: this.findPath(['routes/api.php', 'routes/web.php', 'src/routes.ts', 'src/app.ts'])
    };

    return { framework, language, packageManager, root: this.root, structure };
  }

  private exists(p: string): boolean {
    return fs.existsSync(path.join(this.root, p));
  }

  private findPath(candidates: string[]): string | undefined {
    return candidates.find(p => fs.existsSync(path.join(this.root, p)));
  }

  public async scanFiles(): Promise<string[]> {
    // Naive scan for now
    const ignore = ['node_modules/**', 'vendor/**', 'dist/**', '.git/**'];
    return glob('**/*', { cwd: this.root, ignore });
  }
}
