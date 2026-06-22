import { useEffect, useRef } from 'react';
import { Play, ListPlus, SkipForward, Heart, HeartOff } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { MOODS } from '../utils/moods';
import styles from './TrackContextMenu.module.css';

interface Props {
  trackId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export function TrackContextMenu({ trackId, x, y, onClose }: Props) {
  const { play, playNext, addToQueue, favorites, toggleFavorite, trackMoods, toggleMood } = usePlayerStore();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isFavorite = favorites.includes(trackId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust position to stay within viewport bounds (auto-flip)
  const menuHeight = 300; // estimated max height
  const menuWidth = 200; // estimated width
  
  const style: React.CSSProperties = {
    top: y + menuHeight > window.innerHeight ? Math.max(0, y - menuHeight) : y,
    left: x + menuWidth > window.innerWidth ? Math.max(0, x - menuWidth) : x,
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto'
  };

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const track = usePlayerStore.getState().tracks.find(t => t.id === trackId);

  return (
    <div ref={menuRef} className={styles.menu} style={style}>
      {track && (
        <>
          <div className={styles.trackHeader}>
            <div className={styles.trackHeaderTitle}>{track.title}</div>
            {track.artist && <div className={styles.trackHeaderArtist}>{track.artist}</div>}
          </div>
          <div className={styles.divider} />
        </>
      )}
      <button className={styles.item} onClick={() => handleAction(() => play(trackId))}>
        <Play size={14} className={styles.icon} />
        Play now
      </button>
      <button className={styles.item} onClick={() => handleAction(() => playNext(trackId))}>
        <SkipForward size={14} className={styles.icon} />
        Play next
      </button>
      <div className={styles.divider} />
      <button className={styles.item} onClick={() => handleAction(() => addToQueue(trackId))}>
        <ListPlus size={14} className={styles.icon} />
        Add to queue
      </button>
      <div className={styles.divider} />
      <button className={styles.item} onClick={() => handleAction(() => toggleFavorite(trackId))}>
        {isFavorite ? <HeartOff size={14} className={styles.icon} /> : <Heart size={14} className={styles.icon} />}
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
      
      <div className={styles.divider} />
      <div className={styles.sectionTitle}>Mood</div>
      <div className={styles.moodGrid}>
        {MOODS.map((mood) => {
          const Icon = mood.icon;
          const isActive = trackMoods[trackId]?.includes(mood.id);
          return (
            <button
              key={mood.id}
              className={`${styles.moodBtn} ${isActive ? styles.moodActive : ''}`}
              onClick={() => handleAction(() => toggleMood(trackId, mood.id))}
              title={mood.label}
              style={{ '--mood-color': mood.color } as React.CSSProperties}
            >
              <Icon size={14} />
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
