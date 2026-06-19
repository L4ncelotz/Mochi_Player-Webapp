import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';

export function useMediaSession() {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    // Set action handlers
    navigator.mediaSession.setActionHandler('play', () => {
      usePlayerStore.getState().togglePlay(true);
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      usePlayerStore.getState().togglePlay(false);
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      usePlayerStore.getState().prev();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      usePlayerStore.getState().next();
    });

    // Cleanup
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, []);

  // Subscribe to store to update metadata
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const unsubscribe = usePlayerStore.subscribe((state, prevState) => {
      // If track changed or play state changed, update metadata
      if (
        state.currentTrackId !== prevState.currentTrackId ||
        state.isPlaying !== prevState.isPlaying
      ) {
        const track = state.tracks.find((t) => t.id === state.currentTrackId);
        
        if (track) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title || 'Unknown Title',
            artist: track.artist || 'Unknown Artist',
            album: 'Mochi Player',
            artwork: track.coverArt
              ? [{ src: track.coverArt, sizes: '512x512', type: 'image/jpeg' }]
              : [],
          });
        } else {
          navigator.mediaSession.metadata = null;
        }

        navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';
      }
    });

    return unsubscribe;
  }, []);
}
