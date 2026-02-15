import { Intent } from '../types/index.ts';

export class GitPlanner {
  public static generateBranchName(intent: Intent): string {
    const typePrefix = intent.type.toLowerCase();
    const cleanName = intent.original
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '')      // Trim hyphens
      .substring(0, 50);            // Truncate
    
    return `${typePrefix}/${cleanName}`;
  }

  public static generateCommitMessage(intent: Intent): string {
    return `feat: implement logic for "${intent.original}"`;
  }
}
