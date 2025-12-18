
export interface VideoInfo {
  id: string;
  url: string;
  title: string;
  platform: string;
  thumbnail: string;
  status: 'processing' | 'ready' | 'error';
  summary?: string;
  tags?: string[];
  downloadUrl?: string;
}

export enum Platform {
  TIKTOK = 'TikTok',
  INSTAGRAM = 'Instagram',
  YOUTUBE = 'YouTube',
  TWITTER = 'Twitter',
  UNKNOWN = 'Unknown'
}
