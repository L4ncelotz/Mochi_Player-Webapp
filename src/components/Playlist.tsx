import { usePlayerStore } from '../stores/playerStore';
import { TrackRow } from './TrackRow';
import styles from './Playlist.module.css';

export function Playlist() {
  const tracks = usePlayerStore((s) => s.tracks);

  if (tracks.length === 0) return null;

  return (
    <div className={styles.playlist} id="playlist">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Playlist</span>
      </div>
      {tracks.map((track, i) => (
        <TrackRow key={track.id} track={track} index={i} />
      ))}
    </div>
  );
}
