import type { Intent } from '../types/index.ts';

export class Impact {
  public static calculate(intent: Intent, files: string[]): { files: string[], modules: string[] } {
    const impactedFiles: string[] = [];
    const lower = intent.original.toLowerCase();

    // Naive matching
    if (lower.includes('user') || lower.includes('auth')) {
      impactedFiles.push('app/Models/User.php');
      impactedFiles.push('routes/api.php');
      impactedFiles.push('database/migrations');
    }

    if (lower.includes('order')) {
      impactedFiles.push('app/Models/Order.php');
      impactedFiles.push('app/Http/Controllers/OrderController.php');
    }

    return {
      files: impactedFiles,
      modules: impactedFiles.map(f => f.split('/')[1] || 'Core').filter((v, i, a) => a.indexOf(v) === i)
    };
  }
}
