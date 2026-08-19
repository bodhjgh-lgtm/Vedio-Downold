// Vercel Serverless Function for /api/download endpoint
import type { Request, Response } from 'express';

const API_BASE = "https://r-gengpt-api.vercel.app/api/video/download";

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

function extractTitleFromUrl(url: string): string {
  const ytId = extractYoutubeId(url);
  if (ytId) return `YouTube Video (${ytId})`;
  if (url.includes("tiktok.com")) return "TikTok Viral Video";
  if (url.includes("instagram.com")) return "Instagram Reel / Post";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "Facebook Media Content";
  return "Extracted Media Video";
}

function detectPlatform(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes("youtube") || lower.includes("youtu.be")) return "YouTube";
  if (lower.includes("facebook") || lower.includes("fb.watch") || lower.includes("fb.com")) return "Facebook";
  if (lower.includes("instagram") || lower.includes("instagr.am")) return "Instagram";
  if (lower.includes("tiktok")) return "TikTok";
  if (lower.includes("twitter") || lower.includes("x.com")) return "Twitter / X";
  if (lower.includes("vimeo")) return "Vimeo";
  if (lower.includes("pinterest")) return "Pinterest";
  return "Web Media";
}

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const videoUrl = (req.query?.url as string) || "";
    if (!videoUrl) {
      return res.status(400).json({ status: "error", message: "Video URL is required" });
    }

    const apiTarget = `${API_BASE}?url=${encodeURIComponent(videoUrl)}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let rawData: any = null;

    try {
      const apiRes = await fetch(apiTarget, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (apiRes.ok) {
        rawData = await apiRes.json();
      }
    } catch (e) {
      console.warn("Vercel Function API fetch warning:", e);
    }

    let title = rawData?.data?.title || rawData?.title || rawData?.meta?.title || extractTitleFromUrl(videoUrl);
    
    const ytId = extractYoutubeId(videoUrl);
    let thumbnail = rawData?.data?.thumbnail || rawData?.thumbnail || rawData?.meta?.thumbnail || "";
    if (!thumbnail && ytId) {
      thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    if (!thumbnail) {
      thumbnail = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80";
    }

    const duration = rawData?.data?.duration || rawData?.duration || 0;
    const platform = rawData?.meta?.platform || detectPlatform(videoUrl);

    let extractedMedias: any[] = [];

    if (Array.isArray(rawData?.data?.medias) && rawData.data.medias.length > 0) {
      extractedMedias = rawData.data.medias;
    } else if (Array.isArray(rawData?.medias) && rawData.medias.length > 0) {
      extractedMedias = rawData.medias;
    } else if (Array.isArray(rawData?.formats) && rawData.formats.length > 0) {
      extractedMedias = rawData.formats;
    } else if (Array.isArray(rawData?.data?.links) && rawData.data.links.length > 0) {
      extractedMedias = rawData.data.links;
    } else if (
      rawData?.data?.url && 
      typeof rawData.data.url === 'string' && 
      rawData.data.url.startsWith('http') && 
      !rawData.data.url.includes('youtube.com') && 
      !rawData.data.url.includes('youtu.be')
    ) {
      const singleUrl = rawData.data.url;
      extractedMedias = [
        { label: "Direct Download Stream (MP4)", quality: "HD Video", url: singleUrl, ext: "mp4", type: "video" }
      ];
    }

    const validMediaItems = extractedMedias.filter((m: any) => {
      if (!m || !m.url || typeof m.url !== 'string') return false;
      const lowerUrl = m.url.toLowerCase();
      if (!lowerUrl.startsWith('http')) return false;
      if (lowerUrl.includes('youtube.com/watch') || lowerUrl.includes('youtu.be/')) return false;
      return true;
    });

    if (validMediaItems.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No direct video streams found. Please verify the URL or try another video link.",
      });
    }

    const cleanMedias = validMediaItems.map((m: any, index: number) => {
      const isVideoType = m.type === "video";
      const isAudio = !isVideoType && Boolean(m.is_audio || m.isAudio || m.type === "audio" || m.ext === "mp3" || m.extension === "mp3");
      const ext = (m.ext || m.extension || (isAudio ? "mp3" : "mp4")).toLowerCase();
      const rawQuality = m.quality || m.qualityLabel || m.format_note || m.format || (isAudio ? "Audio Stream" : "Video Stream");
      const displayLabel = m.label || rawQuality;
      
      return {
        id: `f_${index}_${m.formatId || index}`,
        formatId: m.formatId || index,
        label: displayLabel,
        quality: rawQuality,
        type: isAudio ? "audio" : "video",
        ext: ext,
        url: m.url,
        width: m.width || null,
        height: m.height || null,
        bitrate: m.bitrate || null,
        fps: m.fps || null,
        mimeType: m.mimeType || null,
        formattedSize: m.formattedSize || m.size || null,
        isAudio: isAudio,
      };
    });

    return res.status(200).json({
      success: true,
      title: title,
      thumbnail: thumbnail,
      duration: duration,
      platform: platform,
      originalUrl: videoUrl,
      medias: cleanMedias,
    });

  } catch (error: any) {
    console.error("Vercel Function Error:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching media info.",
    });
  }
}
