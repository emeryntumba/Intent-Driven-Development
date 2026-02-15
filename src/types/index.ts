export interface Intent {
  id: string;
  original: string;
  status: 'PENDING' | 'ANALYZED' | 'PLANNED' | 'COMPLETED';
  type: 'FEATURE' | 'REFACTOR' | 'BUGFIX' | 'UNKNOWN';
  impact?: {
    files: string[];
    modules: string[];
  };
  tasks?: Task[];
  createdAt: string;
}

export interface Task {
  id: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  file?: string;
  command?: string;
}

export interface ProjectMemory {
  projectRoot: string;
  intents: Intent[];
  scannedFiles: string[];
  lastScan: string | null;
}
