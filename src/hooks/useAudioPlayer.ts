import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../stores/playerStore';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    tracks,
    currentTrackId,
    isPlaying,
    volume,
    setCurrentTime,
    setDuration,
    next,
    pause,
  } = usePlayerStore();

  const currentTrack = tracks.find((t) => t.id === currentTrackId);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Load track when currentTrackId changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack?.objectUrl) {
      audio.src = '';
      setDuration(0);
      setCurrentTime(0);
      return;
    }

    audio.src = currentTrack.objectUrl;
    audio.load();
  }, [currentTrack?.objectUrl, currentTrack?.id, setDuration, setCurrentTime]);

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackId, pause]);

  // Volume & Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = usePlayerStore.getState().isMuted;
    }
  }, [volume, usePlayerStore((s) => s.isMuted)]);

  // Time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => next();
    const onError = () => {
      pause();
      usePlayerStore.getState().showToast('Cannot play this file');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [setCurrentTime, setDuration, next, pause]);

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return { audioRef, seek, currentTrack };
}
