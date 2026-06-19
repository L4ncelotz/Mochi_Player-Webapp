export type TrackSource = 'local' | 'youtube';

export interface Track {
  id: string;
  source?: TrackSource;
  fileName?: string; // Optional for YT
  objectUrl: string; // URL for playback
  title: string;
  artist?: string;
  coverArt?: string; // URL to blob or remote image
  duration?: number; // in seconds
  extension: string; // File extension or 'YT'
  addedAt?: string;
  file?: File | null; // null for online sources
}

export type RepeatMode = 'off' | 'one' | 'all';
