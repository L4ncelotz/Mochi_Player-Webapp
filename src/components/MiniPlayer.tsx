import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import styles from './MiniPlayer.module.css';

export function MiniPlayer() {
  const { 
    tracks, 
    currentTrackId, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlay, 
    next, 
    prev 
  } = usePlayerStore();

  const currentTrack = tracks.find((t) => t.id === currentTrackId);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.miniPlayer}>
      {currentTrack?.coverArt && (
        <div 
          className={styles.backgroundBlur} 
          style={{ backgroundImage: `url(${currentTrack.coverArt})` }} 
        />
      )}

      <div className={styles.content}>
        <div className={styles.artWrapper}>
          {currentTrack?.coverArt ? (
            <img src={currentTrack.coverArt} alt="Cover" className={styles.art} />
          ) : (
            <div className={styles.fallbackArt}>
              <Music size={24} className={styles.fallbackIcon} />
            </div>
          )}
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.info}>
            <div className={styles.title} title={currentTrack?.title || 'No track playing'}>
              {currentTrack?.title || 'No track playing'}
            </div>
            <div className={styles.artist} title={currentTrack?.artist || 'Ready to play'}>
              {currentTrack?.artist || 'Ready to play'}
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.btn} onClick={prev} aria-label="Previous">
              <SkipBack size={18} />
            </button>
            
            <button 
              className={styles.playBtn} 
              onClick={togglePlay} 
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />}
            </button>

            <button className={styles.btn} onClick={next} aria-label="Next">
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>
    </div>
  );
}
