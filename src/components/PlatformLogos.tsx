import React from 'react';

interface LogoProps {
  className?: string;
}

export const YouTubeLogo: React.FC<LogoProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      fill="#FF0000"
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
  </svg>
);

export const FacebookLogo: React.FC<LogoProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="#1877F2"
    />
    <path
      d="M16.67 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.63H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"
      fill="#FFFFFF"
    />
  </svg>
);

export const InstagramLogo: React.FC<LogoProps> = ({ className = "w-5 h-5" }) => (
  <div className={`relative flex items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 ${className}`}>
    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  </div>
);

export const TikTokLogo: React.FC<LogoProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.85V7.6a6.34 6.34 0 0 0-5.15 6.2 6.34 6.34 0 1 0 11.49-3.69v-4.3a8.16 8.16 0 0 0 3.77 1.28V6.69z"
      fill="#25F4EE"
    />
    <path
      d="M16.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-1.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .56.04.82.12V9.2a6.34 6.34 0 1 0 6.29 6.33V8.81a8.16 8.16 0 0 0 3.77 1.28V6.69a4.83 4.83 0 0 1-2.77-.81z"
      fill="#FE2C55"
    />
    <path
      d="M12.37 2h.77a4.83 4.83 0 0 0 3.77 4.25v.43a4.83 4.83 0 0 1-3.77-4.25v-.43z"
      fill="#000000"
    />
  </svg>
);

export const PlatformBadge: React.FC<{ platform: string; className?: string }> = ({ platform, className = "w-5 h-5" }) => {
  const lower = platform.toLowerCase();
  if (lower.includes('youtube')) return <YouTubeLogo className={className} />;
  if (lower.includes('facebook') || lower.includes('fb')) return <FacebookLogo className={className} />;
  if (lower.includes('instagram')) return <InstagramLogo className={className} />;
  if (lower.includes('tiktok')) return <TikTokLogo className={className} />;
  return <YouTubeLogo className={className} />;
};
