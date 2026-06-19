import { usePlayerStore } from '../stores/playerStore';
import { formatTime } from '../utils/time';
import styles from './PlayerControls.module.css';
import { VolumeSlider } from './VolumeSlider';

interface Props {
  onSeek: (time: number) => void;
}

export function PlayerControls({ onSeek }: Props) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeatMode,
    togglePlay,
    prev,
    next,
    setVolume,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();

  return (
    <div className={styles.controls}>
      {/* Progress */}
      <div className={styles.progressRow}>
        <span className={styles.time}>{formatTime(currentTime)}</span>
        <input
          className={styles.progressSlider}
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          id="progress-slider"
        />
        <span className={`${styles.time} ${styles.timeRight}`}>{formatTime(duration)}</span>
      </div>

      {/* Transport */}
      <div className={styles.transport}>
        <button
          className={`${styles.btn} ${shuffle ? styles.btnActive : ''}`}
          onClick={toggleShuffle}
          title="Shuffle"
          id="shuffle-btn"
        >
          🔀
        </button>
        <button className={styles.btn} onClick={prev} title="Previous" id="prev-btn">
          ⏮
        </button>
        <button
          className={`${styles.btn} ${styles.playBtn}`}
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          id="play-btn"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className={styles.btn} onClick={next} title="Next" id="next-btn">
          ⏭
        </button>
        <div className={styles.btnWrapper}>
          <button
            className={`${styles.btn} ${repeatMode !== 'off' ? styles.btnActive : ''}`}
            onClick={cycleRepeat}
            title={`Repeat: ${repeatMode}`}
            id="repeat-btn"
          >
            🔁
          </button>
          {repeatMode === 'one' && <span className={styles.repeatLabel}>1</span>}
        </div>
      </div>

      {/* Volume */}
      <VolumeSlider />
    </div>
  );
}
