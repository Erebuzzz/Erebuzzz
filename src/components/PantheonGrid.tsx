import React, { useState } from 'react';
import { PROJECTS } from '../data/projects';
import { soundManager } from '../utils/audio';

interface PantheonGridProps {
  onSelectProject: (id: string) => void;
  onUnlockBadge: (id: string, label: string) => void;
}

export const PantheonGrid: React.FC<PantheonGridProps> = ({
  onSelectProject,
  onUnlockBadge
}) => {
  const [filter, setFilter] = useState<'all' | 'flagship' | 'robotics' | 'security' | 'quant'>('all');
  const [search, setSearch] = useState('');

  const filteredProjects = PROJECTS.filter((p) => {
    const matchesFilter = filter === 'all' || p.categories.includes(filter);
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)) ||
      p.mythicCodename.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section className="pt-10 sm:pt-12" id="builds">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold mb-1">
              Pantheon Constellation Matrix
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text tracking-tight shimmer-text">
              Architectures, Control Loops &amp; Compilers
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Production systems, robotics control loops, security compilers, and quantitative research models.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              id="project-search"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tech, myth, or tag..."
              className="w-full bg-surface border border-border px-3 py-2 rounded-md font-mono text-xs text-text outline-none focus:border-ember-600 transition-colors"
            />
          </div>
        </div>

        {/* Horizontally Scrollable Filter Tabs (Mobile-Friendly) */}
        <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Constellations' },
            { id: 'flagship', label: 'Flagships' },
            { id: 'robotics', label: 'Robotics & Control' },
            { id: 'security', label: 'Security & AST' },
            { id: 'quant', label: 'Quant & Protocols' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setFilter(tab.id as typeof filter);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md font-mono text-xs transition-all particle-trigger ${
                filter === tab.id
                  ? 'bg-surface-elevated text-text border border-ember-600 shadow-[0_0_10px_rgba(234,88,12,0.2)]'
                  : 'bg-surface text-text-muted border border-border hover:border-ember-600/50 hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Bento Grid (1 col on mobile, 2 col on tablet, 3 col on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const isFeatured = p.categories.includes('flagship');

          return (
            <article
              key={p.id}
              onMouseMove={handleMouseMove}
              className={`liquid-glass-card p-5 rounded-xl flex flex-col justify-between ${
                isFeatured ? 'border-beam-card' : ''
              }`}
            >
              <div>
                {/* Card Top Meta */}
                <div className="flex justify-between items-center mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono border border-ember-600/30 text-ember-600 dark:text-ember-400 bg-ember-500/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-ember-600 dark:bg-ember-400"></span>
                    {p.mythicCodename}
                  </span>
                  {p.metric && (
                    <span className="font-mono text-[11px] sm:text-xs text-text-dim">
                      {p.metric}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-base sm:text-lg text-text mb-1 tracking-tight">
                  {p.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4 min-h-[3.5rem] sm:min-h-[4rem]">
                  {p.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono bg-surface-elevated border border-border text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Released Packages */}
              <div className="pt-3 border-t border-border flex flex-wrap justify-between items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelectProject(p.id);
                    if (p.id === 'codeshield') onUnlockBadge('aegis', 'Aegis Warden: Inspected AST Taint Graphs');
                    if (p.id === 'lqrmpc') onUnlockBadge('argo', 'Argo Helmsman: Inspected 4.7ms LQR-MPC');
                    if (p.id === 'mirage') onUnlockBadge('hephaestus', 'Hephaestus: Analyzed Mirage Multi-Agent Framework');
                    if (p.id === 'syncine') onUnlockBadge('hermes', 'Hermes Post: Tested SynCine WebRTC');
                  }}
                  className="px-3 py-1.5 rounded text-xs font-mono border border-border bg-surface hover:border-ember-600 hover:text-text transition-colors particle-trigger"
                >
                  Blueprint &rarr;
                </button>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  {p.pypiUrl && (
                    <a
                      href={p.pypiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember-600 dark:text-ember-400 hover:underline particle-trigger"
                    >
                      PyPI &nearr;
                    </a>
                  )}
                  {p.npmUrl && (
                    <a
                      href={p.npmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:underline particle-trigger"
                    >
                      npm &nearr;
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-500 hover:underline particle-trigger"
                    >
                      Live &nearr;
                    </a>
                  )}
                  {p.docsUrl && !p.liveUrl && (
                    <a
                      href={p.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember-600 dark:text-ember-400 hover:underline particle-trigger"
                    >
                      Docs &nearr;
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text particle-trigger"
                    >
                      Repo &nearr;
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
