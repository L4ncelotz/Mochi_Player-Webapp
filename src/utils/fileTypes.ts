export const ACCEPTED_EXTENSIONS = ['mp3', 'mp4', 'm4a', 'wav'] as const;

export type AcceptedExtension = (typeof ACCEPTED_EXTENSIONS)[number];

const MIME_MAP: Record<AcceptedExtension, string> = {
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
};

export function getExtension(fileName: string): AcceptedExtension | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext && ACCEPTED_EXTENSIONS.includes(ext as AcceptedExtension)) {
    return ext as AcceptedExtension;
  }
  return null;
}

export function getMimeType(ext: AcceptedExtension): string {
  return MIME_MAP[ext];
}

export function getAcceptString(): string {
  return ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(',');
}
