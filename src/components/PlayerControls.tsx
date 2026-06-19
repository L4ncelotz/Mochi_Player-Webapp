import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1 } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { formatTime } from '../utils/time';
import { VolumeSlider } from './VolumeSlider';
import styles from './PlayerControls.module.css';

interface Props {
  onSeek: (time: number) => void;
}

export function PlayerControls({ onSeek }: Props) {
  const {
    currentTrackId,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    repeatMode,
    togglePlay,
    prev,
    next,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();

  const isDisabled = !currentTrackId;
  const fillPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`${styles.controls} ${isDisabled ? styles.disabled : ''}`}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <input
          className={styles.progressSlider}
          style={{ '--fill': `${fillPct}%` } as React.CSSProperties}
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={isDisabled}
          id="progress-slider"
        />
      </div>

      <div className={styles.controlsContent}>
        {/* Left: Time */}
        <div className={styles.leftSide}>
          {isDisabled ? (
            <span className={styles.disabledText}>Select a track to play</span>
          ) : (
            <span className={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>

        {/* Center: Transport */}
        <div className={styles.transport}>
          <button
            className={`${styles.btn} ${shuffle ? styles.btnActive : ''}`}
            onClick={toggleShuffle}
            disabled={isDisabled}
            title="Shuffle"
            id="shuffle-btn"
          >
            <Shuffle size={16} />
          </button>
          <button className={styles.btn} onClick={prev} disabled={isDisabled} title="Previous" id="prev-btn">
            <SkipBack size={18} />
          </button>
          <button
            className={`${styles.btn} ${styles.playBtn}`}
            onClick={togglePlay}
            disabled={isDisabled}
            title={isPlaying ? 'Pause' : 'Play'}
            id="play-btn"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className={styles.btn} onClick={next} disabled={isDisabled} title="Next" id="next-btn">
            <SkipForward size={18} />
          </button>
          <div className={styles.btnWrapper}>
            <button
              className={`${styles.btn} ${repeatMode !== 'off' ? styles.btnActive : ''}`}
              onClick={cycleRepeat}
              disabled={isDisabled}
              title={`Repeat: ${repeatMode}`}
              id="repeat-btn"
            >
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
        </div>

        {/* Right: Volume */}
        <div className={styles.volumeWrapper}>
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
