import React, { useState } from 'react';
import { Shield, Sparkles, Navigation, Layers, Cpu, ExternalLink, ArrowRight, Package } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeroRelicPreviewProps {
  onSelectProject: (id: string) => void;
  theme?: 'dark' | 'light';
}

interface RelicItem {
  id: string;
  codename: string;
  greekTitle: string;
  systemName: string;
  tagline: string;
  provenance: string;
  metrics: string;
  tags: string[];
  icon: React.ReactNode;
  npmPackage?: string;
  pypiPackage?: string;
  githubUrl: string;
}

export const HeroRelicPreview: React.FC<HeroRelicPreviewProps> = ({
  onSelectProject,
  theme = 'dark'
}) => {
  const [selectedRelicIndex, setSelectedRelicIndex] = useState<number>(0);
  const isDark = theme === 'dark';

  const relics: RelicItem[] = [
    {
      id: "codeshield",
      codename: "The Aegis of Athena",
      greekTitle: "\u0391\u0399\u0393\u0399\u03a3 \u0391\u0398\u0397\u039d\u0391\u03a3",
      systemName: "CodeShield",
      tagline: "Deterministic AST verification firewall & graph analysis for AI-generated code.",
      provenance: "Built at Unstable Kernel &middot; Python &amp; tree-sitter",
      metrics: "CFG/DFG Taint Analysis &middot; Zero False Leaks",
      tags: ["Python", "tree-sitter", "MCP Server", "AST Security"],
      icon: <Shield className="w-6 h-6" />,
      npmPackage: "codeshield-mcp",
      pypiPackage: "codeshield-ai",
      githubUrl: "https://github.com/Erebuzzz/CodeShield"
    },
    {
      id: "pixasso",
      codename: "The Daedalian Automaton",
      greekTitle: "\u0394\u0391\u0399\u0394\u0391\u039b\u039f\u03a3 \u039c\u0397\u03a7\u0391\u039d\u0397",
      systemName: "Pixasso",
      tagline: "End-to-end design orchestrator, 16 frontend pillars & automated multi-viewport testing.",
      provenance: "Published npm Tool &middot; Model Context Protocol",
      metrics: "16 Architecture Pillars &middot; Automated QA",
      tags: ["TypeScript", "npm", "MCP Server", "Tailwind CSS"],
      icon: <Sparkles className="w-6 h-6" />,
      npmPackage: "pixasso-mcp",
      githubUrl: "https://github.com/Erebuzzz/pixasso"
    },
    {
      id: "lqrmpc",
      codename: "The Argo Navis",
      greekTitle: "\u0391\u03a1\u0393\u03a9 \u039d\u0391\u03a5\u03a3",
      systemName: "Hybrid LQR-MPC Navigation",
      tagline: "Predictive risk filtering cutting optimization solve latency from 180 ms to 4.7 ms.",
      provenance: "DSCL Robotics Lab &middot; ROS 2 Jazzy &amp; CasADi",
      metrics: "4.7 ms Latency &middot; Zero Barrier Violations",
      tags: ["Python", "ROS 2", "CasADi", "OSQP", "Gazebo"],
      icon: <Navigation className="w-6 h-6" />,
      githubUrl: "https://github.com/Erebuzzz/control-systems"
    },
    {
      id: "norn",
      codename: "Loom of the Fates",
      greekTitle: "\u039a\u039b\u03a9\u0398\u03a9 \u039a\u0391\u0399 \u039b\u0391\u03a7\u0395\u03a3\u0399\u03a3",
      systemName: "NORN Protocol",
      tagline: "Multilateral obligation routing and off-chain circular netting on Arbitrum Stylus.",
      provenance: "Distributed Finance &middot; Rust &amp; WASM Contract",
      metrics: "80% Settlement Compression &middot; Zero-Gas Netting",
      tags: ["Rust", "Arbitrum Stylus", "WASM", "EIP-712"],
      icon: <Layers className="w-6 h-6" />,
      githubUrl: "https://github.com/Erebuzzz/norn"
    },
    {
      id: "muninn",
      codename: "The Raven's Memory",
      greekTitle: "\u039c\u039d\u0397\u039c\u039f\u03a3\u03a5\u039d\u0397 \u039a\u039f\u03a1\u0391\u039e",
      systemName: "Muninn",
      tagline: "Continuous context capture, voice turns into atomic claims, and vector knowledge graph.",
      provenance: "Edge AI Assistant &middot; Cloudflare &amp; Neon pgvector",
      metrics: "Sub-Second Semantic Graph Query &middot; Wake Lock",
      tags: ["TypeScript", "Workers", "pgvector", "Next.js 15"],
      icon: <Cpu className="w-6 h-6" />,
      githubUrl: "https://github.com/Erebuzzz/Muninn"
    }
  ];

  const currentRelic = relics[selectedRelicIndex];

  return (
    <div className="relative my-8 sm:my-10">
      
      {/* Editorial Pedestal Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-ember-600/20">
        <div>
          <div className="font-mono text-[10px] sm:text-xs text-ember-600 dark:text-ember-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ember-600 animate-ping"></span>
            <span>Relics of Autonomy &middot; Flagship Engineering Deck</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-text mt-1">
            The Prometheus Reliquary
          </h2>
        </div>

        <div className="text-xs font-mono text-text-dim">
          <span>Relic {selectedRelicIndex + 1} of {relics.length}</span>
        </div>
      </div>

      {/* Relic Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {relics.map((relic, idx) => {
          const isActive = idx === selectedRelicIndex;
          return (
            <button
              key={relic.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedRelicIndex(idx);
              }}
              className={`px-3 py-2 rounded-xl font-mono text-xs transition-all duration-200 flex items-center gap-2 whitespace-nowrap border ${
                isActive
                  ? 'bg-ember-600/15 border-ember-600 text-ember-600 dark:text-ember-400 font-bold shadow-[0_0_15px_rgba(234,88,12,0.2)]'
                  : 'border-border/60 bg-surface/50 text-text-muted hover:text-text hover:bg-surface'
              }`}
            >
              <span className="opacity-75">{relic.icon}</span>
              <span>{relic.systemName}</span>
              <span className="text-[10px] opacity-60 hidden md:inline">({relic.codename})</span>
            </button>
          );
        })}
      </div>

      {/* Main Relic Pedestal Showcase Card (Echoes of Atlantis Inspiration) */}
      <div 
        className="relative rounded-2xl border p-6 sm:p-8 overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(16, 20, 29, 0.96)' : 'rgba(252, 249, 244, 0.98)',
          borderColor: isDark ? 'rgba(234, 88, 12, 0.35)' : 'rgba(194, 65, 12, 0.35)',
          boxShadow: isDark
            ? '0 16px 40px -4px rgba(0, 0, 0, 0.8), 0 0 24px -2px rgba(234, 88, 12, 0.15)'
            : '0 16px 40px -4px rgba(194, 65, 12, 0.12)'
        }}
      >
        {/* Ambient Backlight Aura */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ backgroundColor: '#ea580c' }}
        />

        {/* Sacred Hellenic Geometric Corner Motifs */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-ember-600/30 select-none">
          &#10022;
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-ember-600/30 select-none">
          &#10022;
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Relic Spec Column */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-ember-600/20 text-ember-600 dark:text-ember-400 border border-ember-600/30 uppercase tracking-wider">
                {currentRelic.greekTitle}
              </span>
              <span className="text-text-dim text-xs">&middot;</span>
              <span className="font-mono text-xs text-text-muted">{currentRelic.codename}</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text tracking-tight">
                {currentRelic.systemName}
              </h3>
              <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed font-sans">
                {currentRelic.tagline}
              </p>
            </div>

            {/* Telemetry and Badges */}
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-lg border border-border/80 bg-surface/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-text-muted text-[11px]">{currentRelic.metrics}</span>
              </div>

              {currentRelic.npmPackage && (
                <a
                  href={`https://www.npmjs.com/package/${currentRelic.npmPackage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1.5 text-[11px]"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>npm: {currentRelic.npmPackage}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}

              {currentRelic.pypiPackage && (
                <a
                  href={`https://pypi.org/project/${currentRelic.pypiPackage}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 text-[11px]"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>PyPI: {currentRelic.pypiPackage}</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentRelic.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono border border-border/60 bg-surface/50 text-text-dim"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Relic Action & Blueprint Column */}
          <div className="lg:col-span-4 flex flex-col gap-3 lg:border-l lg:border-border/60 lg:pl-6">
            <div className="p-4 rounded-xl border border-border/80 bg-surface/60 space-y-3">
              <div className="text-[11px] font-mono text-text-dim uppercase tracking-wider">
                Relic Provenance
              </div>
              <div 
                className="text-xs font-mono text-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentRelic.provenance }}
              />

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectProject(currentRelic.id);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-ember-600/25 flex items-center justify-center gap-2 group particle-trigger"
              >
                <span>Inspect Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={currentRelic.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="w-full py-2 px-3 rounded-lg border border-border/80 hover:bg-surface text-text-muted hover:text-text font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Source Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
