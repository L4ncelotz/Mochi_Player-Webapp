import type { Track } from '../types/music';
import { usePlayerStore } from '../stores/playerStore';
import { Music2 } from 'lucide-react';
import styles from './NowPlayingCard.module.css';

export function NowPlayingCard({ track }: { track: Track | undefined }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  return (
    <div className={styles.card}>
      <div className={`${styles.artWrapper} ${isPlaying ? styles.artPlaying : ''}`}>
        {track?.coverArt ? (
          <img className={styles.artImage} src={track.coverArt} alt="Album art" />
        ) : (
          <div className={styles.artPlaceholder}>
            <Music2 size={80} strokeWidth={1} />
          </div>
        )}
      </div>
      <div className={styles.info}>
        {track ? (
          <>
            <div className={styles.title}>{track.title}</div>
            <div className={styles.artist}>{track.artist || 'Unknown artist'}</div>
            {isPlaying && (
              <div className={styles.visualizer}>
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
              </div>
            )}
          </>
        ) : (
          <div className={styles.noTrack}>No track selected</div>
        )}
      </div>
    </div>
  );
}
