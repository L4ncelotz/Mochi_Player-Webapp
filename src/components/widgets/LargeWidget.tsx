import { Music } from 'lucide-react';
import type { WidgetState } from './WidgetApp';
import styles from './Widget.module.css';

interface Props {
  state: WidgetState;
}

export function LargeWidget({ state }: Props) {
  const { track, isPlaying } = state;
  if (!track) return null;

  return (
    <div className={`${styles.glassPanel} ${styles.large}`}>
      {track.coverArt && (
        <div 
          className={styles.largeBg} 
          style={{ backgroundImage: `url(${track.coverArt})` }} 
        />
      )}
      
      <div className={`${styles.largeArtWrapper} ${isPlaying ? styles.pulse : ''}`}>
        {track.coverArt ? (
          <img
            className={styles.largeArt}
            src={track.coverArt}
            alt="Album art"
          />
        ) : (
          <div className={styles.largePlaceholder}>
            <Music size={48} />
          </div>
        )}
      </div>

      <div className={styles.largeInfoRow}>
        <div className={styles.largeInfo}>
          <div className={styles.largeTitle}>{track.title}</div>
          {track.artist && <div className={styles.largeArtist}>{track.artist}</div>}
        </div>

        {isPlaying && (
          <div className={styles.visualizer}>
            <div className={styles.bar} />
            <div className={styles.bar} />
            <div className={styles.bar} />
            <div className={styles.bar} />
          </div>
        )}
      </div>
    </div>
  );
}
