import { create } from 'zustand';
import type { Track, RepeatMode } from '../types/music';
import { loadState, saveState } from '../utils/storage';

interface PlayerStore {
  // Playlist
  tracks: Track[];
  addTracks: (tracks: Track[]) => void;
  removeTrack: (id: string) => void;
  clearPlaylist: () => void;

  // Playback
  currentTrackId: string | undefined;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hasError: boolean;
  play: (id?: string) => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  setError: (e: boolean) => void;

  // Navigation
  next: () => void;
  prev: () => void;

  // Queue
  queue: string[];
  playNext: (id: string) => void;
  addToQueue: (id: string) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // Stats
  favorites: string[];
  playHistory: string[];
  playCounts: Record<string, number>;
  dailySeconds: Record<string, number>; // YYYY-MM-DD -> seconds
  trackMoods: Record<string, string[]>; // Track ID -> array of mood IDs
  seekRequest: number | null;
  toggleFavorite: (id: string) => void;
  recordPlay: (id: string) => void;
  addListenTime: (seconds: number) => void;
  toggleMood: (id: string, mood: string) => void;

  setSeekRequest: (time: number) => void;
  clearSeekRequest: () => void;

  // UI State
  isDiaryOpen: boolean;
  toggleDiary: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;

  // Settings
  settings: {
    reduceMotion: boolean;
    autoplayNext: boolean;
    defaultVolume: number;
  };
  updateSettings: (newSettings: Partial<PlayerStore['settings']>) => void;

  // Volume
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;

  // Modes
  shuffle: boolean;
  toggleShuffle: () => void;
  repeatMode: RepeatMode;
  cycleRepeat: () => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;

  // Persistence
  persist: () => void;
}

const stored = loadState();

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  tracks: [],
  queue: [],
  currentTrackId: undefined,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  hasError: false,
  volume: stored?.volume ?? 0.8,
  isMuted: stored?.isMuted ?? false,
  shuffle: stored?.shuffle ?? false,
  repeatMode: (stored?.repeatMode as RepeatMode) ?? 'off',
  toast: null,
  favorites: stored?.favorites ?? [],
  playHistory: stored?.playHistory ?? [],
  playCounts: stored?.playCounts ?? {},
  dailySeconds: stored?.dailySeconds ?? {},
  trackMoods: stored?.trackMoods ?? {},
  seekRequest: null,

  isDiaryOpen: false,
  toggleDiary: () => set((s) => ({ isDiaryOpen: !s.isDiaryOpen })),
  
  isSettingsOpen: false,
  toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),

  settings: stored?.settings ?? {
    reduceMotion: false,
    autoplayNext: true,
    defaultVolume: 0.8,
  },
  updateSettings: (newSettings) => {
    set((s) => {
      const updated = { ...s.settings, ...newSettings };
      if (newSettings.reduceMotion !== undefined) {
        document.body.dataset.reduceMotion = String(newSettings.reduceMotion);
      }
      return { settings: updated };
    });
    get().persist();
  },

  addTracks: (newTracks) => {
    set((s) => {
      const existing = new Set(s.tracks.map((t) => t.fileName));
      const unique = newTracks.filter((t) => !existing.has(t.fileName));
      return { tracks: [...s.tracks, ...unique] };
    });
    get().persist();
  },

  removeTrack: (id) => {
    set((s) => {
      const track = s.tracks.find((t) => t.id === id);
      if (track?.objectUrl) URL.revokeObjectURL(track.objectUrl);
      const tracks = s.tracks.filter((t) => t.id !== id);
      const update: Partial<PlayerStore> = { tracks };
      if (s.currentTrackId === id) {
        update.currentTrackId = undefined;
        update.isPlaying = false;
        update.currentTime = 0;
        update.duration = 0;
      }
      return update;
    });
    get().persist();
  },

  clearPlaylist: () => {
    set((s) => {
      s.tracks.forEach((t) => {
        if (t.objectUrl) URL.revokeObjectURL(t.objectUrl);
      });
      return {
        tracks: [],
        currentTrackId: undefined,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      };
    });
    get().persist();
  },

  play: (id) => {
    const targetId = id ?? get().currentTrackId;
    if (targetId) {
      get().recordPlay(targetId);
    }
    set({
      currentTrackId: targetId,
      isPlaying: true,
      hasError: false,
    });
  },

  pause: () => set({ isPlaying: false }),

  togglePlay: () => {
    const { isPlaying, currentTrackId, tracks } = get();
    if (!currentTrackId && tracks.length > 0) {
      set({ currentTrackId: tracks[0].id, isPlaying: true, hasError: false });
    } else {
      set({ isPlaying: !isPlaying });
    }
  },

  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  setError: (e) => set({ hasError: e }),

  next: () => {
    const { tracks, currentTrackId, shuffle, repeatMode, queue } = get();
    if (tracks.length === 0) return;

    if (queue.length > 0) {
      const nextId = queue[0];
      set({
        queue: queue.slice(1),
        currentTrackId: nextId,
        currentTime: 0,
        isPlaying: true,
        hasError: false
      });
      return;
    }

    if (repeatMode === 'one') {
      set({ currentTime: 0, isPlaying: true, hasError: false });
      return;
    }

    const idx = tracks.findIndex((t) => t.id === currentTrackId);

    if (shuffle) {
      const pool = tracks.filter((t) => t.id !== currentTrackId);
      if (pool.length === 0) return;
      const rand = pool[Math.floor(Math.random() * pool.length)];
      set({ currentTrackId: rand.id, currentTime: 0, isPlaying: true, hasError: false });
      return;
    }

    const nextIdx = idx + 1;
    if (nextIdx < tracks.length) {
      set({ currentTrackId: tracks[nextIdx].id, currentTime: 0, isPlaying: true, hasError: false });
    } else if (repeatMode === 'all') {
      set({ currentTrackId: tracks[0].id, currentTime: 0, isPlaying: true, hasError: false });
    } else {
      set({ isPlaying: false });
    }
  },

  prev: () => {
    const { tracks, currentTrackId, currentTime } = get();
    if (tracks.length === 0) return;

    // If past 3 seconds, restart current track
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    const idx = tracks.findIndex((t) => t.id === currentTrackId);
    const prevIdx = idx - 1;
    if (prevIdx >= 0) {
      set({ currentTrackId: tracks[prevIdx].id, currentTime: 0, isPlaying: true, hasError: false });
    } else {
      set({ currentTime: 0 });
    }
  },

  playNext: (id) => {
    set((s) => ({ queue: [id, ...s.queue] }));
  },

  addToQueue: (id) => {
    set((s) => ({ queue: [...s.queue, id] }));
  },

  removeFromQueue: (index) => {
    set((s) => {
      const newQueue = [...s.queue];
      newQueue.splice(index, 1);
      return { queue: newQueue };
    });
  },

  clearQueue: () => set({ queue: [] }),

  toggleFavorite: (id) => {
    set((s) => {
      const favorites = s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id];
      return { favorites };
    });
    get().persist();
  },

  toggleMood: (id, mood) => {
    set((s) => {
      const currentMoods = s.trackMoods[id] || [];
      let newMoods = currentMoods.includes(mood)
        ? currentMoods.filter(m => m !== mood)
        : [...currentMoods, mood];
      
      // Enforce max 2 moods (1 Primary, 1 Secondary)
      if (newMoods.length > 2) {
        newMoods = newMoods.slice(newMoods.length - 2);
      }
      
      return {
        trackMoods: {
          ...s.trackMoods,
          [id]: newMoods,
        }
      };
    });
    get().persist();
  },

  setSeekRequest: (time: number) => set({ seekRequest: time }),
  clearSeekRequest: () => set({ seekRequest: null }),

  recordPlay: (id) => {
    set((s) => {
      const playHistory = [id, ...s.playHistory.filter((h) => h !== id)].slice(0, 50);
      const playCounts = { ...s.playCounts, [id]: (s.playCounts[id] || 0) + 1 };
      return { playHistory, playCounts };
    });
    get().persist();
  },

  addListenTime: (seconds) => {
    set((s) => {
      const today = new Date().toISOString().split('T')[0];
      const current = s.dailySeconds[today] || 0;
      return {
        dailySeconds: {
          ...s.dailySeconds,
          [today]: current + seconds,
        },
      };
    });
    // We only persist every 10 seconds or so to avoid spamming localStorage,
    // but doing it here might be too frequent if called every second.
    // Instead, the caller will be responsible for calling persist() periodically, or we persist here anyway.
    // Let's persist here but rely on the caller to not call this every single second if possible.
    // Actually, calling localStorage.setItem every 5 seconds is perfectly fine.
    get().persist();
  },

  setVolume: (v) => {
    set({ volume: v, isMuted: false });
    get().persist();
  },

  toggleMute: () => {
    set((s) => ({ isMuted: !s.isMuted }));
    get().persist();
  },

  toggleShuffle: () => {
    set((s) => ({ shuffle: !s.shuffle }));
    get().persist();
  },

  cycleRepeat: () => {
    set((s) => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const idx = modes.indexOf(s.repeatMode);
      return { repeatMode: modes[(idx + 1) % modes.length] };
    });
    get().persist();
  },

  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => get().clearToast(), 3000);
  },

  clearToast: () => set({ toast: null }),

  persist: () => {
    const { tracks, volume, isMuted, shuffle, repeatMode, favorites, playHistory, playCounts, dailySeconds, trackMoods } = get();
    saveState({
      playlist: tracks.map((t) => ({
        id: t.id,
        fileName: t.fileName,
        title: t.title,
        artist: t.artist,
        extension: t.extension,
        addedAt: t.addedAt,
        duration: t.duration,
      })),
      volume,
      isMuted,
      shuffle,
      repeatMode,
      favorites,
      playHistory,
      playCounts,
      dailySeconds,
      trackMoods,
      settings: get().settings,
    });
  },
}));

// Cross-tab synchronization for the Stream Widget
const bc = new BroadcastChannel('mochi_player');

usePlayerStore.subscribe((state, prevState) => {
  if (
    state.isPlaying !== prevState.isPlaying ||
    state.currentTrackId !== prevState.currentTrackId ||
    state.tracks !== prevState.tracks
  ) {
    const currentTrack = state.tracks.find((t) => t.id === state.currentTrackId);
    
    // We send a minimal payload to avoid cloning issues with large objects
    bc.postMessage({
      type: 'STATE_UPDATE',
      payload: {
        isPlaying: state.isPlaying,
        track: currentTrack ? {
          title: currentTrack.title,
          artist: currentTrack.artist,
          coverArt: currentTrack.coverArt,
        } : undefined,
      }
    });
  }
});

// Listen for widgets requesting initial state
bc.onmessage = (event) => {
  if (event.data?.type === 'REQUEST_STATE') {
    const state = usePlayerStore.getState();
    const currentTrack = state.tracks.find((t) => t.id === state.currentTrackId);
    bc.postMessage({
      type: 'STATE_UPDATE',
      payload: {
        isPlaying: state.isPlaying,
        track: currentTrack ? {
          title: currentTrack.title,
          artist: currentTrack.artist,
          coverArt: currentTrack.coverArt,
        } : undefined,
      }
    });
  }
};
