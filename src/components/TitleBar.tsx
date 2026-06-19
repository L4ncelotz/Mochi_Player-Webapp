import { ExternalLink, Minimize2 } from "lucide-react";
import { useDocumentPiP } from "../hooks/useDocumentPiP";
import { usePlayerStore } from "../stores/playerStore";
import { MiniPlayer } from "./MiniPlayer";
import styles from "./TitleBar.module.css";

export function TitleBar() {
  const trackCount = usePlayerStore((s) => s.tracks.length);
  const { isSupported, isOpen, openPiP, closePiP, PiPPortal } =
    useDocumentPiP();

  return (
    <header className={styles.titleBar}>
      <div className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#AD56C4" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
        </svg>
        <span className={styles.logoText}>Mochi Player</span>
      </div>
      <div className={styles.controls}>
        {trackCount > 0 && (
          <span className={styles.trackCount}>
            {trackCount} track{trackCount !== 1 ? "s" : ""}
          </span>
        )}

        {isSupported && (
          <button
            className={styles.pipBtn}
            onClick={() => (isOpen ? closePiP() : openPiP(300, 160))}
            title="Toggle Mini Player"
          >
            {isOpen ? <Minimize2 size={18} /> : <ExternalLink size={18} />}
          </button>
        )}
      </div>

      <PiPPortal>
        <MiniPlayer />
      </PiPPortal>
    </header>
  );
}

