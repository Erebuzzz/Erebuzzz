import React from 'react';
import anime from 'animejs';
import { soundManager } from '../utils/audio';

interface FloatingDoodlesProps {
  theme: 'dark' | 'light';
}

export const FloatingDoodles: React.FC<FloatingDoodlesProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#ea580c' : '#c2410c';

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    anime({
      targets: e.currentTarget,
      rotate: [0, -12, 10, -5, 0],
      scale: [1, 1.15, 1.08],
      duration: 500,
      easing: 'easeOutElastic(1, .5)'
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    soundManager.playChime();
    anime({
      targets: e.currentTarget,
      scale: [1.2, 0.9, 1.05, 1],
      rotate: '+=360',
      duration: 650,
      easing: 'easeOutBack'
    });
  };

  const doodles = [
    {
      id: 'astrolabe-doodle',
      top: '14%',
      left: '2%',
      label: 'Astrolabe',
      content: (
        <svg viewBox="0 0 32 32" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-10 h-10">
          <circle cx="16" cy="16" r="13" strokeDasharray="3 3" />
          <circle cx="16" cy="16" r="8" />
          <line x1="16" y1="3" x2="16" y2="29" />
          <line x1="3" y1="16" x2="29" y2="16" />
          <circle cx="16" cy="16" r="2" fill={strokeColor} />
        </svg>
      )
    },
    {
      id: 'robot-servo',
      top: '38%',
      left: '3%',
      label: 'Actuator',
      content: (
        <svg viewBox="0 0 32 32" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-9 h-9">
          <rect x="6" y="8" width="20" height="16" rx="3" />
          <circle cx="16" cy="16" r="5" />
          <line x1="16" y1="4" x2="16" y2="8" />
          <line x1="20" y1="4" x2="20" y2="8" />
          <path d="M10 24v4M22 24v4" />
        </svg>
      )
    },
    {
      id: 'athena-owl-doodle',
      top: '64%',
      left: '2%',
      label: 'Athena Owl',
      content: (
        <svg viewBox="0 0 32 32" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-10 h-10">
          <circle cx="11" cy="12" r="4" />
          <circle cx="21" cy="12" r="4" />
          <circle cx="11" cy="12" r="1.5" fill={strokeColor} />
          <circle cx="21" cy="12" r="1.5" fill={strokeColor} />
          <path d="M16 14l-2 4h4z" />
          <path d="M8 20c3 3 13 3 16 0" />
          <path d="M5 10l5-4M27 10l-5-4" />
        </svg>
      )
    },
    {
      id: 'quant-delta',
      top: '22%',
      right: '2%',
      label: 'Convex Delta',
      content: (
        <svg viewBox="0 0 32 32" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-9 h-9">
          <polygon points="16,5 28,27 4,27" />
          <circle cx="16" cy="19" r="2" fill={strokeColor} />
          <line x1="16" y1="12" x2="16" y2="15" />
        </svg>
      )
    },
    {
      id: 'ember-fire',
      top: '52%',
      right: '3%',
      label: 'Erebus Ember',
      content: (
        <svg viewBox="0 0 32 32" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-10 h-10">
          <path d="M16 4c2 4 7 8 7 15a9 9 0 0 1-18 0c0-6 4-10 6-12 1 3 3 5 5 5-2-4 0-8 0-8z" />
          <circle cx="16" cy="22" r="2" fill={strokeColor} />
        </svg>
      )
    },
    {
      id: 'trojan-pegasus',
      top: '78%',
      right: '2%',
      label: 'Pegasus Core',
      content: (
        <svg viewBox="0 0 32 32" fill="none" stroke={strokeColor} strokeWidth="1.5" className="w-10 h-10">
          <path d="M6 24h16c3 0 5-3 5-6 0-4-3-6-6-6-2-4-7-6-11-4" />
          <path d="M12 14l6-8c2 3 5 4 8 4" />
          <path d="M8 24v4M18 24v4" />
        </svg>
      )
    }
  ];

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {doodles.map((d) => (
        <div
          key={d.id}
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          className="absolute cursor-pointer pointer-events-auto p-2 rounded-xl transition-all duration-300 opacity-75 hover:opacity-100 particle-trigger filter drop-shadow-sm hover:drop-shadow-md"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            backgroundColor: isDark ? 'rgba(17, 20, 27, 0.4)' : 'rgba(255, 255, 255, 0.4)',
            border: `1px dashed ${isDark ? 'rgba(234, 88, 12, 0.3)' : 'rgba(194, 65, 12, 0.3)'}`,
            backdropFilter: 'blur(4px)'
          }}
          title={`${d.label} (Interactive Doodle)`}
        >
          {d.content}
        </div>
      ))}
    </div>
  );
};
