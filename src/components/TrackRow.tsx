import type { Track } from '../types/music';
import { usePlayerStore } from '../stores/playerStore';
import { formatTime } from '../utils/time';
import styles from './TrackRow.module.css';

interface Props {
  track: Track;
  index: number;
}

export function TrackRow({ track, index }: Props) {
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const play = usePlayerStore((s) => s.play);
  const removeTrack = usePlayerStore((s) => s.removeTrack);

  const isActive = currentTrackId === track.id;

  return (
    <div
      className={`${styles.row} ${isActive ? styles.active : ''}`}
      style={{ '--index': index } as React.CSSProperties}
      onClick={() => play(track.id)}
      id={`track-row-${track.id}`}
    >
      <span className={styles.number}>
        {isActive && isPlaying ? (
          <div className={styles.visualizer}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        ) : (
          index + 1
        )}
      </span>
      <div className={styles.info}>
        <div className={`${styles.trackTitle} ${isActive ? styles.activeTitle : ''}`}>
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
        onClick={(e) => {
          e.stopPropagation();
          removeTrack(track.id);
        }}
        title="Remove"
        id={`remove-track-${track.id}`}
      >
        ✕
      </button>
    </div>
  );
}
