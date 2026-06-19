import { Play, Pause, X } from 'lucide-react';
import { memo } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import type { Track } from '../types/music';
import { formatTime } from '../utils/time';
import styles from './TrackRow.module.css';

interface Props {
  track: Track;
  index: number;
}

export const TrackRow = memo(function TrackRow({ track, index }: Props) {
  const { currentTrackId, isPlaying, play, pause, removeTrack } = usePlayerStore();
  const isCurrent = currentTrackId === track.id;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent && isPlaying) {
      pause();
    } else {
      play(track.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTrack(track.id);
  };

  return (
    <div
      className={`${styles.row} ${isCurrent ? styles.active : ''}`}
      onClick={() => play(track.id)}
      style={{ '--index': index } as React.CSSProperties}
      id={`track-row-${track.id}`}
    >
      <div className={styles.playState} onClick={handlePlayPause}>
        {isCurrent && isPlaying ? (
          <Pause size={16} className={styles.iconActive} />
        ) : (
          <Play size={16} className={isCurrent ? styles.iconActive : styles.iconIdle} />
        )}
      </div>

      <div className={styles.info}>
        <div className={`${styles.trackTitle} ${isCurrent ? styles.activeTitle : ''}`}>
          {track.title}
        </div>
        {track.artist && <div className={styles.trackArtist}>{track.artist}</div>}
      </div>
      
      <span className={styles.badge}>{track.extension}</span>
      
      {track.duration != null && (
        <span className={styles.duration}>{formatTime(track.duration)}</span>
      )}
      
      <button
        className={styles.removeBtn}
        onClick={handleRemove}
        title="Remove"
        id={`remove-track-${track.id}`}
      >
        <X size={14} />
      </button>
    </div>
  );
});
