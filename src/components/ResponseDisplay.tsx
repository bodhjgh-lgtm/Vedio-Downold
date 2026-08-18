import React, { useState } from 'react';
import { MediaResult, MediaFormat } from '../types';
import { Download, Film, Music, Clock, Play, Pause, ExternalLink, Copy, Check, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { PlatformBadge } from './PlatformLogos';

interface ResponseDisplayProps {
  data: MediaResult;
  isDarkMode: boolean;
  onDownloadFile: (media: MediaFormat, title: string) => void;
  downloadingId: string | null;
  initialFormatType?: 'video' | 'audio' | 'all';
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  data,
  isDarkMode,
  onDownloadFile,
  downloadingId,
  initialFormatType = 'video'
}) => {
  // Default to showing interactive video preview directly when results load
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'audio' | 'all'>(initialFormatType);

  const videoFormats = data.medias.filter(m => !m.isAudio && m.type !== 'audio');
  const audioFormats = data.medias.filter(m => m.isAudio || m.type === 'audio');

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDuration = (sec: number) => {
    if (!sec) return 'N/A';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Extract YouTube ID if available
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = extractYoutubeId(data.originalUrl);
  const firstVideoStreamUrl = videoFormats[0]?.url || data.medias[0]?.url || '';

  return (
    <div className={`p-4 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isDarkMode 
        ? 'glass shadow-2xl' 
        : 'bg-white border border-slate-200 shadow-xl rounded-2xl sm:rounded-3xl'
    }`}>
      
      {/* Video Preview & Info Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Interactive Video Player / Thumbnail Preview */}
        <div className="relative w-full md:w-80 h-52 sm:h-56 rounded-2xl overflow-hidden flex-shrink-0 group border border-slate-700/50 shadow-lg bg-black flex items-center justify-center">
          
          {isPlayingPreview ? (
            youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={data.title}
                className="w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : firstVideoStreamUrl ? (
              <video
                src={firstVideoStreamUrl}
                controls
                autoPlay
                poster={data.thumbnail}
                className="w-full h-full object-contain bg-black rounded-2xl"
              />
            ) : (
              <div className="text-white text-xs p-4 text-center">Preview not streamable directly</div>
            )
          ) : (
            <>
              <img 
                src={data.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'} 
                alt={data.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Play Video Preview Overlay Button */}
              <button
                onClick={() => setIsPlayingPreview(true)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-all duration-200 group-hover:bg-indigo-500"
                aria-label="Play Video Preview"
              >
                <Play className="w-6 h-6 ml-0.5 fill-white" />
              </button>

              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/20 shadow-md">
                <PlatformBadge platform={data.platform} className="w-4 h-4" />
                <span>{data.platform}</span>
              </div>

              {data.duration > 0 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/90 text-white font-mono text-xs font-medium flex items-center gap-1.5 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{formatDuration(data.duration)}</span>
                </div>
              )}
            </>
          )}

        </div>

        {/* Video Title & Stream Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for HD Download
            </span>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              • {data.medias.length} Formats Available
            </span>
          </div>

          <h3 className={`text-xl sm:text-2xl font-bold line-clamp-2 leading-snug ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {data.title}
          </h3>

          <div className={`p-3 rounded-xl flex flex-wrap items-center gap-4 text-xs ${
            isDarkMode ? 'bg-slate-800/60 text-slate-300 border border-slate-700/50' : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>High Speed Stream Proxy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Original Lossless Quality</span>
            </div>
          </div>

          <div className="pt-1">
            {isPlayingPreview ? (
              <button
                onClick={() => setIsPlayingPreview(false)}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80 text-xs font-bold flex items-center gap-2 transition-all duration-150"
              >
                <Pause className="w-3.5 h-3.5 fill-slate-300" />
                <span>Show Thumbnail Image</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPlayingPreview(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-bold flex items-center gap-2 transition-all duration-150"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-400" />
                <span>Watch Video Preview Directly</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Format Selector Tabs & Download Links */}
      <div className="space-y-6 pt-4 border-t border-slate-800/50">
        
        {/* Interactive Format Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Download Format:
            </span>
          </div>

          <div className={`p-1 rounded-2xl flex items-center gap-1 border w-full sm:w-auto ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-200/80 border-slate-300'
          }`}>
            <button
              onClick={() => setActiveMediaTab('video')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                activeMediaTab === 'video'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Video ({videoFormats.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('audio')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                activeMediaTab === 'audio'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Audio MP3 ({audioFormats.length})</span>
            </button>

            <button
              onClick={() => setActiveMediaTab('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                activeMediaTab === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>All ({data.medias.length})</span>
            </button>
          </div>
        </div>
        
        {/* Video Formats Section */}
        {(activeMediaTab === 'video' || activeMediaTab === 'all') && videoFormats.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-indigo-400">
              <Film className="w-4 h-4" />
              <span>Video Links ({videoFormats.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {videoFormats.map((m, idx) => (
                <div 
                  key={m.id || `video_${idx}`}
                  className={`p-4 rounded-2xl flex flex-col justify-between gap-3 border transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-indigo-500/50' 
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-indigo-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base font-heading text-indigo-400">
                      {m.label || m.quality || `Video ${idx + 1}`}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold ${
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.ext || 'MP4'}
                    </span>
                  </div>

                  <div className={`text-xs space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {m.width && m.height ? (
                      <p>Resolution: {m.width}x{m.height} ({m.fps ? `${m.fps} FPS` : 'HD'})</p>
                    ) : (
                      <p>Quality: {m.quality || m.label}</p>
                    )}
                    {m.formattedSize && (
                      <p>Size: {m.formattedSize}</p>
                    )}
                    {m.bitrate && (
                      <p>Bitrate: {Math.round(m.bitrate / 1000)} kbps</p>
                    )}
                  </div>

                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/20 active:scale-95 transition-all duration-150"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {m.label || m.quality}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Formats Section */}
        {(activeMediaTab === 'audio' || activeMediaTab === 'all') && audioFormats.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-purple-400">
              <Music className="w-4 h-4" />
              <span>Audio Links ({audioFormats.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {audioFormats.map((m, idx) => (
                <div 
                  key={m.id || `audio_${idx}`}
                  className={`p-4 rounded-2xl flex flex-col justify-between gap-3 border transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-purple-500/50' 
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-purple-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base font-heading text-purple-400">
                      {m.label || m.quality || `Audio Track ${idx + 1}`}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold ${
                      isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.ext || 'MP3'}
                    </span>
                  </div>

                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    High Quality Audio Stream
                  </p>

                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/20 active:scale-95 transition-all duration-150"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {m.label || m.quality || 'Audio'}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state fallback if user selected audio tab but no audio links available */}
        {activeMediaTab === 'audio' && audioFormats.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No audio-only streams were returned by the API for this video.
          </div>
        )}

        {/* Empty state fallback if user selected video tab but no video links available */}
        {activeMediaTab === 'video' && videoFormats.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No video streams were returned by the API for this link.
          </div>
        )}

      </div>

    </div>
  );
};
