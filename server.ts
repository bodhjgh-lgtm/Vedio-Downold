import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Encrypted / obfuscated backend API route
const API_BASE = "https://r-gengpt-api.vercel.app/api/video/download";

// Helper to extract YouTube video ID
function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

// Helper to extract fallback title from URL
function extractTitleFromUrl(url: string): string {
  const ytId = extractYoutubeId(url);
  if (ytId) return `YouTube Video (${ytId})`;
  if (url.includes("tiktok.com")) return "TikTok Viral Video";
  if (url.includes("instagram.com")) return "Instagram Reel / Post";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "Facebook Media Content";
  return "Extracted Media Video";
}

// Server-side video downloader proxy endpoint
app.get("/api/download", async (req, res) => {
  try {
    const videoUrl = req.query.url as string;
    if (!videoUrl) {
      return res.status(400).json({ status: "error", message: "Video URL is required" });
    }

    // Call external video API securely from server-side
    const apiTarget = `${API_BASE}?url=${encodeURIComponent(videoUrl)}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

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
      console.warn("Primary API fetch warning, proceeding with fallback parsing...", e);
    }

    // Extract Title
    let title = rawData?.data?.title || rawData?.title || rawData?.meta?.title || extractTitleFromUrl(videoUrl);
    
    // Extract Thumbnail
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

    // Extract media formats array directly from API response
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
      // Only treat rawData.data.url as a media download link if it is an actual CDN media file URL
      const singleUrl = rawData.data.url;
      extractedMedias = [
        { label: "Direct Download Stream (MP4)", quality: "HD Video", url: singleUrl, ext: "mp4", type: "video" }
      ];
    }

    // Filter out invalid or non-downloadable links (e.g. raw YouTube watch URLs)
    const validMediaItems = extractedMedias.filter((m: any) => {
      if (!m || !m.url || typeof m.url !== 'string') return false;
      const lowerUrl = m.url.toLowerCase();
      if (!lowerUrl.startsWith('http')) return false;
      // Exclude raw YouTube video page links so we don't send users back to YouTube
      if (lowerUrl.includes('youtube.com/watch') || lowerUrl.includes('youtu.be/')) return false;
      return true;
    });

    if (validMediaItems.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "This video API did not return direct video stream links for this URL. Please try another video link.",
      });
    }

    // Normalize format entries directly from API response without fake fallback labels
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
        url: m.url, // Exact direct CDN video stream download link from API response
        width: m.width || null,
        height: m.height || null,
        bitrate: m.bitrate || null,
        fps: m.fps || null,
        mimeType: m.mimeType || null,
        formattedSize: m.formattedSize || m.size || null,
        isAudio: isAudio,
      };
    });

    const cleanData = {
      success: true,
      title: title,
      thumbnail: thumbnail,
      duration: duration,
      platform: platform,
      originalUrl: videoUrl,
      medias: cleanMedias,
    };

    return res.json(cleanData);

  } catch (error: any) {
    console.error("Download Proxy Error:", error?.message);
    
    // Return friendly error response
    return res.status(500).json({
      status: "error",
      message: error?.name === "AbortError" 
        ? "Request timed out while connecting to video server. Please try again."
        : "Could not fetch media info. Please double check your video link.",
    });
  }
});

// Helper to detect platform from URL
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

// Media download proxy helper to force file download with proper attachment headers
app.get("/api/file-proxy", async (req, res) => {
  try {
    const fileUrl = req.query.file as string;
    const filename = (req.query.filename as string) || "mediadrop-download.mp4";
    if (!fileUrl) {
      return res.status(400).send("File URL is required");
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      return res.redirect(fileUrl);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("File download proxy error:", err);
    if (req.query.file) {
      return res.redirect(req.query.file as string);
    }
    return res.status(500).send("Failed to proxy file download.");
  }
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediaDrop App Server running on http://localhost:${PORT}`);
  });
}

startServer();
