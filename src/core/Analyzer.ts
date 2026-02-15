import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ProjectInfo {
  framework: 'LARAVEL' | 'REACT' | 'NODE' | 'UNKNOWN';
  language: 'PHP' | 'JS' | 'TS';
  root: string;
}

export class Analyzer {
  private root: string;

  constructor(root: string = process.cwd()) {
    this.root = root;
  }

  public analyze(): ProjectInfo {
    const hasComposer = fs.existsSync(path.join(this.root, 'composer.json'));
    const hasPackage = fs.existsSync(path.join(this.root, 'package.json'));
    
    let framework: ProjectInfo['framework'] = 'UNKNOWN';
    let language: ProjectInfo['language'] = 'JS';

    if (hasComposer) {
      const composer = JSON.parse(fs.readFileSync(path.join(this.root, 'composer.json'), 'utf-8'));
      if (composer.require?.['laravel/framework']) {
        framework = 'LARAVEL';
        language = 'PHP';
      }
    }

    if (hasPackage && framework === 'UNKNOWN') {
      const pkg = JSON.parse(fs.readFileSync(path.join(this.root, 'package.json'), 'utf-8'));
      if (pkg.dependencies?.['react']) {
        framework = 'REACT';
        language = 'JS'; // TS detection separate
      } else {
        framework = 'NODE';
      }

      if (fs.existsSync(path.join(this.root, 'tsconfig.json'))) {
        language = 'TS';
      }
    }

    return { framework, language, root: this.root };
  }

  public async scanFiles(): Promise<string[]> {
    // Naive scan for now
    const ignore = ['node_modules/**', 'vendor/**', 'dist/**', '.git/**'];
    return glob('**/*', { cwd: this.root, ignore });
  }
}
