import React from 'react';

// All icons are original hand-drawn line art (stroke = currentColor).
type P = { size?: number; className?: string };

const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const Icon: React.FC<{ name: string; size?: number; className?: string }> = ({
  name,
  size = 22,
  className,
}) => {
  const p = base(size);
  switch (name) {
    case 'home':
      return (
        <svg {...p} className={className}>
          <path d="M4 11l8-7 8 7" />
          <path d="M6 10v9h12v-9" />
        </svg>
      );
    case 'list':
      return (
        <svg {...p} className={className}>
          <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      );
    case 'prev':
      return (
        <svg {...p} className={className}>
          <path d="M14 6l-6 6 6 6" />
        </svg>
      );
    case 'next':
      return (
        <svg {...p} className={className}>
          <path d="M10 6l6 6-6 6" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...p} className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );
    case 'history':
      return (
        <svg {...p} className={className}>
          <path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.5" />
          <path d="M3 4v3.5h3.5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'play':
      return (
        <svg {...p} className={className}>
          <path d="M7 5l12 7-12 7z" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...p} className={className}>
          <path d="M9 5v14M15 5v14" />
        </svg>
      );
    case 'reset':
      return (
        <svg {...p} className={className}>
          <path d="M4 4v6h6" />
          <path d="M4 10a8 8 0 113 7.5" />
        </svg>
      );
    case 'close':
      return (
        <svg {...p} className={className}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...p} className={className}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 018 0v3" />
        </svg>
      );
    case 'star':
      return (
        <svg {...p} className={className}>
          <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...p} className={className}>
          <path d="M12 20s-7-4.5-7-9a4 4 0 017-2 4 4 0 017 2c0 4.5-7 9-7 9z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...p} className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...p} className={className}>
          <path d="M5 4h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
        </svg>
      );
    case 'door':
      return (
        <svg {...p} className={className}>
          <rect x="6" y="3" width="12" height="18" rx="1" />
          <circle cx="15" cy="12" r="1" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...p} className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...p} className={className}>
          <path d="M4 5h16v11H9l-5 4z" />
        </svg>
      );
    case 'observer':
      return (
        <svg {...p} className={className}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8" />
          <path d="M9 10l2 2-2 2M13 14h3" />
        </svg>
      );
    case 'mic':
      return (
        <svg {...p} className={className}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0014 0M12 18v3" />
        </svg>
      );
    case 'note':
      return (
        <svg {...p} className={className}>
          <path d="M5 3h14v14l-5 4H5z" />
          <path d="M14 21v-4h5" />
        </svg>
      );
    case 'forum':
      return (
        <svg {...p} className={className}>
          <path d="M4 5h16v10H8l-4 4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    case 'video':
      return (
        <svg {...p} className={className}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3z" />
        </svg>
      );
    case 'image':
      return (
        <svg {...p} className={className}>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M5 17l5-4 4 3 3-2 2 2" />
        </svg>
      );
    case 'record':
      return (
        <svg {...p} className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
    case 'card':
      return (
        <svg {...p} className={className}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case 'stamp':
      return (
        <svg {...p} className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      );
    case 'key':
      return (
        <svg {...p} className={className}>
          <circle cx="8" cy="8" r="4" />
          <path d="M11 11l8 8M16 16l2-2M18 18l2-2" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...p} className={className}>
          <path d="M6 16V11a6 6 0 1112 0v5l2 2H4z" />
          <path d="M10 20a2 2 0 004 0" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...p} className={className}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...p} className={className}>
          <path d="M20 14a8 8 0 11-9-11 6 6 0 009 11z" />
        </svg>
      );
    case 'route':
      return (
        <svg {...p} className={className}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M6 8v6a4 4 0 004 4h8" />
        </svg>
      );
    case 'flower':
      return (
        <svg {...p} className={className}>
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 5c1 2 1 3 0 4M12 15c-1 2-1 3 0 4M5 12c2 1 3 1 4 0M19 12c-2 1-3 1-4 0" />
        </svg>
      );
    case 'tape':
      return (
        <svg {...p} className={className}>
          <rect x="3" y="9" width="18" height="6" rx="1" transform="rotate(-6 12 12)" />
        </svg>
      );
    default:
      return (
        <svg {...p} className={className}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
};

export default Icon;
