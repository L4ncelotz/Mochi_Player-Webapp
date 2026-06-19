import { useState } from 'react';
import { Search } from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import { TrackRow } from './TrackRow';
import styles from './Playlist.module.css';

export function Playlist() {
  const tracks = usePlayerStore((s) => s.tracks);
  const clearPlaylist = usePlayerStore((s) => s.clearPlaylist);
  const [searchQuery, setSearchQuery] = useState('');

  if (tracks.length === 0) return null;

  const filteredTracks = tracks.filter((track) => {
    const q = searchQuery.toLowerCase();
    return (
      (track.title && track.title.toLowerCase().includes(q)) ||
      (track.artist && track.artist.toLowerCase().includes(q)) ||
      track.fileName.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.playlist} id="playlist">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Playlist</span>
        <button className={styles.clearBtn} onClick={clearPlaylist}>
          Clear
        </button>
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
        {filteredTracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={tracks.indexOf(track)} />
        ))}
        {filteredTracks.length === 0 && (
          <div className={styles.emptySearch}>No tracks found for "{searchQuery}"</div>
        )}
      </div>
    </div>
  );
}
