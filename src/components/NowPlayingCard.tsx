import { useEffect, useRef, useState } from 'react';
import type { Track } from '../types/music';
import { usePlayerStore } from '../stores/playerStore';
import styles from './NowPlayingCard.module.css';

// ─── Mascot SVGs ───────────────────────────────────────────────────────────

const SleepyMascot = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '100%', height: '100%', padding: '16px' }}>
    <ellipse cx="60" cy="68" rx="44" ry="36" fill="#FFD6E7" />
    <ellipse cx="60" cy="62" rx="44" ry="40" fill="#FFE8F3" />
    <ellipse cx="40" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <ellipse cx="80" cy="72" rx="8" ry="5" fill="#FF8DA1" opacity="0.4" />
    <path d="M44 62 Q50 66 54 62" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M66 62 Q72 66 76 62" stroke="#3D2C35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
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

// ─── Marquee for long titles ────────────────────────────────────────────────

function MarqueeTitle({ text, className }: { text: string; className: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    // Small delay to let DOM settle after text change
    const timer = setTimeout(() => {
      setShouldScroll(textEl.scrollWidth > container.clientWidth + 2);
    }, 260); // after transition finishes

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden', width: '100%' }}>
      {shouldScroll ? (
        <div className={styles.marqueeTrack}>
          <span ref={textRef} className={styles.marqueeText}>{text}</span>
          <span className={styles.marqueeText} aria-hidden="true">{text}</span>
        </div>
      ) : (
        <span ref={textRef}>{text}</span>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function NowPlayingCard({ track }: { track: Track | undefined }) {
  const { isPlaying, hasError } = usePlayerStore();

  // Track ID change triggers text transition
  const [displayTrack, setDisplayTrack] = useState(track);
  const [textVisible, setTextVisible] = useState(true);
  const prevIdRef = useRef(track?.id);

  useEffect(() => {
    if (track?.id === prevIdRef.current) {
      setDisplayTrack(track); // same track, update in place (e.g. metadata load)
      return;
    }
    // New track: fade out → update → fade in
    setTextVisible(false);
    const timer = setTimeout(() => {
      setDisplayTrack(track);
      prevIdRef.current = track?.id;
      setTextVisible(true);
    }, 180);
    return () => clearTimeout(timer);
  }, [track]);

  const mascot = () => {
    if (!displayTrack) return <SleepyMascot />;
    if (hasError) return <ErrorMascot />;
    if (isPlaying) return <AwakeMascot />;
    return <PausedMascot />;
  };

  return (
    <div className={styles.card}>
      {/* Ambient blob behind the card */}
      {isPlaying && <div className={styles.ambientBlob} />}

      <div className={`${styles.cardWrapper} ${isPlaying ? styles.cardPlaying : ''}`}>
        {/* Art / Mascot area */}
        <div className={styles.artOuter}>
          {/* Glow ring — visible only when playing */}
          {isPlaying && <div className={styles.glowRing} />}

          <div className={`${styles.artWrapper} ${isPlaying ? styles.artFloat : ''}`}>
            {displayTrack?.coverArt ? (
              <img className={styles.artImage} src={displayTrack.coverArt} alt="Album art" />
            ) : (
              <div className={styles.artPlaceholder}>
                {mascot()}
              </div>
            )}
          </div>

          {/* Floating music notes — only when playing and no cover */}
          {isPlaying && !displayTrack?.coverArt && (
            <div className={styles.notesContainer} aria-hidden="true">
              <span className={`${styles.note} ${styles.note1}`}>♪</span>
              <span className={`${styles.note} ${styles.note2}`}>♫</span>
              <span className={`${styles.note} ${styles.note3}`}>♩</span>
            </div>
          )}
        </div>

        {/* Text info */}
        <div className={styles.info}>
          {displayTrack ? (
            <div
              className={styles.textGroup}
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 180ms ease, transform 180ms ease',
              }}
            >
              {/* Status label */}
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
                <div className={styles.statusLabel}>
                  {hasError ? 'Error' : 'Paused'}
                </div>
              )}

              {/* Title — marquee if long */}
              <MarqueeTitle text={displayTrack.title} className={styles.title} />

              {/* Artist */}
              <div
                className={styles.artist}
                style={{
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity 180ms ease 40ms, transform 180ms ease 40ms',
                  color: displayTrack.artist ? undefined : 'var(--text-tertiary)',
                  fontStyle: displayTrack.artist ? 'normal' : 'italic',
                }}
              >
                {displayTrack.artist || 'Unknown artist'}
              </div>
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
