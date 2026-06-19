import { usePlayerStore } from '../stores/playerStore';
import styles from './ToastHost.module.css';

export function ToastHost() {
  const toast = usePlayerStore((s) => s.toast);

  if (!toast) return null;

  return (
    <div className={styles.toastHost}>
      <div className={styles.toast}>{toast}</div>
    </div>
  );
}
