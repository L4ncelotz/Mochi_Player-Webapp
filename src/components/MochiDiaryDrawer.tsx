import { X } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { MochiDiary } from './MochiDiary';
import styles from './MochiDiaryDrawer.module.css';

export function MochiDiaryDrawer() {
  const { isDiaryOpen, toggleDiary } = usePlayerStore();

  return (
    <div className={`${styles.drawer} ${isDiaryOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h2>Mochi Diary</h2>
        <button className={styles.closeBtn} onClick={toggleDiary}>
          <X size={20} />
        </button>
      </div>
      <div className={styles.content}>
        <MochiDiary />
      </div>
    </div>
  );
}
