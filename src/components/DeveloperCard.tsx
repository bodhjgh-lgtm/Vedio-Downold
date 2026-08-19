import React from 'react';
import { DEVELOPER_DETAILS } from '../types';
import { ExternalLink, MessageSquare } from 'lucide-react';

// Official Authentic Telegram Circle Logo
export const TelegramPlaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37097 0 0 5.37097 0 12C0 18.629 5.37097 24 12 24C18.629 24 24 18.629 24 12C24 5.37097 18.629 0 12 0ZM17.8935 8.21935L15.9323 17.4645C15.7839 18.121 15.3935 18.2823 14.8452 17.9742L11.8548 15.771L10.4129 17.1581C10.2532 17.3177 10.1194 17.4516 9.8129 17.4516L10.0258 14.4194L15.5484 9.43548C15.7887 9.22258 15.4952 9.10323 15.1742 9.31613L8.35161 13.6065L5.4129 12.6871C4.77419 12.4871 4.76129 12.0484 5.53871 11.7452L17.0097 7.32258C17.5419 7.12903 18.0065 7.44839 17.8935 8.21935Z" />
  </svg>
);

interface DeveloperCardProps {
  isDarkMode?: boolean;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = () => {
  return (
    <div className="space-y-6 max-w-xl mx-auto font-sans">
      
      {/* 1. Main Hero Developer XC Card (Pixel-perfect clone) */}
      <div className="p-8 sm:p-10 rounded-3xl relative overflow-hidden transition-all duration-300 border border-[#28a8ea]/30 bg-[#0c1427] flex flex-col items-center text-center shadow-2xl">
        {/* Glow Radial Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#28a8ea]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Soaring Animated Telegram Paper Planes Flying Across like Airplanes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <TelegramPlaneIcon className="w-14 h-14 text-[#28a8ea]/60 absolute telegram-fly-soar-1 filter drop-shadow-[0_0_8px_rgba(40,168,234,0.8)]" />
          <TelegramPlaneIcon className="w-10 h-10 text-[#a855f7]/70 absolute telegram-fly-soar-2 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          <TelegramPlaneIcon className="w-12 h-12 text-[#3b82f6]/65 absolute telegram-fly-soar-3 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          
          <TelegramPlaneIcon className="w-8 h-8 text-[#28a8ea]/30 absolute top-4 left-6 telegram-plane-anim-1" />
          <TelegramPlaneIcon className="w-10 h-10 text-[#a855f7]/35 absolute bottom-8 right-6 telegram-plane-anim-2" />
        </div>

        {/* Profile Picture with Glowing Cyan-Purple Animated Telegram Border Ring */}
        <div className="relative mb-6 group">
          {/* Animated Floating Telegram Plane behind avatar border */}
          <div className="absolute -top-3 -right-3 z-10 p-1.5 rounded-full bg-[#28a8ea] text-white shadow-lg shadow-[#28a8ea]/50 animate-bounce">
            <TelegramPlaneIcon className="w-4 h-4 text-white" />
          </div>

          <div className="p-1 rounded-full bg-gradient-to-tr from-[#a855f7] via-[#28a8ea] to-[#3b82f6] telegram-border-glow">
            <img 
              src={DEVELOPER_DETAILS.profilePic} 
              alt={DEVELOPER_DETAILS.name} 
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#0c1427] relative z-0"
            />
          </div>
        </div>

        {/* Developer Name & Twitter Verified Blue Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-heading">
            𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 <span className="text-white font-black">{DEVELOPER_DETAILS.name}</span>
          </h2>
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.45-1.53.02-3.2-1.125-4.34-1.14-1.145-2.81-1.575-4.34-1.125C14.24 2.17 12.87 1.3 11.29 1.3c-1.58 0-2.95.87-3.6 2.14-1.53-.45-3.2-.02-4.34 1.125-1.145 1.14-1.575 2.81-1.125 4.34C1.3 9.55.43 10.92.43 12.5c0 1.58.87 2.95 2.148 3.6-.45 1.53-.02 3.2 1.125 4.34 1.14 1.145 2.81 1.575 4.34 1.125.65 1.27 2.02 2.14 3.6 2.14 1.58 0 2.95-.87 3.6-2.14 1.53.45 3.2.02 4.34-1.125 1.145-1.14 1.575-2.81 1.125-4.34 1.273-.65 2.148-2.02 2.148-3.6z" fill="#1d9bf0" />
            <path d="M10.75 16.75l-4.25-4.25 1.41-1.41 2.84 2.83 6.84-6.83 1.41 1.41-8.25 8.25z" fill="white" />
          </svg>
        </div>

        {/* Contact Buttons */}
        <div className="w-full max-w-sm space-y-3.5">
          {/* Cyan Pill Button: Contact Developer */}
          <a
            href={DEVELOPER_DETAILS.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#28a8ea] hover:bg-[#1f96d3] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-[#28a8ea]/25 transition-all duration-200 active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <TelegramPlaneIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑</span>
              <span className="text-sm font-black">𝐓.𝐦𝐞/𝐨𝐫𝐯𝐢𝐗𝐱𝐱𝐱</span>
            </div>
          </a>

          {/* Dark Pill Button: Developer Channel */}
          <a
            href={DEVELOPER_DETAILS.telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#080d1a] border border-[#1e3a5f] hover:border-[#28a8ea] text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                <TelegramPlaneIcon className="w-4 h-4 text-[#28a8ea]" />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#28a8ea]">𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 𝐂𝐇𝐀𝐍𝐍𝐄𝐋</span>
                <span className="text-sm font-black text-white">𝐭𝐞𝐜𝐡_𝐦𝐚𝐬𝐭𝐞𝐫_𝐚𝟐𝐳</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-[#28a8ea]" />
          </a>
        </div>

      </div>


      {/* 2. Official Tech Master A2Z Telegram Channel Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-[#0c1427] space-y-5 transition-all duration-300 shadow-xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#28a8ea] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <TelegramPlaneIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-heading">𝐓𝐞𝐜𝐡 𝐌𝐚𝐬𝐭𝐞𝐫 𝐀𝟐𝐙</h3>
              <a 
                href={DEVELOPER_DETAILS.telegramChannel} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#28a8ea] hover:underline"
              >
                https://t.me/tech_master_a2z
              </a>
            </div>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[#132742] border border-[#28a8ea]/30 text-[#28a8ea] font-extrabold text-[10px] tracking-wider uppercase">
            𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 𝐂𝐇𝐀𝐍𝐍𝐄𝐋
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          Join the official <strong className="text-white">Tech Master A2Z</strong> Telegram Channel to get access to custom scripts, API proxy code snippets, Web Application source code, and tech updates maintained by <strong className="text-white">Developer X C</strong>.
        </p>

        <a
          href={DEVELOPER_DETAILS.telegramChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#28a8ea] to-[#1e88e5] hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#28a8ea]/25 transition-all duration-200 active:scale-95"
        >
          <TelegramPlaneIcon className="w-4 h-4 text-white" />
          <span>𝐉𝐨𝐢𝐧 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 𝐍𝐨𝐰</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>


      {/* 3. Direct Telegram Support Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-[#0c1427] space-y-5 transition-all duration-300 shadow-xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1a182d] border border-purple-500/20 flex items-center justify-center text-[#a855f7] flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-[#a855f7]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">𝐃𝐢𝐫𝐞𝐜𝐭 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 𝐒𝐮𝐩𝐩𝐨𝐫𝐭</h3>
              <p className="text-xs font-bold text-[#c084fc]">@orviXxxx</p>
            </div>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[#27153b] border border-purple-500/30 text-[#c084fc] font-extrabold text-[10px] tracking-wider uppercase">
            𝟐𝟒/𝟕 𝐂𝐎𝐍𝐓𝐀𝐂𝐓
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
          Have custom project requirements, web applications, API backend needs, or bot development? Contact developer <strong className="text-white">X C</strong> directly on Telegram for instant collaboration.
        </p>

        <a
          href={DEVELOPER_DETAILS.contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7e22ce] via-[#9333ea] to-[#a855f7] hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all duration-200 active:scale-95"
        >
          <TelegramPlaneIcon className="w-4 h-4 text-white" />
          <span>𝐒𝐞𝐧𝐝 𝐌𝐞𝐬𝐬𝐚𝐠𝐞: 𝐓.𝐦𝐞/𝐨𝐫𝐯𝐢𝐗𝐱𝐱𝐱</span>
        </a>
      </div>

    </div>
  );
};
