

interface SeagrassLogoProps {
  variant?: "icon" | "full" | "monochrome";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export function SeagrassLogo({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = true,
}: SeagrassLogoProps) {
  const pixelSizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const dim = pixelSizes[size] || 40;

  // Standalone vector SVG emblem
  const LogoMark = (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        {/* Coastal Marine Teal Gradient */}
        <linearGradient id="bladeGradPrimary" x1="20%" y1="100%" x2="80%" y2="0%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        {/* Emerald Aqua Blade Gradient */}
        <linearGradient id="bladeGradSecondary" x1="10%" y1="100%" x2="90%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        {/* Ocean Wave Crest Gradient */}
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>

        {/* Soft Container Glow Gradient */}
        <linearGradient id="backdropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0fdfa" />
          <stop offset="100%" stopColor="#ccfbf1" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Backdrop */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="26"
        fill="url(#backdropGrad)"
        stroke="#99f6e4"
        strokeWidth="2"
      />

      {/* Secondary Blade (Slightly curved rear ribbon) */}
      <path
        d="M52 78 C56 60 67 42 77 28 C68 44 60 62 56 78 Z"
        fill="url(#bladeGradSecondary)"
        opacity="0.9"
      />

      {/* Primary Tapering Seagrass Blade (Central upright) */}
      <path
        d="M44 80 C40 56 46 32 58 14 C54 36 49 60 46 80 Z"
        fill="url(#bladeGradPrimary)"
      />

      {/* Tertiary Left Blade (Graceful outward bend) */}
      <path
        d="M42 80 C36 64 29 48 23 38 C31 49 37 65 42 80 Z"
        fill="url(#bladeGradPrimary)"
        opacity="0.75"
      />

      {/* Flowing Coastal Ocean Wave Swell */}
      <path
        d="M14 74 C26 66 38 78 54 71 C68 65 80 73 90 68 C86 79 72 85 54 85 C36 85 22 81 14 74 Z"
        fill="url(#waveGrad)"
      />

      {/* Micro Wave Highlight Line */}
      <path
        d="M18 73 C30 67 42 77 56 71 C68 66 79 73 86 69"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Marine Water Droplet Accent */}
      <circle cx="68" cy="20" r="3" fill="#06b6d4" opacity="0.85" />
    </svg>
  );

  if (variant === "icon") {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoMark}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            SEAGRASS
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 rounded-md">
            AI
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
            Specs &amp; Wave Attenuation
          </span>
        )}
      </div>
    </div>
  );
}
