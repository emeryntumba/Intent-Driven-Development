import type { Intent, Task } from '../types/index.ts';
import type { ProjectInfo } from './Analyzer.ts';

export class Roadmap {
  public static generate(intent: Intent, info: ProjectInfo): Task[] {
    const tasks: Task[] = [];
    let idCounter = 1;
    const lower = intent.original.toLowerCase();

    // 1. Requirement Analysis (Always needed)
    tasks.push({
        id: `T${idCounter++}`,
        description: 'Analyze requirements & Design data structure',
        status: 'TODO'
    });

    // 2. Framework Specific Logic
    if (info.framework === 'LARAVEL') {
        if (lower.includes('user') || lower.includes('auth') || lower.includes('register')) {
            tasks.push({
                id: `T${idCounter++}`,
                description: 'Create Migration',
                status: 'TODO',
                file: 'database/migrations/',
                command: 'php artisan make:migration'
            });
            tasks.push({
                id: `T${idCounter++}`,
                description: 'Update Model',
                status: 'TODO',
                file: 'app/Models/'
            });
        }
        if (lower.includes('api') || lower.includes('endpoint')) {
             tasks.push({
                id: `T${idCounter++}`,
                description: 'Create API Controller',
                status: 'TODO',
                command: 'php artisan make:controller <Name>Controller --api'
             });
        }
    } 
    
    else if (info.framework === 'REACT' || info.framework === 'NEXT' || info.framework === 'VUE') {
         if (lower.includes('page') || lower.includes('screen') || lower.includes('view')) {
             tasks.push({
                id: `T${idCounter++}`,
                description: `Create ${info.framework} Page`,
                status: 'TODO',
                file: info.framework === 'NEXT' ? 'app/page.tsx' : 'src/pages/'
             });
         }
         if (lower.includes('component') || lower.includes('button') || lower.includes('form')) {
             tasks.push({
                id: `T${idCounter++}`,
                description: 'Create UI Component',
                status: 'TODO',
                file: 'src/components/'
             });
         }
         if (lower.includes('state') || lower.includes('store') || lower.includes('redux')) {
             tasks.push({
                id: `T${idCounter++}`,
                description: 'Setup State Management',
                status: 'TODO',
                file: 'src/store/'
             });
         }
    } 
    
    else if (info.framework === 'NEST') {
        tasks.push({
            id: `T${idCounter++}`,
            description: 'Generate Module',
            status: 'TODO',
            command: 'nest g module <name>'
        });
        tasks.push({
            id: `T${idCounter++}`,
            description: 'Generate Controller',
            status: 'TODO',
            command: 'nest g controller <name>'
        });
    }

    else {
        // Generic / Node / Python
        tasks.push({
             id: `T${idCounter++}`,
             description: 'Implement Core Logic',
             status: 'TODO',
             file: 'src/main'
        });
        tasks.push({
             id: `T${idCounter++}`,
             description: 'Add Unit Tests',
             status: 'TODO',
             file: 'tests/'
        });
    }

    return tasks;
  }
}
