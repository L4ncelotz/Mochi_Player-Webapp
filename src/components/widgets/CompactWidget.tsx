import type { WidgetState } from './WidgetApp';
import styles from './Widget.module.css';

interface Props {
  state: WidgetState;
}

export function CompactWidget({ state }: Props) {
  const { track, isPlaying } = state;
  if (!track) return null;

  return (
    <div className={`${styles.glassPanel} ${styles.compact}`}>
      {track.coverArt ? (
        <img
          className={`${styles.compactArt} ${isPlaying ? styles.spin : ''}`}
          src={track.coverArt}
          alt="Album art"
        />
      ) : (
        <div className={`${styles.compactPlaceholder} ${isPlaying ? styles.pulse : ''}`}>🎵</div>
      )}
      
      <div className={styles.compactInfo}>
        <div className={styles.compactTitle}>{track.title}</div>
        {track.artist && <div className={styles.compactArtist}>{track.artist}</div>}
      </div>

      {isPlaying && (
        <div className={styles.visualizer}>
          <div className={styles.bar} />
          <div className={styles.bar} />
          <div className={styles.bar} />
        </div>
      )}
    </div>
  );
}
