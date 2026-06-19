export type TrackSource = 'local';

export interface Track {
  id: string;
  source: TrackSource;
  fileName: string;
  objectUrl?: string;
  title: string;
  artist?: string;
  coverArt?: string; // data URL from ID3 tag
  duration?: number;
  extension: 'mp3' | 'mp4' | 'm4a' | 'wav';
  addedAt: string;
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface PlayerState {
  currentTrackId?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
}
