import type { Track } from '../types/music';
import { usePlayerStore } from '../stores/playerStore';
import styles from './NowPlayingCard.module.css';

const SleepyMascot = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%', padding: '16px' }}>
    {/* Mochi body */}
    <ellipse cx="60" cy="68" rx="44" ry="36" fill="#FFD6E7" />
    <ellipse cx="60" cy="62" rx="44" ry="40" fill="#FFE8F3" />
    {/* Blush */}
    <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <ellipse cx="80" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    {/* Sleeping Eyes */}
    <path d="M44 62 Q50 66 54 62" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M66 62 Q72 66 76 62" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Zzz */}
    <text x="82" y="40" fontSize="16" fill="#AD56C4" opacity="0.6" fontWeight="bold">Z</text>
    <text x="96" y="30" fontSize="12" fill="#AD56C4" opacity="0.4" fontWeight="bold">z</text>
    <text x="106" y="22" fontSize="10" fill="#AD56C4" opacity="0.3" fontWeight="bold">z</text>
  </svg>
);

export function NowPlayingCard({ track }: { track: Track | undefined }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  return (
    <div className={styles.card}>
      <div className={`${styles.artWrapper} ${isPlaying ? styles.artPlaying : ''}`}>
        {track?.coverArt ? (
          <img className={styles.artImage} src={track.coverArt} alt="Album art" />
        ) : (
          <div className={styles.artPlaceholder}>
            <SleepyMascot />
          </div>
        )}
      </div>
      <div className={styles.info}>
        {track ? (
          <>
            <div className={styles.title}>{track.title}</div>
            <div className={styles.artist}>{track.artist || 'Unknown artist'}</div>
            {isPlaying && (
              <div className={styles.visualizer}>
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
                <div className={styles.bar} />
              </div>
            )}
          </>
        ) : (
          <div className={styles.noTrack}>
            <div className={styles.noTrackHeading}>Pick a song to wake Mochi</div>
            <div className={styles.noTrackSub}>Choose a track from your playlist to start listening.</div>
          </div>
        )}
      </div>
    </div>
  );
}

