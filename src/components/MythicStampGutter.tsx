import React from 'react';

interface MythicStampGutterProps {
  side: 'left' | 'right';
  theme: 'dark' | 'light';
}

export const MythicStampGutter: React.FC<MythicStampGutterProps> = ({ side, theme }) => {
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#ea580c' : '#c2410c';
  const bgColor = isDark ? 'rgba(234, 88, 12, 0.04)' : 'rgba(194, 65, 12, 0.06)';
  const borderColor = isDark ? 'rgba(234, 88, 12, 0.22)' : 'rgba(194, 65, 12, 0.25)';

  const stamps = [
    // 1. Owl of Athena (Wisdom & Analysis)
    {
      name: 'Athena Owl',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <circle cx="9" cy="9" r="3" />
          <circle cx="15" cy="9" r="3" />
          <path d="M12 11v3" />
          <path d="M7 16c2 1.5 8 1.5 10 0" />
          <path d="M9 19c1.5 1 4.5 1 6 0" />
          <path d="M4 8l3-3 2 2M20 8l-3-3-2 2" />
        </svg>
      )
    },
    // 2. Pegasus Wing (Ascent & Speed)
    {
      name: 'Pegasus Wing',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <path d="M3 17c3-1 6-4 8-8 1.5-3 4-5 8-5-1 3-2 6-4 8-3 3-7 5-12 5z" />
          <path d="M6 14c2.5-1 5-3.5 7-7" />
          <path d="M9 16c2-1 4-2.5 5.5-5" />
        </svg>
      )
    },
    // 3. Corinthian Column (Architecture & Structure)
    {
      name: 'Greek Column',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <line x1="4" y1="4" x2="20" y2="4" />
          <line x1="6" y1="7" x2="18" y2="7" />
          <line x1="8" y1="7" x2="8" y2="19" />
          <line x1="12" y1="7" x2="12" y2="19" />
          <line x1="16" y1="7" x2="16" y2="19" />
          <line x1="6" y1="19" x2="18" y2="19" />
          <line x1="4" y1="21" x2="20" y2="21" />
        </svg>
      )
    },
    // 4. Spartan Shield (Lambda - Defense & Security)
    {
      name: 'Spartan Shield',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 17l4-9 4 9" />
        </svg>
      )
    },
    // 5. Apollo's Lyre (Harmonics & Math)
    {
      name: 'Apollo Lyre',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <path d="M7 6c0 6 2 11 5 11s5-5 5-11" />
          <line x1="6" y1="5" x2="18" y2="5" />
          <line x1="10" y1="5" x2="10" y2="17" />
          <line x1="14" y1="5" x2="14" y2="17" />
          <path d="M5 8c0 0 1-2 2-2M19 8c0 0-1-2-2-2" />
        </svg>
      )
    },
    // 6. Hermes Winged Sandal (Relays & Protocols)
    {
      name: 'Hermes Sandal',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <path d="M4 18h12c2 0 4-2 4-4s-2-3-4-3h-4" />
          <path d="M8 11l4-6c1 2 3 3 5 3" />
          <path d="M6 14l3-4" />
          <line x1="4" y1="18" x2="4" y2="20" />
          <line x1="16" y1="18" x2="16" y2="20" />
        </svg>
      )
    },
    // 7. Greek Amphora (The Vessel of Data)
    {
      name: 'Greek Amphora',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <path d="M9 3h6v2H9z" />
          <path d="M8 5c0 4 8 4 8 0" />
          <path d="M7 7c-2 2-2 5 0 7l1 4h8l1-4c2-2 2-5 0-7" />
          <path d="M5 8c-2 1-2 4 0 5M19 8c2 1 2 4 0 5" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      )
    },
    // 8. Laurel Wreath (Honors & Benchmark Alphas)
    {
      name: 'Laurel Wreath',
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-5 h-5">
          <path d="M6 18c-2-3-2-7 0-11 2 2 3 5 2 8" />
          <path d="M18 18c2-3 2-7 0-11-2 2-3 5-2 8" />
          <path d="M8 7c-1-2-1-3 0-4 1 1 2 2 1 3" />
          <path d="M16 7c1-2 1-3 0-4-1 1-2 2-1 3" />
          <path d="M10 20c1 1 3 1 4 0" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`hidden xl:flex flex-col gap-4 fixed top-20 ${
        side === 'left' ? 'left-3' : 'right-3'
      } z-20 pointer-events-none select-none`}
      aria-hidden="true"
    >
      {stamps.map((stamp, idx) => (
        <div
          key={idx}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
          style={{
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 0 4px rgba(234, 88, 12, 0.1)'
              : '0 2px 8px rgba(194, 65, 12, 0.08), inset 0 0 4px rgba(255, 255, 255, 0.5)'
          }}
          title={stamp.name}
        >
          {stamp.svg}
        </div>
      ))}
    </aside>
  );
};
