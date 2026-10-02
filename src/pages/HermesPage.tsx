import React, { useState } from 'react';
import { Mail, ExternalLink, Copy, Check, Calendar, MessageSquare, Radio, Swords } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const HermesPage: React.FC = () => {
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedChess, setCopiedChess] = useState(false);

  const handleCopyDiscord = () => {
    soundManager.playClick();
    navigator.clipboard.writeText('erebus.0');
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const handleCopyChess = () => {
    soundManager.playClick();
    navigator.clipboard.writeText('sinha_zitihsk');
    setCopiedChess(true);
    setTimeout(() => setCopiedChess(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 pt-6">
      
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-dashed border-border pb-6">
        <div className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-ember-600 animate-pulse" />
          <span>Hermes Dispatch &middot; Signal Relay &amp; Scheduling</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-4xl text-text tracking-tight shimmer-text">
          Connect, Dispatch &amp; Schedule
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
          Book a 1-on-1 session directly via Cal.com, challenge to a strategic game on Chess.com, or reach out across frequencies for robotics collaboration, quant research, or system architecture.
        </p>
      </div>

      {/* Embedded Cal.com Quickmeet Scheduling Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ember-600 dark:text-ember-400" />
            <h2 className="font-display font-bold text-lg text-text">
              Cal.com Quickmeet Scheduler
            </h2>
          </div>

          <a
            href="https://cal.com/kksinha/quickmeet"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="px-3 py-1.5 rounded-md border border-border bg-surface font-mono text-xs text-text-muted hover:text-ember-600 dark:hover:text-ember-400 hover:border-ember-600 transition-colors flex items-center gap-1.5 particle-trigger"
          >
            <span>Open in Full Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Responsive Cal.com Iframe Embed Container */}
        <div className="liquid-glass-card rounded-xl border border-border overflow-hidden shadow-xl bg-surface-elevated">
          <div className="p-3 bg-surface border-b border-border flex items-center justify-between font-mono text-xs text-text-dim">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>cal.com/kksinha/quickmeet</span>
            </div>
            <span>15 &middot; 30 min sync</span>
          </div>

          <div className="w-full h-[620px] bg-bg relative">
            <iframe
              src="https://cal.com/kksinha/quickmeet?embed=true"
              title="Cal.com Quickmeet Scheduling"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Social & Communication Relays */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-ember-600 dark:text-ember-400" />
          <h2 className="font-display font-bold text-lg text-text">
            Social Frequencies &amp; Direct Relays
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Chess.com Tactician Challenge Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-amber-600/50 transition-colors bg-gradient-to-br from-amber-500/5 to-transparent">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Swords className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] text-emerald-500 font-semibold">Active &middot; Blitz &amp; Rapid</span>
              </div>
              <h3 className="font-display font-semibold text-base text-text">Chess.com</h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">sinha_zitihsk</p>
            </div>

            <div className="mt-4 pt-2 border-t border-border flex items-center justify-between gap-2">
              <button
                onClick={handleCopyChess}
                className="px-2 py-1 rounded border border-border bg-surface font-mono text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1"
                title="Copy username"
              >
                {copiedChess ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedChess ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href="https://www.chess.com/member/sinha_zitihsk"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded border border-border bg-ember-600/10 font-mono text-xs text-ember-600 dark:text-ember-400 hover:bg-ember-600 hover:text-white transition-colors flex items-center gap-1.5 particle-trigger"
              >
                <span>Play Game</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 2. Discord Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <a
                  href="https://discord.com/users/1206267175267074049"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-text-dim hover:text-ember-600 transition-colors flex items-center gap-1"
                >
                  <span>ID: 1206267175267074049</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <h3 className="font-display font-semibold text-base text-text">Discord</h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">Username: erebus.0</p>
            </div>

            <div className="mt-4 pt-2 border-t border-border flex items-center justify-between gap-2">
              <a
                href="https://discord.com/users/1206267175267074049"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded border border-border bg-surface font-mono text-xs text-text hover:border-ember-600 hover:text-ember-600 transition-colors flex items-center gap-1.5 particle-trigger"
              >
                <span>Open Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={handleCopyDiscord}
                className="px-2.5 py-1 rounded border border-border bg-surface font-mono text-xs text-text hover:border-ember-600 transition-colors flex items-center gap-1.5 particle-trigger"
                title="Copy username erebus.0"
              >
                {copiedDiscord ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy User</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. YouTube Music Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                    <path d="M10 10l5 2-5 2z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-text-dim">Streaming</span>
              </div>
              <h3 className="font-display font-semibold text-base text-text">YouTube Music</h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">@erebuzzz23</p>
            </div>

            <div className="mt-4 pt-2 border-t border-border flex items-center justify-between">
              <span className="font-mono text-xs text-text-dim">Music Profile</span>
              <a
                href="https://music.youtube.com/@erebuzzz23"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded border border-border bg-surface font-mono text-xs text-text hover:text-red-500 hover:border-red-500/50 transition-colors flex items-center gap-1.5 particle-trigger"
              >
                <span>Listen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 4. Instagram Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-text-dim">Visuals</span>
              </div>
              <h3 className="font-display font-semibold text-base text-text">Instagram</h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">@artem.enies</p>
            </div>

            <div className="mt-4 pt-2 border-t border-border flex items-center justify-between">
              <span className="font-mono text-xs text-text-dim">Feed</span>
              <a
                href="https://www.instagram.com/artem.enies"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded border border-border bg-surface font-mono text-xs text-text hover:text-pink-500 hover:border-pink-500/50 transition-colors flex items-center gap-1.5 particle-trigger"
              >
                <span>Visit</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 5. Reddit Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF4500]/10 text-[#FF4500] flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-text-dim">Discussions</span>
              </div>
              <h3 className="font-display font-semibold text-base text-text">Reddit</h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">u/SinhazitihsK69</p>
            </div>

            <div className="mt-4 pt-2 border-t border-border flex items-center justify-between">
              <span className="font-mono text-xs text-text-dim">Discussions</span>
              <a
                href="https://www.reddit.com/user/SinhazitihsK69"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded border border-border bg-surface font-mono text-xs text-text hover:text-[#FF4500] hover:border-[#FF4500]/50 transition-colors flex items-center gap-1.5 particle-trigger"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 6. GitHub Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/50 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-surface-elevated text-text border border-border flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-text-dim">Code</span>
              </div>
              <h3 className="font-display font-semibold text-base text-text">GitHub</h3>
              <p className="font-mono text-xs text-text-muted mt-0.5">@Erebuzzz</p>
            </div>

            <div className="mt-4 pt-2 border-t border-border flex items-center justify-between">
              <span className="font-mono text-xs text-text-dim">Repositories</span>
              <a
                href="https://github.com/Erebuzzz"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded border border-border bg-surface font-mono text-xs text-text hover:border-ember-600 transition-colors flex items-center gap-1.5 particle-trigger"
              >
                <span>Follow</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 7. Direct Email Card */}
          <div className="liquid-glass-card p-4 rounded-xl border border-border flex flex-col justify-between hover:border-ember-600/50 transition-colors sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-ember-500/10 text-ember-600 dark:text-ember-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider">Direct Dispatch</span>
                </div>
                <h3 className="font-display font-semibold text-base text-text">Email Inquiries</h3>
                <p className="font-mono text-xs text-text-muted mt-0.5">kshitiz23kumar@gmail.com</p>
              </div>

              <div>
                <a
                  href="mailto:kshitiz23kumar@gmail.com"
                  onClick={() => soundManager.playClick()}
                  className="px-4 py-2 rounded-lg bg-ember-600 hover:bg-ember-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-ember-600/20"
                >
                  <span>Compose Direct Message</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
