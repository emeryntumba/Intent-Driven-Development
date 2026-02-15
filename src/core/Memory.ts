import fs from 'fs';
import path from 'path';
import type { ProjectMemory, Intent } from '../types/index.ts';

const DEFAULT_MEMORY: ProjectMemory = {
  projectRoot: process.cwd(),
  intents: [],
  scannedFiles: [],
  lastScan: null
};

export class Memory {
  private static instance: Memory;
  private memoryPath: string;
  private data: ProjectMemory;

  private constructor() {
    const intentDir = path.join(process.cwd(), '.intent');
    if (!fs.existsSync(intentDir)) {
      fs.mkdirSync(intentDir);
    }
    this.memoryPath = path.join(intentDir, 'memory.json');
    this.data = this.load();
  }

  public static getInstance(): Memory {
    if (!Memory.instance) {
      Memory.instance = new Memory();
    }
    return Memory.instance;
  }

  private load(): ProjectMemory {
    if (!fs.existsSync(this.memoryPath)) {
      this.save(DEFAULT_MEMORY);
      return DEFAULT_MEMORY;
    }
    try {
      const raw = fs.readFileSync(this.memoryPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load memory, resetting to default.');
      return DEFAULT_MEMORY;
    }
  }

  public save(data?: ProjectMemory): void {
    if (data) this.data = data;
    fs.writeFileSync(this.memoryPath, JSON.stringify(this.data, null, 2));
  }

  public getIntents(): Intent[] {
    return this.data.intents;
  }

  public addIntent(intent: Intent): void {
    this.data.intents.push(intent);
    this.save();
  }

  public updateIntent(id: string, partial: Partial<Intent>): void {
    const index = this.data.intents.findIndex(i => i.id === id);
    if (index !== -1) {
      this.data.intents[index] = { ...this.data.intents[index], ...partial };
      this.save();
    }
  }

  public getData(): ProjectMemory {
    return this.data;
  }
}
