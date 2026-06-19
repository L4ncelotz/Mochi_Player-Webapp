export interface YouTubeMetadata {
  title: string;
  artist: string;
  thumbnailUrl: string;
}

export async function fetchYouTubeMetadata(url: string): Promise<YouTubeMetadata | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.error) return null;

    return {
      title: data.title || 'Unknown Video',
      artist: data.author_name || 'YouTube',
      thumbnailUrl: data.thumbnail_url || ''
    };
  } catch (err) {
    console.error('Failed to fetch YouTube metadata', err);
    return null;
  }
}
