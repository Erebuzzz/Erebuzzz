import React, { useEffect, useState, useMemo } from 'react';
import { Project } from '../data/projects';
import { RepoGraphNode, getRepoGraph } from '../data/repoGraphs';
import { soundManager } from '../utils/audio';
import { 
  X, 
  ExternalLink, 
  Github, 
  Layers, 
  Cpu, 
  CheckCircle, 
  Compass, 
  FileText
} from 'lucide-react';
import { MythicBlueprintCosmos } from './MythicBlueprintCosmos';
import { CosmosHUD } from './CosmosHUD';

interface ArtifactModalProps {
  project: Project | null;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({ 
  project, 
  onClose,
  theme = 'dark' 
}) => {
  const [viewMode, setViewMode] = useState<'cosmos' | 'codex'>('cosmos');
  const [selectedNode, setSelectedNode] = useState<RepoGraphNode | null>(null);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const graph = useMemo(() => {
    if (!project) return null;
    return getRepoGraph(project.id, project);
  }, [project]);

  // Set default selected node to the kernel taproot on project open
  useEffect(() => {
    if (graph) {
      const kernel = graph.nodes.find(n => n.cluster === 'kernel') || graph.nodes[0];
      setSelectedNode(kernel || null);
      setActiveCluster(null);
    }
  }, [graph]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      soundManager.playChime();
      setViewMode('cosmos');
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project || !graph) return null;

  const clusters = Array.from(new Set(graph.nodes.map(n => n.cluster)));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundManager.playClick();
          onClose();
        }
      }}
    >
      <div 
        className="w-[96vw] max-w-[1720px] h-[94vh] max-h-[1060px] flex flex-col rounded-2xl border border-amber-600/40 shadow-2xl bg-[#0c0906] overflow-hidden transition-all duration-300 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Single Unified Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 border-b border-border bg-surface shrink-0">
          
          {/* Left: Project & Botanical Root Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span>&#9889;</span>
                <span>{project.mythicCodename}</span>
                <span className="text-text-dim">&middot;</span>
                <span className="text-text-muted hidden sm:inline">{graph.mythicTitle}</span>
              </div>
              <h2 id="modal-title" className="font-display font-bold text-sm sm:text-base text-text truncate mt-0.5">
                {project.title}
              </h2>
            </div>
          </div>

          {/* Center: Cluster Filter Chips (Visible in 3D Cosmos mode) */}
          {viewMode === 'cosmos' && (
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveCluster(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeCluster === null
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                All Roots ({graph.nodes.length})
              </button>
              {clusters.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveCluster(activeCluster === c ? null : c);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-mono uppercase tracking-tight transition-colors capitalize ${
                    activeCluster === c
                      ? 'bg-amber-600 text-white font-bold shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Right: View Mode Toggle & Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center p-1 rounded-xl border border-border bg-surface-elevated">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('cosmos');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'cosmos'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                title="3D Subterranean Root Network"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Root Network</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('codex');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'codex'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                title="Structured Manuscript Codex"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Manuscript Codex</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-amber-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Modal Main Viewport */}
        {viewMode === 'cosmos' ? (
          /* Dedicated Side-by-Side Grid Layout: Left Canvas, Right Dedicated Non-Overlapping Inspector */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] xl:grid-cols-[1fr_430px] flex-1 min-h-0 h-full overflow-hidden bg-black">
            
            {/* Left 3D Tree Canvas Area */}
            <div className="relative w-full h-full min-h-[360px] overflow-hidden">
              <MythicBlueprintCosmos 
                project={project}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
                activeCluster={activeCluster}
                theme={theme}
              />
            </div>

            {/* Right Dedicated Non-Overlapping Inspector Panel */}
            <div className="w-full h-full min-h-0 overflow-hidden">
              <CosmosHUD
                selectedNode={selectedNode}
                project={project}
              />
            </div>

          </div>
        ) : (
          /* Full-Bleed Scrollable Manuscript Codex Body */
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
            
            {/* Tagline & Metric Banner */}
            <div className="p-4 rounded-xl border border-amber-600/30 bg-amber-500/10 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-text">
                {project.tagline}
              </p>
              {project.metric && (
                <span className="font-mono text-xs px-3 py-1 rounded bg-amber-600 text-white font-bold tracking-tight shadow-sm">
                  {project.metric}
                </span>
              )}
            </div>

            {/* Thesis Section */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Core Problem &amp; System Thesis</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed font-serif">
                {project.blueprint.thesis}
              </p>
            </div>

            {/* Architecture Pipeline Flow */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Dataflow Pipeline Architecture</span>
              </h3>
              <div className="p-4 rounded-xl border border-border bg-bg-sunken font-mono text-xs text-text-muted overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {project.blueprint.pipeline}
              </div>
            </div>

            {/* Technical Highlights */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Key Technical Highlights</span>
              </h3>
              <ul className="space-y-2">
                {project.blueprint.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <span className="text-amber-500 font-mono mt-0.5">&gt;</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Breakdown */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold">
                Stack Specification
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.blueprint.stack.split(',').map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 rounded-lg border border-border bg-surface font-mono text-xs text-text"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Links Bar inside Codex */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2.5">
              {project.pypiUrl && (
                <a
                  href={project.pypiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="px-3 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>PyPI Package</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.npmUrl && (
                <a
                  href={project.npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="px-3 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>npm Package</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="px-3 py-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Launch Live Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text font-mono text-xs flex items-center gap-1.5 hover:border-amber-600"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Repository</span>
                </a>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
