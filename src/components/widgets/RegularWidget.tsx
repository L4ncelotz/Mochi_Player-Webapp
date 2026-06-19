import { Music } from 'lucide-react';
import type { WidgetState } from './WidgetApp';
import styles from './Widget.module.css';

interface Props {
  state: WidgetState;
}

export function RegularWidget({ state }: Props) {
  const { track, isPlaying } = state;
  if (!track) return null;

  return (
    <div className={`${styles.glassPanel} ${styles.regular}`}>
      {track.coverArt && (
        <div 
          className={styles.regularBg} 
          style={{ backgroundImage: `url(${track.coverArt})` }} 
        />
      )}
      
      <div className={styles.regularArtWrapper}>
        {state.track?.coverArt ? (
          <img 
            src={state.track.coverArt} 
            className={`${styles.regularArt} ${isPlaying ? styles.pulse : ''}`} 
            alt="Album art" 
          />
        ) : (
          <div className={`${styles.regularPlaceholder} ${isPlaying ? styles.pulse : ''}`}>
            <Music size={32} />
          </div>
        )}
      </div>

      <div className={styles.regularInfo}>
        <div className={styles.regularTitle}>{track.title}</div>
        {track.artist && <div className={styles.regularArtist}>{track.artist}</div>}
      </div>

      {isPlaying && (
        <div className={styles.visualizer} style={{ paddingRight: '16px' }}>
          <div className={styles.bar} />
          <div className={styles.bar} />
          <div className={styles.bar} />
          <div className={styles.bar} />
          <div className={styles.bar} />
        </div>
      )}
    </div>
  );
}
