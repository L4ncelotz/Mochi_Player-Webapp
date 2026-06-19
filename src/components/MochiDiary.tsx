import { usePlayerStore } from '../stores/playerStore';
import { Sparkles, Medal, Disc3, Mic2 } from 'lucide-react';
import styles from './MochiDiary.module.css';

export function MochiDiary() {
  const { tracks, dailySeconds, playCounts } = usePlayerStore();

  const today = new Date().toISOString().split('T')[0];
  const listenSeconds = dailySeconds[today] || 0;
  const listenMinutes = Math.floor(listenSeconds / 60);

  // Calculate Top Track
  let topTrackId: string | null = null;
  if (Object.keys(playCounts).length > 0) {
    topTrackId = Object.keys(playCounts).reduce((a, b) => playCounts[a] > playCounts[b] ? a : b);
  }
  const topTrack = tracks.find(t => t.id === topTrackId);

  // Calculate Top Artist
  let topArtist: string | null = null;
  const artistCounts: Record<string, number> = {};
  tracks.forEach((t) => {
    if (t.artist && playCounts[t.id]) {
      artistCounts[t.artist] = (artistCounts[t.artist] || 0) + playCounts[t.id];
    }
  });
  if (Object.keys(artistCounts).length > 0) {
    topArtist = Object.keys(artistCounts).reduce((a, b) => artistCounts[a] > artistCounts[b] ? a : b);
  }

  // Mochi States
  let stateClass = styles.default;
  let message = "Mochi is waiting to listen with you.";
  let subtitle = "Play some tracks to start the diary!";
  
  if (listenMinutes > 0) {
    message = `Mochi listened with you for ${listenMinutes} minute${listenMinutes > 1 ? 's' : ''} today.`;
    subtitle = "A cozy start!";
  }

  if (listenMinutes >= 15 && listenMinutes < 30) {
    stateClass = styles.smallWin;
    subtitle = "Nice! A little music goes a long way.";
  } else if (listenMinutes >= 30 && listenMinutes < 60) {
    stateClass = styles.dailyGoal;
    subtitle = "Daily cozy goal reached! Mochi is happy.";
  } else if (listenMinutes >= 60 && listenMinutes < 120) {
    stateClass = styles.deepListen;
    subtitle = "Deep listening session! Mochi loves this.";
  } else if (listenMinutes >= 120) {
    stateClass = styles.longSession;
    subtitle = "Wow, a long journey! Mochi is full of music.";
  }

  return (
    <div className={styles.container}>
      <div className={styles.mochiWrapper}>
        <div className={`${styles.glowBg} ${stateClass}`} />
        <img 
          src="/mochi.svg" 
          alt="Mochi Mascot" 
          className={`${styles.mochiImg} ${stateClass}`} 
        />
        {listenMinutes >= 60 && (
          <div className={styles.sparkles}>
            <Sparkles size={20} className={styles.sparkle1} />
            <Sparkles size={16} className={styles.sparkle2} />
          </div>
        )}
      </div>

      <div className={styles.messageBox}>
        <h3 className={styles.message}>{message}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        
        {listenMinutes >= 30 && (
          <div className={styles.achievement}>
            <Medal size={16} className={styles.medalIcon} />
            <span>{listenMinutes >= 120 ? 'Music Lover' : listenMinutes >= 60 ? 'Deep Listener' : 'Daily Cozy Goal'}</span>
          </div>
        )}
      </div>

      {(topTrack || topArtist) && (
        <div className={styles.statsGrid}>
          {topTrack && (
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <Disc3 size={14} className={styles.statIcon} />
                <span>Top Track Today</span>
              </div>
              <div className={styles.statValue}>{topTrack.title}</div>
            </div>
          )}
          
          {topArtist && (
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <Mic2 size={14} className={styles.statIcon} />
                <span>Top Artist</span>
              </div>
              <div className={styles.statValue}>{topArtist}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
