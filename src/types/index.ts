export interface AppSettings {
  savePath: string;
  logsFontSize: number;
  enableNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
}

export interface DownloadOptions {
  type: 'url' | 'file';
  url: string;
  file: string;
  audioOnly: boolean;
  saveTo: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface Note {
  id: string;
  flags: string;
  description: string;
}

export interface TempNote extends Note {
  isMarkedForDeletion?: boolean;
}