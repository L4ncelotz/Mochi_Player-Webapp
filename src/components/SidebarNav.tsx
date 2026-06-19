import { ListMusic, Heart, Clock, BarChart2 } from 'lucide-react';
import styles from './SidebarNav.module.css';

export type PlaylistView = 'all' | 'favorites' | 'recent' | 'mostPlayed';

interface Props {
  currentView: PlaylistView;
  onChangeView: (view: PlaylistView) => void;
}

export function SidebarNav({ currentView, onChangeView }: Props) {
  return (
    <div className={styles.nav}>
      <div className={styles.section}>Library</div>
      <button 
        className={`${styles.navItem} ${currentView === 'all' ? styles.active : ''}`}
        onClick={() => onChangeView('all')}
      >
        <ListMusic size={16} />
        <span>All Tracks</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'favorites' ? styles.active : ''}`}
        onClick={() => onChangeView('favorites')}
      >
        <Heart size={16} className={currentView === 'favorites' ? styles.iconActive : ''} />
        <span>Favorites</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'recent' ? styles.active : ''}`}
        onClick={() => onChangeView('recent')}
      >
        <Clock size={16} />
        <span>Recently Played</span>
      </button>
      <button 
        className={`${styles.navItem} ${currentView === 'mostPlayed' ? styles.active : ''}`}
        onClick={() => onChangeView('mostPlayed')}
      >
        <BarChart2 size={16} />
        <span>Most Played</span>
      </button>
    </div>
  );
}
