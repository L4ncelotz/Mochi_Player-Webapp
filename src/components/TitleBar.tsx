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
        <img className={styles.logoIcon} src="/Mochi_1.svg" alt="Mochi Logo" />
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

