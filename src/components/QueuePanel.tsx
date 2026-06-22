import { X } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import styles from './QueuePanel.module.css';

export function QueuePanel() {
  const { queue, tracks, removeFromQueue, clearQueue } = usePlayerStore();

  if (queue.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Up next</span>
        </div>
        <div className={styles.emptyState}>
          Your queue is empty.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Up next ({queue.length})</span>
        <button className={styles.clearBtn} onClick={clearQueue}>
          Clear all
        </button>
      </div>

      <div className={styles.list}>
        {queue.map((trackId, index) => {
          const track = tracks.find((t) => t.id === trackId);
          if (!track) return null;

          return (
            <div key={`${trackId}-${index}`} className={styles.item}>
              <span className={styles.number}>{index + 1}</span>
              <div className={styles.info}>
                <div className={styles.trackTitle}>{track.title}</div>
                <div className={styles.trackArtist}>{track.artist || 'Unknown artist'}</div>
              </div>
              <button 
                className={styles.removeBtn} 
                onClick={() => removeFromQueue(index)}
                title="Remove from queue"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
