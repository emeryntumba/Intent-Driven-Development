import type { Intent, Task } from '../types/index.ts';

export class Roadmap {
  public static generate(intent: Intent): Task[] {
    const tasks: Task[] = [];
    let idCounter = 1;

    // Basic heuristic based on keywords
    if (intent.original.toLowerCase().includes('user') || intent.original.toLowerCase().includes('auth')) {
      tasks.push({
        id: `T${idCounter++}`,
        description: 'Create/Update User Migration',
        status: 'TODO',
        file: 'database/migrations/create_users_table.php',
        command: 'php artisan make:migration create_users_table'
      });
      tasks.push({
        id: `T${idCounter++}`,
        description: 'Update User Model fillables',
        status: 'TODO',
        file: 'app/Models/User.php'
      });
      tasks.push({
        id: `T${idCounter++}`,
        description: 'Create Auth Controller logic',
        status: 'TODO',
        file: 'app/Http/Controllers/AuthController.php'
      });
    }

    if (intent.type === 'FEATURE' && tasks.length === 0) {
      tasks.push({
        id: `T${idCounter++}`,
        description: 'Analyze requirements',
        status: 'TODO'
      });
      tasks.push({
        id: `T${idCounter++}`,
        description: 'Draft API endpoint',
        status: 'TODO',
        file: 'routes/api.php'
      });
    }

    return tasks;
  }
}
