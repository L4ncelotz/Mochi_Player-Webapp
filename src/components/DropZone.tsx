import { Headphones } from 'lucide-react';
import { useState, useRef, useCallback, type DragEvent } from 'react';
import { useFileImport } from '../hooks/useFileImport';
import { getAcceptString } from '../utils/fileTypes';
import styles from './DropZone.module.css';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { importFiles } = useFileImport();

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        importFiles(e.dataTransfer.files);
      }
    },
    [importFiles],
  );

  const handleBrowse = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      className={`${styles.dropZone} ${isDragging ? styles.active : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowse}
      id="drop-zone"
    >
      <span className={styles.icon}>
        <Headphones size={36} strokeWidth={1.5} />
      </span>
      <span className={styles.label}>
        Drop your music here
        <br />
        or click to browse
      </span>
      <button className={styles.browseBtn} type="button" id="browse-btn">
        Choose Files
      </button>
      <span className={styles.formats}>MP3 · MP4 · M4A · WAV</span>
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptString()}
        multiple
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
