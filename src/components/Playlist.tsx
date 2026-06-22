import { useState } from 'react';
import { Search } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { TrackRow } from './TrackRow';
import { DropZone } from './DropZone';
import { QueuePanel } from './QueuePanel';
import { TrackContextMenu } from './TrackContextMenu';
import { SidebarNav, type PlaylistView } from './SidebarNav';
import { MOODS } from '../utils/moods';
import styles from './Playlist.module.css';

export function Playlist() {
  const { tracks, clearPlaylist, favorites, playHistory, playCounts } = usePlayerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<PlaylistView>('all');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; trackId: string } | null>(null);

  if (tracks.length === 0) return null;

  // 1. Filter by View
  let viewTracks = tracks;
  let viewTitle = 'All Tracks';
  
  if (currentView === 'favorites') {
    viewTracks = tracks.filter((t) => favorites.includes(t.id));
    viewTitle = 'Favorites';
  } else if (currentView === 'recent') {
    viewTracks = playHistory
      .map((id) => tracks.find((t) => t.id === id))
      .filter((t): t is NonNullable<typeof t> => !!t);
    viewTitle = 'Recently Played';
  } else if (currentView === 'mostPlayed') {
    viewTracks = [...tracks]
      .filter((t) => (playCounts[t.id] || 0) > 0)
      .sort((a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0))
      .slice(0, 50);
    viewTitle = 'Most Played';
  } else if (currentView.startsWith('mood:')) {
    const moodId = currentView.split(':')[1];
    viewTracks = tracks.filter(t => usePlayerStore.getState().trackMoods[t.id]?.includes(moodId));
    const moodDef = MOODS.find((m) => m.id === moodId);
    viewTitle = moodDef ? `${moodDef.label} Mood` : 'Mood Playlist';
  }

  // 2. Filter by Search
  const filteredTracks = viewTracks.filter((track) => {
    const q = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      (track.artist && track.artist.toLowerCase().includes(q)) ||
      (track.fileName && track.fileName.toLowerCase().includes(q))
    );
  });

  return (
    <div className={styles.playlist} id="playlist">
      <SidebarNav currentView={currentView} onChangeView={setCurrentView} />

      {currentView === 'queue' ? (
        <div className={styles.queueWrapper}>
          <QueuePanel />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <span className={styles.headerTitle}>{viewTitle}</span>
            {currentView === 'all' && (
              <button className={styles.clearBtn} onClick={clearPlaylist}>
                Clear
              </button>
            )}
          </div>
          
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.trackList}>
            {filteredTracks.map((track) => (
              <TrackRow 
                key={track.id} 
                track={track} 
                index={tracks.indexOf(track)} 
                onContextMenu={(e, trackId) => setContextMenu({ x: e.clientX, y: e.clientY, trackId })}
              />
            ))}
            {filteredTracks.length === 0 && (
              <div className={styles.emptySearch}>No tracks found for "{searchQuery}"</div>
            )}
          </div>
        </>
      )}

      <DropZone small />

      {contextMenu && (
        <TrackContextMenu 
          trackId={contextMenu.trackId} 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
        />
      )}
    </div>
  );
}
