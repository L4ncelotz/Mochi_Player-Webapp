declare module 'jsmediatags' {
  interface PictureData {
    format: string;
    data: number[];
  }

  interface Tags {
    title?: string;
    artist?: string;
    album?: string;
    picture?: PictureData;
  }

  interface TagResult {
    tags: Tags;
  }

  interface Callbacks {
    onSuccess: (result: TagResult) => void;
    onError: (error: { type: string; info: string }) => void;
  }

  function read(file: File | string | Blob, callbacks: Callbacks): void;

  export default { read };
  export { read };
}
