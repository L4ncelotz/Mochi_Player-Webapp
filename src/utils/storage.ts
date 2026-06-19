const STORAGE_KEY = 'mochi-player';

export interface StoredTrack {
  id: string;
  fileName?: string;
  title: string;
  artist?: string;
  extension: string;
  addedAt?: string;
  duration?: number;
}

interface StoredData {
  playlist: StoredTrack[];
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeatMode: string;
  favorites?: string[];
  playHistory?: string[];
  playCounts?: Record<string, number>;
  dailySeconds?: Record<string, number>;
  trackMoods?: Record<string, string[]>;
}

export function loadState(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredData;
  } catch {
    return null;
  }
}

export function saveState(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — ignore silently
  }
}
