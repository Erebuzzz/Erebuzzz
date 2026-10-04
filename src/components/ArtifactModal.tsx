import React, { useEffect, useState } from 'react';
import { Project } from '../data/projects';
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
      // Default to cosmos view on every open
      setViewMode('cosmos');
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundManager.playClick();
          onClose();
        }
      }}
    >
      <div 
        className={`w-full ${
          viewMode === 'cosmos' ? 'max-w-5xl' : 'max-w-3xl'
        } max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-xl border border-amber-600/40 shadow-2xl bg-surface-elevated overflow-hidden transition-all duration-300 animate-in zoom-in-95`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3 pr-2 min-w-0">
            <div className="min-w-0">
              <div className="font-mono text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span>&#9889;</span> Architectural Blueprint: {project.mythicCodename}
              </div>
              <h2 id="modal-title" className="font-display font-bold text-sm sm:text-lg text-text mt-0.5 truncate">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Switcher Pill */}
            <div className="flex items-center p-1 rounded-lg border border-border bg-surface-elevated">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('cosmos');
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'cosmos'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                title="3D WebGL Cosmos Map"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D Cosmos</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('codex');
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === 'codex'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                title="Structured Manuscript Codex"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manuscript Codex</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:border-amber-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main View */}
        {viewMode === 'cosmos' ? (
          <div className="relative flex-1 w-full bg-black overflow-hidden min-h-[480px] sm:min-h-[580px]">
            <MythicBlueprintCosmos 
              project={project} 
              onSwitchToCodex={() => setViewMode('codex')}
              theme={theme}
            />
          </div>
        ) : (
          /* Scrollable Manuscript Codex Body */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* Tagline & Metric Banner */}
            <div className="p-3 sm:p-3.5 rounded-lg border border-amber-600/30 bg-amber-500/10 flex flex-wrap items-center justify-between gap-2.5">
              <p className="text-xs sm:text-sm font-medium text-text">
                {project.tagline}
              </p>
              {project.metric && (
                <span className="font-mono text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded bg-amber-600 text-white font-bold tracking-tight shadow-sm">
                  {project.metric}
                </span>
              )}
            </div>

            {/* Thesis Section */}
            <div>
              <h3 className="font-mono text-xs text-amber-600 dark:text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5 sm:mb-2">
                <Cpu className="w-3.5 h-3.5" />
                Core Problem &amp; System Thesis
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-serif">
                {project.blueprint.thesis}
              </p>
            </div>

            {/* Architecture Pipeline Flow */}
            <div>
              <h3 className="font-mono text-xs text-amber-600 dark:text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5 sm:mb-2">
                <Layers className="w-3.5 h-3.5" />
                Dataflow Pipeline Architecture
              </h3>
              <div className="p-3 sm:p-3.5 rounded-lg border border-border bg-bg-sunken font-mono text-[11px] sm:text-xs text-text-muted overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {project.blueprint.pipeline}
              </div>
            </div>

            {/* Technical Highlights */}
            <div>
              <h3 className="font-mono text-xs text-amber-600 dark:text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5 sm:mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Key Technical Highlights
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {project.blueprint.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted">
                    <span className="text-amber-600 font-mono mt-0.5">&gt;</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Breakdown */}
            <div>
              <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold mb-1.5 sm:mb-2">
                Stack Specification
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.blueprint.stack.split(',').map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-border bg-surface font-mono text-[11px] sm:text-xs text-text"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Modal Bottom Footer / Links */}
        <div className="p-3 sm:p-4 border-t border-border bg-surface flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.pypiUrl && (
              <a
                href={project.pypiUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 rounded-md border border-amber-600/50 bg-amber-500/10 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <span>PyPI Package</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.npmUrl && (
              <a
                href={project.npmUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 rounded-md border border-amber-600/50 bg-amber-500/10 font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <span>npm Package</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 rounded-md border border-border bg-surface font-mono text-xs text-text hover:border-amber-600 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 rounded-md border border-border bg-surface font-mono text-xs text-text hover:border-amber-600 transition-colors flex items-center gap-1.5"
              >
                <span>Live System</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.docsUrl && project.docsUrl !== project.liveUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-2.5 py-1.5 rounded-md border border-border bg-surface font-mono text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 text-center rounded-md border border-border bg-surface hover:bg-surface-elevated font-mono text-xs text-text-muted hover:text-text transition-colors"
          >
            Close Esc
          </button>
        </div>
      </div>
    </div>
  );
};
