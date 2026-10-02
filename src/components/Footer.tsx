import React, { useState, useEffect } from 'react';
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const Footer: React.FC = () => {
  const [timeStr, setTimeStr] = useState({ ist: '', utc: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr({
        ist: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }),
        utc: now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full border-t border-dashed border-border mt-16 py-12 bg-bg-sunken/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Quote & Mythic Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-ember-600 dark:text-ember-500 font-semibold tracking-wider uppercase mb-1">
              Primordial Horizon Axiom
            </div>
            <p className="font-display font-medium text-base sm:text-lg text-text italic">
              &ldquo;I break things, automate the cleanup, then pretend it was all part of the plan.&rdquo;
            </p>
          </div>

          {/* Time Telemetry */}
          <div className="font-mono text-xs text-text-muted flex items-center gap-4 bg-surface px-3 py-2 rounded-lg border border-border">
            <div>
              <span className="text-text-dim">IST:</span> <span className="text-text font-semibold">{timeStr.ist || '--:--:--'}</span>
            </div>
            <div className="text-border">|</div>
            <div>
              <span className="text-text-dim">UTC:</span> <span className="text-ember-600 dark:text-ember-400 font-semibold">{timeStr.utc || '--:--:--'}</span>
            </div>
          </div>
        </div>

        {/* Links and Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border font-mono text-xs text-text-muted">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/Erebuzzz"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="hover:text-ember-600 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://x.com/erebuzzz"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="hover:text-ember-600 transition-colors flex items-center gap-1"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X (Twitter)</span>
            </a>
            <a
              href="https://unstable-kernel.github.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="hover:text-ember-600 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Unstable Kernel Docs</span>
            </a>
            <a
              href="mailto:kshitiz23kumar@gmail.com"
              onClick={() => soundManager.playClick()}
              className="hover:text-ember-600 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>kshitiz23kumar@gmail.com</span>
            </a>
          </div>

          <div className="text-[11px] text-text-dim">
            Erebuzzz &middot; Kshitiz Kumar Sinha &copy; 2026. Custom Three.js + Anime.js + Tailwind engine.
          </div>
        </div>

      </div>
    </footer>
  );
};
