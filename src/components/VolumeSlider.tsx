import { usePlayerStore } from '../stores/playerStore';
import styles from './PlayerControls.module.css';

export function VolumeSlider() {
  const { volume, setVolume } = usePlayerStore();

  return (
    <div className={styles.volumeRow}>
      <span 
        className={styles.volumeIcon} 
        onClick={usePlayerStore.getState().toggleMute}
        title="Toggle Mute"
      >
        {usePlayerStore((s) => s.isMuted) || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
      </span>
      <input
        className={styles.volumeSlider}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        id="volume-slider"
      />
    </div>
  );
}
