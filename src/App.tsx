import React, { useState, useEffect, useRef } from 'react';
import { AncientMythicCanvas } from './components/AncientMythicCanvas';
import { Navbar } from './components/Navbar';
import { MythicCodexFrame, PageRoute } from './components/MythicCodexFrame';
import { GenesisPage } from './pages/GenesisPage';
import { PantheonPage } from './pages/PantheonPage';
import { MnemosynePage } from './pages/MnemosynePage';
import { HermesPage } from './pages/HermesPage';
import { ArtifactModal } from './components/ArtifactModal';
import { Footer } from './components/Footer';
import { PROJECTS } from './data/projects';
import { soundManager } from './utils/audio';
import { particleEngine } from './utils/particles';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('erebus-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const parseRouteFromUrl = (): PageRoute => {
    // 1. Check query parameter from 404 SPA fallback redirect (?p=/pantheon or ?redirect=/pantheon)
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('p') || urlParams.get('redirect');
    if (redirect) {
      const cleanRedirect = decodeURIComponent(redirect).toLowerCase().replace(/^\/+/, '');
      if (cleanRedirect.startsWith('pantheon')) return 'pantheon';
      if (cleanRedirect.startsWith('mnemosyne')) return 'mnemosyne';
      if (cleanRedirect.startsWith('hermes')) return 'hermes';
      if (cleanRedirect.startsWith('genesis')) return 'genesis';
    }

    // 2. Check window.location.pathname
    const path = window.location.pathname.toLowerCase().replace(/^\/+/, '');
    if (path.startsWith('pantheon')) return 'pantheon';
    if (path.startsWith('mnemosyne')) return 'mnemosyne';
    if (path.startsWith('hermes')) return 'hermes';
    if (path.startsWith('genesis')) return 'genesis';

    // 3. Fallback to hash if present
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('pantheon')) return 'pantheon';
    if (hash.includes('mnemosyne')) return 'mnemosyne';
    if (hash.includes('hermes')) return 'hermes';

    return 'genesis';
  };

  const [activePage, setActivePage] = useState<PageRoute>(parseRouteFromUrl);
  const [astrolabeElevation, setAstrolabeElevation] = useState<number>(145);
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('erebus-badges');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [terminalPrefill, setTerminalPrefill] = useState<string | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync route on browser navigation (popstate) or legacy hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setActivePage(parseRouteFromUrl());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Clean up redirect query parameters or hash from URL to provide pristine clean path
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('p') || urlParams.has('redirect') || window.location.hash) {
      const cleanPath = activePage === 'genesis' ? '/' : `/${activePage}`;
      window.history.replaceState(null, '', cleanPath);
    }
  }, [activePage]);

  // Sync theme attribute with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('erebus-theme', theme);
  }, [theme]);

  // Initialize Particle Canvas Engine
  useEffect(() => {
    if (particleCanvasRef.current) {
      particleEngine.init(particleCanvasRef.current);
    }
  }, []);

  // Global click particle listener
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.particle-trigger')) {
        particleEngine.burst(e.clientX, e.clientY, theme === 'dark');
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (page: PageRoute) => {
    setActivePage(page);
    const targetPath = page === 'genesis' ? '/' : `/${page}`;
    window.history.pushState(null, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockBadge = (id: string, _label: string) => {
    if (!unlockedBadges[id]) {
      const updated = { ...unlockedBadges, [id]: true };
      setUnlockedBadges(updated);
      try {
        localStorage.setItem('erebus-badges', JSON.stringify(updated));
      } catch {
        // LocalStorage fallback
      }
      soundManager.playChime();
    }
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
  };

  const handleOpenTerminalCmd = (cmd: string) => {
    handleNavigate('pantheon');
    setTerminalPrefill(cmd);
    setTimeout(() => {
      const terminalEl = document.getElementById('terminal');
      if (terminalEl) {
        terminalEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const selectedProject = selectedProjectId
    ? PROJECTS.find((p) => p.id === selectedProjectId) || null
    : null;

  return (
    <div className="relative min-h-screen bg-bg text-text selection:bg-ember-500/30 selection:text-text transition-colors duration-300">
      
      {/* Ancient Mythological Parchment Canvas with Sacred Geometry & Ink Dissipation */}
      <AncientMythicCanvas theme={theme} astrolabeElevation={astrolabeElevation} />

      {/* Particle Canvas Overlay for Interactive Bursts */}
      <canvas 
        ref={particleCanvasRef}
        className="fixed inset-0 pointer-events-none z-30"
      />

      {/* Sticky Tactical Navbar with Clean Path Synchronization */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        unlockedCount={Object.keys(unlockedBadges).length}
        totalLabors={6}
        onOpenTerminal={() => handleOpenTerminalCmd('help')}
      />

      {/* The Master Codex / Manuscript Container */}
      <main className="relative z-10">
        <MythicCodexFrame
          activePage={activePage}
          onNavigate={handleNavigate}
          unlockedCount={Object.keys(unlockedBadges).length}
          totalLabors={6}
          theme={theme}
        >
          {activePage === 'genesis' && (
            <GenesisPage
              elevation={astrolabeElevation}
              onElevationChange={(val) => {
                setAstrolabeElevation(val);
                handleUnlockBadge('cartographer', 'Celestial Cartographer');
              }}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activePage === 'pantheon' && (
            <PantheonPage
              unlockedBadges={unlockedBadges}
              onSelectProject={handleSelectProject}
              onOpenTerminalCmd={handleOpenTerminalCmd}
              onUnlockBadge={handleUnlockBadge}
              terminalPrefill={terminalPrefill}
              onClearPrefill={() => setTerminalPrefill(null)}
            />
          )}

          {activePage === 'mnemosyne' && (
            <MnemosynePage theme={theme} />
          )}

          {activePage === 'hermes' && (
            <HermesPage />
          )}
        </MythicCodexFrame>
      </main>

      {/* Primordial Axiom & Socials Footer */}
      <Footer />

      {/* Technical Blueprint Modal */}
      <ArtifactModal
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
      />

    </div>
  );
};
