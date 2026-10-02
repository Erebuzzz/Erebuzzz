import React from 'react';
import { Feather, BookOpen, Sparkles, Image as ImageIcon, Swords } from 'lucide-react';
import { ChessPuzzleWidget } from '../components/ChessPuzzleWidget';

interface MnemosynePageProps {
  theme?: 'dark' | 'light';
}

export const MnemosynePage: React.FC<MnemosynePageProps> = ({ theme = 'dark' }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-300 pt-6">
      
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-dashed border-border pb-6">
        <div className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Feather className="w-3.5 h-3.5" />
          <span>Mnemosyne &middot; Chamber of Memory &amp; The Muses</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-4xl text-text tracking-tight shimmer-text">
          Poetry, Artworks &amp; Tactical Mind
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
          A personal sanctuary for creative writing, algorithmic art, chess strategy, and reflective field notes bridging mathematical rigor with human intuition.
        </p>
      </div>

      {/* Interactive Chess Strategy Section: Ludus Strategicus */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-ember-600 dark:text-ember-400" />
          <h2 className="font-display font-bold text-lg text-text">
            Ludus Strategicus &middot; The Tactical Challenge
          </h2>
        </div>
        <ChessPuzzleWidget theme={theme} />
      </section>

      {/* Parchment Inscription Showcase */}
      <div className="relative p-6 sm:p-10 rounded-xl border border-dashed border-border bg-surface-elevated shadow-lg text-center overflow-hidden">
        
        {/* Decorative corner embellishments */}
        <div className="absolute top-3 left-3 text-ember-600/40 font-mono text-xs">&#10022;</div>
        <div className="absolute top-3 right-3 text-ember-600/40 font-mono text-xs">&#10022;</div>
        <div className="absolute bottom-3 left-3 text-ember-600/40 font-mono text-xs">&#10022;</div>
        <div className="absolute bottom-3 right-3 text-ember-600/40 font-mono text-xs">&#10022;</div>

        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-ember-600/40 bg-ember-500/10 flex items-center justify-center text-ember-600 dark:text-ember-400 shadow-inner">
            <Feather className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-text">
              The Folios are Being Inscribed
            </h2>
            <p className="font-mono text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
              This space will host my original poetry, generative artworks, and essays on robotics, control stacks, and mathematical philosophy.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-text-dim">
            <Sparkles className="w-3.5 h-3.5 text-ember-600" />
            <span>Archive Status: Awaiting First Transcription</span>
          </div>
        </div>

      </div>

      {/* Planned Sections Previews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* Chamber 1: Poetry */}
        <div className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between hover:border-ember-600/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 text-ember-600">
              <Feather className="w-5 h-5" />
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-dim">
                Verse
              </span>
            </div>
            <h3 className="font-display font-semibold text-base text-text mb-1">
              Poetry &amp; Starlight
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Meditations on the boundary between order and entropy, mathematics arguing with the silence of midnight.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-border font-mono text-[11px] text-text-dim">
            0 Verses Published
          </div>
        </div>

        {/* Chamber 2: Artworks */}
        <div className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between hover:border-ember-600/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 text-cyan-500">
              <ImageIcon className="w-5 h-5" />
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-dim">
                Visual
              </span>
            </div>
            <h3 className="font-display font-semibold text-base text-text mb-1">
              Digital Art &amp; Sketches
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Geometric vector compositions, dynamic shaders, and visual interpretations of Greek primordial deities.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-border font-mono text-[11px] text-text-dim">
            0 Folios Inscribed
          </div>
        </div>

        {/* Chamber 3: Essays */}
        <div className="p-5 rounded-lg border border-border bg-surface flex flex-col justify-between hover:border-ember-600/40 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 text-emerald-500">
              <BookOpen className="w-5 h-5" />
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-dim">
                Essays
              </span>
            </div>
            <h3 className="font-display font-semibold text-base text-text mb-1">
              Field Notes on Autonomy
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Long-form engineering deep-dives, control theory derivations, and reflections on building robotics at student budgets.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-border font-mono text-[11px] text-text-dim">
            0 Scrolls Transcribed
          </div>
        </div>

      </div>

    </div>
  );
};
