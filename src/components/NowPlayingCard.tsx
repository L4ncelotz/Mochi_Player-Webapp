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
const AwakeMascot = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%', padding: '16px' }}>
    <ellipse cx="60" cy="68" rx="44" ry="36" fill="#FFD6E7" />
    <ellipse cx="60" cy="62" rx="44" ry="40" fill="#FFE8F3" />
    <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <ellipse cx="80" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <ellipse cx="46" cy="60" rx="4" ry="6" fill="#3D2C35" />
    <ellipse cx="74" cy="60" rx="4" ry="6" fill="#3D2C35" />
    <ellipse cx="47" cy="58" rx="1.5" ry="2" fill="white" />
    <ellipse cx="75" cy="58" rx="1.5" ry="2" fill="white" />
    <path d="M56 66 Q60 70 64 66" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M85 35 V45 A4 4 0 1 1 81 49 V35 H93 V43 A4 4 0 1 1 89 47 V38 H85 Z" fill="#AD56C4" opacity="0.8" transform="rotate(15 85 35)" />
    <path d="M25 45 V55 A4 4 0 1 1 21 59 V45 H33 V53 A4 4 0 1 1 29 57 V48 H25 Z" fill="#FF8DA1" opacity="0.8" transform="rotate(-15 25 45) scale(0.8)" />
  </svg>
);

const PausedMascot = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%', padding: '16px' }}>
    <ellipse cx="60" cy="68" rx="44" ry="36" fill="#FFD6E7" />
    <ellipse cx="60" cy="62" rx="44" ry="40" fill="#FFE8F3" />
    <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <ellipse cx="80" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <path d="M42 60 Q46 58 50 60" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M70 60 Q74 58 78 60" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <ellipse cx="46" cy="62" rx="3" ry="2" fill="#3D2C35" />
    <ellipse cx="74" cy="62" rx="3" ry="2" fill="#3D2C35" />
    <path d="M58 68 Q60 69 62 68" stroke="#3D2C35" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const ErrorMascot = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%', padding: '16px' }}>
    <ellipse cx="60" cy="68" rx="44" ry="36" fill="#FFD6E7" />
    <ellipse cx="60" cy="62" rx="44" ry="40" fill="#FFE8F3" />
    <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <ellipse cx="80" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <path d="M42 58 L50 64 M50 58 L42 64" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M70 58 L78 64 M78 58 L70 64" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M54 68 Q56 66 58 68 T62 68 T66 68" stroke="#3D2C35" strokeWidth="2" strokeLinecap="round" fill="none" />
    <text x="80" y="40" fontSize="16" fill="#AD56C4" opacity="0.8" fontWeight="bold">?</text>
    <text x="96" y="30" fontSize="12" fill="#FF8DA1" opacity="0.6" fontWeight="bold">?</text>
  </svg>
);

const DynamicMascot = ({ track, isPlaying, hasError }: { track?: Track; isPlaying: boolean; hasError: boolean }) => {
  if (!track) return <SleepyMascot />;
  if (hasError) return <ErrorMascot />;
  if (isPlaying) return <AwakeMascot />;
  return <PausedMascot />;
};

export function NowPlayingCard({ track }: { track: Track | undefined }) {
  const { isPlaying, hasError } = usePlayerStore();

  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={`${styles.artWrapper} ${isPlaying ? styles.artPlaying : ''}`}>
          {track?.coverArt ? (
            <img className={styles.artImage} src={track.coverArt} alt="Album art" />
          ) : (
            <div className={styles.artPlaceholder}>
              <DynamicMascot track={track} isPlaying={isPlaying} hasError={hasError} />
            </div>
          )}
        </div>
        <div className={styles.info}>
          {track ? (
            <div className={styles.textGroup}>
              {isPlaying ? (
                <div className={styles.statusLabel}>
                  <div className={styles.visualizer}>
                    <div className={styles.bar} />
                    <div className={styles.bar} />
                    <div className={styles.bar} />
                    <div className={styles.bar} />
                  </div>
                  Now playing
                </div>
              ) : (
                <div className={styles.statusLabel}>Paused</div>
              )}
              <div className={styles.title}>{track.title}</div>
              <div className={styles.artist}>{track.artist || 'Unknown artist'}</div>
            </div>
          ) : (
            <div className={styles.noTrack}>
              <div className={styles.noTrackHeading}>Pick a song to wake Mochi</div>
              <div className={styles.noTrackSub}>Choose a track from your playlist to start listening.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

