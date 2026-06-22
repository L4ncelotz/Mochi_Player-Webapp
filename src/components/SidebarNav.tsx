import { useState } from 'react';
import { ListMusic, Heart, Clock, BarChart2, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { MOODS } from '../utils/moods';
import styles from './SidebarNav.module.css';

export type PlaylistView = 'all' | 'favorites' | 'recent' | 'mostPlayed' | 'queue' | string;

interface Props {
  currentView: PlaylistView;
  onChangeView: (view: PlaylistView) => void;
}

export function SidebarNav({ currentView, onChangeView }: Props) {
  const { isDiaryOpen, toggleDiary, queue } = usePlayerStore();
  const [isMoodsExpanded, setIsMoodsExpanded] = useState(true);

  return (
    <div className={styles.nav}>
      <div className={styles.section}>Library</div>
      <button 
        className={`${styles.navItem} ${currentView === 'all' && !isDiaryOpen ? styles.active : ''}`}
        onClick={() => { onChangeView('all'); if (isDiaryOpen) toggleDiary(); }}
      >
        <ListMusic size={16} />
        <span>All Tracks</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'queue' && !isDiaryOpen ? styles.active : ''}`}
        onClick={() => { onChangeView('queue'); if (isDiaryOpen) toggleDiary(); }}
      >
        <ListMusic size={16} />
        <span>Play Queue {queue.length > 0 ? `(${queue.length})` : ''}</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'favorites' && !isDiaryOpen ? styles.active : ''}`}
        onClick={() => { onChangeView('favorites'); if (isDiaryOpen) toggleDiary(); }}
      >
        <Heart size={16} />
        <span>Favorites</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'recent' && !isDiaryOpen ? styles.active : ''}`}
        onClick={() => { onChangeView('recent'); if (isDiaryOpen) toggleDiary(); }}
      >
        <Clock size={16} />
        <span>Recently Played</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'mostPlayed' && !isDiaryOpen ? styles.active : ''}`}
        onClick={() => { onChangeView('mostPlayed'); if (isDiaryOpen) toggleDiary(); }}
      >
        <BarChart2 size={16} />
        <span>Most Played</span>
      </button>

      <div className={styles.section} style={{ marginTop: '12px' }}>Mochi</div>
      <button 
        className={`${styles.navItem} ${isDiaryOpen ? styles.active : ''}`}
        onClick={toggleDiary}
      >
        <BookOpen size={16} />
        <span>Mochi Diary</span>
      </button>

      <div 
        className={styles.section} 
        style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        onClick={() => setIsMoodsExpanded(!isMoodsExpanded)}
      >
        <span>Moods</span>
        {isMoodsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
      
      {isMoodsExpanded && (
        <div className={styles.moodPills}>
          {MOODS.map(mood => {
            const isActive = currentView === `mood:${mood.id}`;
            return (
              <button
                key={mood.id}
                className={`${styles.moodPill} ${isActive ? styles.moodPillActive : ''}`}
                onClick={() => { 
                  onChangeView(isActive ? 'all' : `mood:${mood.id}`); 
                  if (isDiaryOpen) toggleDiary(); 
                }}
                style={{ '--mood-color': mood.color } as React.CSSProperties}
              >
                {mood.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
