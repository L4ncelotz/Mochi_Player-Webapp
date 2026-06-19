import { VolumeX, Volume1, Volume2 } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import styles from './PlayerControls.module.css';

export function VolumeSlider() {
  const { volume, setVolume } = usePlayerStore();
  const isMuted = usePlayerStore((s) => s.isMuted);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className={styles.volumeRow}>
      <button 
        className={styles.volumeIconBtn} 
        onClick={usePlayerStore.getState().toggleMute}
        title="Toggle Mute"
      >
        {getVolumeIcon()}
      </button>
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
