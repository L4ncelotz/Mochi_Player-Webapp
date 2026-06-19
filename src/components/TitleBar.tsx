import { usePlayerStore } from '../stores/playerStore';
import styles from './TitleBar.module.css';

export function TitleBar() {
  const trackCount = usePlayerStore((s) => s.tracks.length);

  return (
    <header className={styles.titleBar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍡</span>
        <span className={styles.logoText}>Mochi Player</span>
      </div>
      {trackCount > 0 && (
        <span className={styles.trackCount}>
          {trackCount} track{trackCount !== 1 ? 's' : ''}
        </span>
      )}
    </header>
  );
}
