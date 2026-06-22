import { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { usePlayerStore } from '../stores/playerStore';

export function GlobalPlayer() {
  const playerRef = useRef<any>(null);
  const [hasError, setHasError] = useState(false);
  
  const {
    tracks,
    currentTrackId,
    isPlaying,
    volume,
    isMuted,
    setDuration,
    setCurrentTime,
    next,
    pause,
    settings
  } = usePlayerStore();

  const currentTrack = tracks.find(t => t.id === currentTrackId);

  useEffect(() => {
    setHasError(false);
  }, [currentTrackId]);

  useEffect(() => {
    if (!isPlaying || hasError) return;

    let lastTick = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.round((now - lastTick) / 1000);
      if (diff > 0) {
        usePlayerStore.getState().addListenTime(diff);
        lastTick = now;
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      const now = Date.now();
      const diff = Math.round((now - lastTick) / 1000);
      if (diff > 0) {
        usePlayerStore.getState().addListenTime(diff);
      }
    };
  }, [isPlaying, hasError]);

  useEffect(() => {
    const unsub = usePlayerStore.subscribe(
      (state) => {
        if (state.seekRequest !== null && playerRef.current) {
          playerRef.current.seekTo(state.seekRequest, 'seconds');
          usePlayerStore.getState().clearSeekRequest();
        }
      }
    );
    return unsub;
  }, []);

  if (!currentTrack || !currentTrack.objectUrl) {
    return null;
  }

  return (
    <ReactPlayer
      ref={playerRef}
      url={currentTrack.objectUrl}
      playing={isPlaying}
      volume={volume}
      muted={isMuted}
      {...({
        onProgress: (state: any) => setCurrentTime(state.playedSeconds),
        onDuration: (duration: number) => setDuration(duration),
        onEnded: () => {
          if (settings.autoplayNext) {
            next();
          } else {
            pause();
          }
        },
        onError: (e: any) => {
          console.error('Player error', e);
          setHasError(true);
          pause();
        }
      } as any)}
      width="0"
      height="0"
      style={{ display: 'none' }}
    />
  );
}
