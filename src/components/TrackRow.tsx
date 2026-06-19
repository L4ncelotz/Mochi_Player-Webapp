import { Play, Pause, X, Heart } from 'lucide-react';
import { memo } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import type { Track } from '../types/music';
import { formatTime } from '../utils/time';
import { MOODS } from '../utils/moods';
import styles from './TrackRow.module.css';

interface Props {
  track: Track;
  index: number;
  onContextMenu?: (e: React.MouseEvent, trackId: string) => void;
}

export const TrackRow = memo(function TrackRow({ track, index, onContextMenu }: Props) {
  const { currentTrackId, isPlaying, play, pause, removeTrack, favorites, toggleFavorite, trackMoods } = usePlayerStore();
  const isCurrent = currentTrackId === track.id;
  const isFavorite = favorites.includes(track.id);
  const moods = trackMoods[track.id] || [];

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent && isPlaying) {
      pause();
    } else {
      play(track.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTrack(track.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (onContextMenu) {
      e.preventDefault();
      onContextMenu(e, track.id);
    }
  };

  return (
    <div
      className={`${styles.row} ${isCurrent ? styles.active : ''}`}
      onClick={() => play(track.id)}
      onContextMenu={handleContextMenu}
      style={{ '--index': index } as React.CSSProperties}
      id={`track-row-${track.id}`}
    >
      <div className={styles.playState} onClick={handlePlayPause}>
        {isCurrent && isPlaying ? (
          <Pause size={16} className={styles.iconActive} />
        ) : (
          <Play size={16} className={isCurrent ? styles.iconActive : styles.iconIdle} />
        )}
      </div>

      <div className={styles.info}>
        <div 
          className={`${styles.trackTitle} ${isCurrent ? styles.activeTitle : ''}`}
          title={track.title}
        >
          {track.title}
        </div>
        {track.artist && <div className={styles.trackArtist} title={track.artist}>{track.artist}</div>}
      </div>
      
      <button 
        className={`${styles.favoriteBtn} ${isFavorite ? styles.isFavorite : ''}`}
        onClick={handleToggleFavorite}
        title={isFavorite ? "Unfavorite" : "Favorite"}
      >
        <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      {moods.slice(0, 1).map(moodId => {
        const def = MOODS.find(m => m.id === moodId);
        if (!def) return null;
        const Icon = def.icon;
        return (
          <span 
            key={moodId} 
            className={styles.moodBadge}
            style={{ '--mood-color': def.color } as React.CSSProperties}
            title={def.label}
          >
            <Icon size={12} />
          </span>
        );
      })}

      <span className={styles.badge}>{track.extension}</span>
      
      {track.duration != null && (
        <span className={styles.duration}>{formatTime(track.duration)}</span>
      )}
      
      <button
        className={styles.removeBtn}
        onClick={handleRemove}
        title="Remove"
        id={`remove-track-${track.id}`}
      >
        <X size={14} />
      </button>
    </div>
  );
});
