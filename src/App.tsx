import React, { useState, useEffect } from 'react';
import { BG_BASE64 } from './assets/bgBase64';
import { Navbar } from './components/Navbar';
import { DeveloperCard } from './components/DeveloperCard';
import { ResponseDisplay } from './components/ResponseDisplay';
import { AboutSection } from './components/AboutSection';
import { RecentDownloads } from './components/RecentDownloads';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ToastContainer } from './components/Toast';
import { YouTubeLogo, FacebookLogo, InstagramLogo, TikTokLogo } from './components/PlatformLogos';
import { MediaResult, MediaFormat, ToastMessage, HistoryItem, DEVELOPER_DETAILS, LOGO_URL } from './types';
import { 
  Download, 
  Link, 
  Clipboard, 
  AlertCircle, 
  Check, 
  Clock, 
  ShieldCheck, 
  Video, 
  Zap,
  Info,
  User,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

// Sample test link for single-click trial
const SAMPLE_URL = "https://youtu.be/YxJjFjP0crs?si=nY7Ykt84tdS3Si1s";

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'about' | 'developer'>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<MediaResult | null>(null);
  
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedFormatMode, setSelectedFormatMode] = useState<'video' | 'audio' | 'all'>('video');

  // Recent downloads stored in localStorage (max 5 items)
  const [recentDownloads, setRecentDownloads] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('mediadrop_recent_downloads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading recent downloads from localStorage", e);
    }
    return [];
  });

  const handleClearHistory = () => {
    setRecentDownloads([]);
    try {
      localStorage.removeItem('mediadrop_recent_downloads');
      addToast("Recent download history cleared.", "info");
    } catch (e) {
      console.error("Error clearing history", e);
    }
  };

  const handleRemoveRecentItem = (id: string) => {
    setRecentDownloads((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('mediadrop_recent_downloads', JSON.stringify(updated));
      } catch (e) {
        console.error("Error updating recent downloads", e);
      }
      return updated;
    });
  };

  const handleSelectRecentUrl = (url: string) => {
    setVideoUrl(url);
    setActiveTab('home');
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
    addToast("Loaded link from recent downloads!", "info");
  };

  // Toast notification helper
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const urlInputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync theme with body HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [isDarkMode]);

  // Handle URL paste directly from mobile/desktop clipboard
  const handlePaste = async () => {
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }

    try {
      // 1. Try modern Async Clipboard API first (works on Android Chrome & iOS Safari)
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setVideoUrl(text.trim());
          addToast("Link pasted from clipboard!", "success");
          return;
        } else {
          addToast("Clipboard is empty.", "info");
          return;
        }
      }
    } catch (err) {
      console.warn("Async Clipboard API restricted or denied:", err);
    }

    // 2. Fallback using execCommand for webview or older mobile browsers
    try {
      if (urlInputRef.current) {
        urlInputRef.current.select();
        const pastedValue = document.execCommand('paste');
        if (pastedValue && urlInputRef.current.value) {
          setVideoUrl(urlInputRef.current.value.trim());
          addToast("Link pasted from clipboard!", "success");
          return;
        }
      }
    } catch (err) {
      console.warn("execCommand paste fallback failed:", err);
    }

    // 3. If browser blocks clipboard access in iframe
    addToast("Browser blocked clipboard access. Long-press input box to paste.", "info");
  };

  // Main video download request handler with fail-safe Vercel dual-layer fallback
  const handleFetchMedia = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = videoUrl.trim();
    if (!cleanUrl) {
      setErrorMsg("Please paste or type a valid video URL.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);
    setLoadingProgress(15);

    // Simulated smooth progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 88;
        }
        return prev + Math.floor(Math.random() * 12 + 5);
      });
    }, 250);

    try {
      let data: any = null;
      let fetchSuccess = false;

      // 1. First attempt: local server or Vercel serverless proxy endpoint
      try {
        const proxyRes = await fetch(`/api/download?url=${encodeURIComponent(cleanUrl)}`);
        const contentType = proxyRes.headers.get("content-type") || "";
        if (proxyRes.ok && contentType.includes("application/json")) {
          const json = await proxyRes.json();
          if (json && json.success) {
            data = json;
            fetchSuccess = true;
          }
        }
      } catch (proxyErr) {
        console.warn("Server proxy endpoint unavailable, switching to client API fallback...", proxyErr);
      }

      // 2. Second attempt (Fallback): Direct client API call for static Vercel builds
      if (!fetchSuccess) {
        const directApiUrl = `https://r-gengpt-api.vercel.app/api/video/download?url=${encodeURIComponent(cleanUrl)}`;
        const directRes = await fetch(directApiUrl, {
          headers: {
            "Accept": "application/json"
          }
        });

        if (directRes.ok) {
          const rawData = await directRes.json();

          let title = rawData?.data?.title || rawData?.title || rawData?.meta?.title || "Extracted Media Video";
          let thumbnail = rawData?.data?.thumbnail || rawData?.thumbnail || rawData?.meta?.thumbnail || "";

          const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (!thumbnail && ytMatch) {
            thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
          }
          if (!thumbnail) {
            thumbnail = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80";
          }

          let extractedMedias: any[] = [];
          if (Array.isArray(rawData?.data?.medias) && rawData.data.medias.length > 0) {
            extractedMedias = rawData.data.medias;
          } else if (Array.isArray(rawData?.medias) && rawData.medias.length > 0) {
            extractedMedias = rawData.medias;
          } else if (Array.isArray(rawData?.formats) && rawData.formats.length > 0) {
            extractedMedias = rawData.formats;
          } else if (Array.isArray(rawData?.data?.links) && rawData.data.links.length > 0) {
            extractedMedias = rawData.data.links;
          } else if (rawData?.data?.url && typeof rawData.data.url === 'string' && rawData.data.url.startsWith('http')) {
            extractedMedias = [
              { label: "Direct Download Stream (MP4)", quality: "HD Video", url: rawData.data.url, ext: "mp4", type: "video" }
            ];
          }

          const validItems = extractedMedias.filter((m: any) => {
            if (!m || !m.url || typeof m.url !== 'string') return false;
            const lower = m.url.toLowerCase();
            return lower.startsWith('http') && !lower.includes('youtube.com/watch') && !lower.includes('youtu.be/');
          });

          if (validItems.length > 0) {
            const cleanMedias = validItems.map((m: any, index: number) => {
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

            data = {
              success: true,
              title: title,
              thumbnail: thumbnail,
              duration: rawData?.data?.duration || rawData?.duration || 0,
              platform: rawData?.meta?.platform || "Media",
              originalUrl: cleanUrl,
              medias: cleanMedias,
            };
            fetchSuccess = true;
          }
        }
      }

      clearInterval(progressInterval);
      setLoadingProgress(100);

      if (fetchSuccess && data) {
        setResult(data);
        addToast("Media download links extracted successfully!", "success");

        // Store last 5 items in recent downloads
        const newItem: HistoryItem = {
          id: `rec_${Date.now()}`,
          title: data.title || "Downloaded Video",
          thumbnail: data.thumbnail || "",
          platform: data.platform || "Media",
          url: cleanUrl,
          timestamp: Date.now(),
          duration: data.duration || 0,
        };

        setRecentDownloads((prev) => {
          const filtered = prev.filter((i) => i.url.toLowerCase() !== cleanUrl.toLowerCase());
          const updated = [newItem, ...filtered].slice(0, 5);
          try {
            localStorage.setItem('mediadrop_recent_downloads', JSON.stringify(updated));
          } catch (e) {
            console.error("Error saving recent download", e);
          }
          return updated;
        });
      } else {
        const msg = "Unable to extract direct video stream links. Please check if the video URL is public.";
        setErrorMsg(msg);
        addToast(msg, "error");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      const msg = "Network error while connecting to media extraction API. Please try again.";
      setErrorMsg(msg);
      addToast(msg, "error");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  // Direct API media link trigger - links directly to media.url provided in each media object from API
  const handleDownloadFile = (media: MediaFormat, title: string) => {
    setDownloadingId(media.id);
    
    const cleanTitle = title 
      ? title.replace(/[^a-zA-Z0-9\s-_]/g, '').trim().substring(0, 35) 
      : 'video_media';
    const ext = media.ext || (media.isAudio ? 'mp3' : 'mp4');
    const filename = `${cleanTitle}.${ext}`;

    addToast(`Starting download for "${cleanTitle}"...`, 'info');

    // Directly open/trigger the API media URL
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = media.url;
    downloadAnchor.target = '_blank';
    downloadAnchor.rel = 'noopener noreferrer';
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      document.body.removeChild(downloadAnchor);
      setDownloadingId(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-100 relative z-10 bg-transparent">
      {/* Crisp Full-Screen Fixed Background Wallpaper */}
      <div className="bg-fixed-container">
        <img 
          src={BG_BASE64} 
          alt="" 
          aria-hidden="true"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Subtle dark tint so text is readable while wallpaper remains 100% crisp & vivid */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-purple-950/25 to-black/45 pointer-events-none" />
      </div>
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        recentCount={recentDownloads.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10 relative z-10">
        
        {/* Tab 1: Downloader Main UI */}
        {activeTab === 'home' && (
          <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-200">
            
            {/* Input Hero Banner - Primary Focus on Mobile */}
            <div className={`p-4 sm:p-10 relative overflow-hidden transition-colors duration-150 rounded-3xl ${
              isDarkMode 
                ? 'ios-glass' 
                : 'ios-glass-light shadow-2xl shadow-indigo-500/10'
            }`}>
              
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                
                {/* Logo & Headline */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <img 
                    src={LOGO_URL} 
                    alt="MediaDrop Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-lg border border-white/20"
                  />
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
                    Free Ultra-Fast HD Downloader
                  </span>
                </div>

                <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-heading leading-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Download High Quality <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Video & Audio Assets</span>
                </h1>

                <p className={`text-xs sm:text-base max-w-xl mx-auto ${
                  isDarkMode ? 'text-zinc-400' : 'text-slate-600'
                }`}>
                  Paste your link below and MediaDrop will fetch the best available quality for you in seconds.
                </p>

              </div>

              {/* Format Selection System (Video vs Audio) */}
              <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto p-1 rounded-2xl border bg-slate-900/60 border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedFormatMode('video')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    selectedFormatMode === 'video'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-4 h-4 text-indigo-300" />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormatMode('audio')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    selectedFormatMode === 'audio'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-4 h-4 text-purple-300" />
                  <span>Audio MP3</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormatMode('all')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    selectedFormatMode === 'all'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>All Formats</span>
                </button>
              </div>

              {/* Input Form Box - Mobile-First Responsive Layout */}
              <form onSubmit={handleFetchMedia} className="mt-4 sm:mt-6 w-full max-w-2xl mx-auto space-y-3">
                <div className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-2.5 ${
                  isDarkMode 
                    ? 'input-gradient shadow-xl' 
                    : 'bg-slate-50 border border-slate-300 focus-within:border-blue-600 shadow-lg'
                }`}>
                  {/* URL Input field row */}
                  <div className="flex items-center w-full flex-1 min-w-0">
                    <div className="pl-2 pr-2 text-zinc-400 flex-shrink-0">
                      <Link className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    </div>

                    <input
                      ref={urlInputRef}
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste video URL (YouTube, TikTok, FB, Insta...)"
                      className={`w-full py-2 px-1 bg-transparent text-xs sm:text-base font-medium outline-none truncate ${
                        isDarkMode ? 'text-white placeholder:text-zinc-500' : 'text-slate-900 placeholder:text-slate-400'
                      }`}
                      required
                    />

                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl('')}
                        className="px-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex-shrink-0"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Actions buttons row - Mobile-First Layout */}
                  <div className="flex items-center w-full sm:w-auto gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handlePaste}
                      className={`flex-1 sm:flex-none items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex ${
                        isDarkMode ? 'bg-white/10 text-zinc-300 hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl btn-primary text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>DOWNLOAD</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Animated Progress Bar */}
              {isLoading && (
                <div className="mt-8 max-w-2xl mx-auto space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-indigo-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      Analysing & Parsing Media Formats...
                    </span>
                    <span className="font-mono">{loadingProgress}%</span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-300 shimmer-bg"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </div>

            {/* Response Section */}
            {result && (
              <ResponseDisplay
                data={result}
                isDarkMode={isDarkMode}
                onDownloadFile={handleDownloadFile}
                downloadingId={downloadingId}
                initialFormatType={selectedFormatMode}
              />
            )}

            {/* Supported Sites Badge Grid with Real Authentic Platform Logos */}
            <div className={`rounded-3xl p-6 sm:p-8 border space-y-4 ${
              isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="text-center space-y-1">
                <h3 className={`text-lg font-bold font-heading ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Supported Social & Video Platforms
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  MediaDrop supports downloading MP4 & MP3 from popular video platforms globally
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs flex items-center gap-2.5 shadow-sm">
                  <YouTubeLogo className="w-5 h-5" />
                  <span>YouTube HD</span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs flex items-center gap-2.5 shadow-sm">
                  <FacebookLogo className="w-5 h-5" />
                  <span>Facebook</span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 font-bold text-xs flex items-center gap-2.5 shadow-sm">
                  <InstagramLogo className="w-5 h-5" />
                  <span>Instagram Reels</span>
                </div>
                <div className="px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-xs flex items-center gap-2.5 shadow-sm">
                  <TikTokLogo className="w-5 h-5" />
                  <span>TikTok (No Watermark)</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Recent History Tab View */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300 max-w-4xl mx-auto space-y-6">
            {recentDownloads.length > 0 ? (
              <RecentDownloads
                items={recentDownloads}
                isDarkMode={isDarkMode}
                onSelectUrl={handleSelectRecentUrl}
                onClearHistory={handleClearHistory}
                onRemoveItem={handleRemoveRecentItem}
              />
            ) : (
              <div className={`p-8 sm:p-12 text-center rounded-3xl border ${
                isDarkMode ? 'ios-glass text-white' : 'ios-glass-light text-slate-900 shadow-xl'
              }`}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2">No Download History Yet</h3>
                <p className={`text-sm max-w-md mx-auto mb-6 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Paste any video or audio link on the home page and fetch it to build your recent downloads history.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg hover:shadow-indigo-500/30 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Go to Downloader</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: About Section */}
        {activeTab === 'about' && (
          <AboutSection
            isDarkMode={isDarkMode}
          />
        )}

        {/* Tab 3: Dedicated Developer View - Clone of Developer XC */}
        {activeTab === 'developer' && (
          <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
            <DeveloperCard isDarkMode={isDarkMode} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-6 transition-colors relative z-20 ${
        isDarkMode ? 'bg-black/40 backdrop-blur-md border-white/10 text-slate-200' : 'bg-white/80 backdrop-blur-md border-slate-200 text-slate-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Logo" className="w-5 h-5 rounded-md object-cover shadow border border-white/20" />
            <span className="font-bold text-white tracking-wide">MediaDrop</span>
          </div>

          <p className="text-slate-300">© {new Date().getFullYear()} MediaDrop. All rights reserved.</p>
        </div>
      </footer>

      {/* Offline Indicator & Toast Notification Container */}
      <OfflineIndicator isDarkMode={isDarkMode} />
      <ToastContainer toasts={toasts} onDismiss={removeToast} isDarkMode={isDarkMode} />
    </div>
  );
}
