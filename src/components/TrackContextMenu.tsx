import { useEffect, useRef } from 'react';
import { Play, ListPlus, SkipForward, Heart, HeartOff } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import styles from './TrackContextMenu.module.css';

interface Props {
  trackId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export function TrackContextMenu({ trackId, x, y, onClose }: Props) {
  const { play, playNext, addToQueue, favorites, toggleFavorite } = usePlayerStore();
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

  // Adjust position to stay within viewport bounds
  const style: React.CSSProperties = {
    top: Math.min(y, window.innerHeight - 200),
    left: Math.min(x, window.innerWidth - 200),
  };

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div ref={menuRef} className={styles.menu} style={style}>
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
    </div>
  );
}
