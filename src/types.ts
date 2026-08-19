export interface MediaFormat {
  id: string;
  label: string;
  quality: string;
  type: "video" | "audio";
  ext: string;
  url: string;
  width?: number | null;
  height?: number | null;
  bitrate?: number | null;
  fps?: number | null;
  isAudio?: boolean;
}

export interface MediaResult {
  success: boolean;
  title: string;
  thumbnail: string;
  duration: number; // in seconds
  platform: string;
  originalUrl: string;
  medias: MediaFormat[];
}

export interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  platform: string;
  url: string;
  timestamp: number;
  duration?: number;
}

export interface DeveloperInfo {
  name: string;
  telegramUsername: string;
  telegramChannel: string;
  channelName: string;
  contactUrl: string;
  profilePic: string;
  bio: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export const DEVELOPER_DETAILS: DeveloperInfo = {
  name: "X C",
  telegramUsername: "orviXxxx",
  telegramChannel: "https://t.me/tech_master_a2z",
  channelName: "Tech Master A2Z",
  contactUrl: "https://t.me/orviXxxx",
  profilePic: "https://i.postimg.cc/pLJDdSxp/IMG-20260804-003945-511.jpg",
  bio: "Lead Developer & Cyber Security Enthusiast creating high-performance media downloader WebApps and automation tools.",
};

export const LOGO_URL = "https://i.postimg.cc/MGb3qpdT/Gemini-Generated-Image-mm5fkfmm5fkfmm5f.jpg";
