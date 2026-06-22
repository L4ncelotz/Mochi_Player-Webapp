import { usePlayerStore } from '../stores/playerStore';
import { Sparkles, Medal, Disc3, Smile, PlayCircle } from 'lucide-react';
import { MOODS } from '../utils/moods';
import styles from './MochiDiary.module.css';

export function MochiDiary() {
  const { tracks, dailySeconds, playCounts, trackMoods } = usePlayerStore();

  const today = new Date().toISOString().split('T')[0];
  const listenSeconds = dailySeconds[today] || 0;
  const listenMinutes = Math.floor(listenSeconds / 60);

  // Calculate Goal
  const goalMinutes = 30;
  const progressPercent = Math.min(100, Math.round((listenMinutes / goalMinutes) * 100));

  // Tracks played count (unique tracks played today, approx by non-zero playcounts or just total playHistory... wait, playCounts is all-time. Let's just use tracks in playHistory or count all playCounts for simplicity. Actually, playHistory is a queue. We can just sum playCounts. But it's all time. Let's just show Total Tracks in Library for now, or total listens.
  // We'll show "Total Plays" instead of today's if we don't track daily play counts.
  const totalPlays = Object.values(playCounts).reduce((sum, count) => sum + count, 0);

  // Calculate Top Track
  let topTrackId: string | null = null;
  if (Object.keys(playCounts).length > 0) {
    topTrackId = Object.keys(playCounts).reduce((a, b) => playCounts[a] > playCounts[b] ? a : b);
  }
  const topTrack = tracks.find(t => t.id === topTrackId);

  // Calculate Most Played Mood
  const moodCounts: Record<string, number> = {};
  tracks.forEach(t => {
    if (playCounts[t.id]) {
      const moods = trackMoods[t.id] || [];
      moods.forEach(m => {
        moodCounts[m] = (moodCounts[m] || 0) + playCounts[t.id];
      });
    }
  });
  let topMoodId: string | null = null;
  if (Object.keys(moodCounts).length > 0) {
    topMoodId = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
  }
  const topMood = topMoodId ? MOODS.find(m => m.id === topMoodId) : null;

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
        
        {/* Tiny Achievement Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressTitle}>Daily Cozy Goal</span>
            <span className={styles.progressText}>{listenMinutes} / {goalMinutes} min</span>
          </div>
          <div className={styles.progressBarBg}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${progressPercent}%`, backgroundColor: progressPercent >= 100 ? 'var(--pink)' : 'var(--pink-light)' }} 
            />
          </div>
        </div>

        {listenMinutes >= 30 && (
          <div className={styles.achievement}>
            <Medal size={16} className={styles.medalIcon} />
            <span>{listenMinutes >= 120 ? 'Music Lover' : listenMinutes >= 60 ? 'Deep Listener' : 'Goal Achieved'}</span>
          </div>
        )}
      </div>

      <div className={styles.statsGrid}>
        {totalPlays > 0 && (
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <PlayCircle size={14} className={styles.statIcon} />
              <span>Total Plays</span>
            </div>
            <div className={styles.statValue}>{totalPlays} tracks</div>
          </div>
        )}

        {topMood && (
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <Smile size={14} className={styles.statIcon} style={{ color: topMood.color }} />
              <span>Top Mood</span>
            </div>
            <div className={styles.statValue}>{topMood.label}</div>
          </div>
        )}

        {topTrack && (
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <Disc3 size={14} className={styles.statIcon} />
              <span>Top Track</span>
            </div>
            <div className={styles.statValue}>{topTrack.title}</div>
          </div>
        )}
      </div>
    </div>
  );
}
