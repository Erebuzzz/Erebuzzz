import React, { useState, useEffect, useRef } from 'react';
import { CornerDownLeft, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { PROJECTS } from '../data/projects';

interface TerminalHUDProps {
  onSelectProject: (id: string) => void;
  onUnlockBadge: (id: string, label: string) => void;
  prefillCmd?: string | null;
  onClearPrefill?: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

export const TerminalHUD: React.FC<TerminalHUDProps> = ({
  onSelectProject,
  onUnlockBadge,
  prefillCmd,
  onClearPrefill
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init --station IISER-Bhopal',
      output: (
        <div className="space-y-1 text-xs font-mono text-text-muted">
          <p className="text-ember-600 dark:text-ember-400 font-semibold">
            [EREBUS-OS v4.2.0] Horizon Terminal Telemetry Initialized.
          </p>
          <p>
            Connected to IISER Bhopal DSCL &middot; WorldQuant Alpha Mesh &middot; Unstable Kernel Lab.
          </p>
          <p className="text-text-dim">
            Type <span className="text-ember-600 dark:text-ember-400 font-semibold">help</span> to view available routines, or click any command chip below.
          </p>
        </div>
      )
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const executeCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    soundManager.playClick();
    setHistory((prev) => [...prev, raw]);
    setHistoryIdx(-1);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs font-mono">
            <p className="text-ember-600 dark:text-ember-400 font-semibold mb-1">Available System Routines:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-text-muted">
              <div><span className="text-text font-semibold">whoami</span> &middot; Bio, research thesis &amp; origin</div>
              <div><span className="text-text font-semibold">pantheon</span> &middot; List all architectures</div>
              <div><span className="text-text font-semibold">packages</span> &middot; PyPI &amp; npm released tools</div>
              <div><span className="text-text font-semibold">quant</span> &middot; WorldQuant alpha methodology</div>
              <div><span className="text-text font-semibold">skills</span> &middot; Verbose stack &amp; control engineering</div>
              <div><span className="text-text font-semibold">delphi</span> &middot; Delphic Oracle telemetry routine</div>
              <div><span className="text-text font-semibold">labors</span> &middot; Quest achievement progression</div>
              <div><span className="text-text font-semibold">inspect &lt;id&gt;</span> &middot; Inspect system blueprint</div>
              <div><span className="text-text font-semibold">contact</span> &middot; Open communication lines</div>
              <div><span className="text-text font-semibold">clear</span> &middot; Clear terminal buffer</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-2 text-xs font-mono text-text-muted leading-relaxed">
            <p className="text-text font-semibold">
              Kshitiz Kumar Sinha (alias Erebuzzz / Horizon)
            </p>
            <p>
              Final-year Electronics and Communication Engineering at IISER Bhopal, graduating April 2027.
              Most of my time goes into building software, tools, and robotics: products that ship, agent skills, and control stacks that should honestly not work as well as they do.
            </p>
            <p>
              Part-time Quantitative Research Consultant at WorldQuant. The rest of the week is Python, TypeScript, and the occasional robot pretending the mess was intentional.
            </p>
            <p className="text-ember-600 dark:text-ember-400">
              Founding Lead at Unstable Kernel: public-by-default lab for robotics, autonomy, and AI-assisted engineering tooling.
            </p>
          </div>
        );
        break;

      case 'packages':
        onUnlockBadge('packages', 'Artifact Curator: Examined Released PyPI & npm Packages');
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-ember-600 dark:text-ember-400 font-semibold">
              Officially Released Python &amp; Node Packages:
            </p>
            <div className="space-y-2 text-text-muted">
              <div className="p-2 rounded border border-border bg-surface">
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">codeshield-ai (PyPI)</span>
                  <a href="https://pypi.org/project/codeshield-ai/" target="_blank" rel="noreferrer" className="text-ember-600 hover:underline">pypi.org/project/codeshield-ai &#8599;</a>
                </div>
                <p className="text-[11px] text-text-dim mt-0.5">AST Control-Flow &amp; Data-Flow Graph taint tracking engine for LLM code.</p>
              </div>

              <div className="p-2 rounded border border-border bg-surface">
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">codeshield-mcp (npm)</span>
                  <a href="https://www.npmjs.com/package/codeshield-mcp" target="_blank" rel="noreferrer" className="text-ember-600 hover:underline">npmjs.com/package/codeshield-mcp &#8599;</a>
                </div>
                <p className="text-[11px] text-text-dim mt-0.5">Model Context Protocol server for running CodeShield audits in agent workspaces.</p>
              </div>

              <div className="p-2 rounded border border-border bg-surface">
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">leanmcp (npm)</span>
                  <a href="https://www.npmjs.com/package/leanmcp" target="_blank" rel="noreferrer" className="text-ember-600 hover:underline">npmjs.com/package/leanmcp &#8599;</a>
                </div>
                <p className="text-[11px] text-text-dim mt-0.5">Lightweight Zero-Dependency CLI for registering, launching, and managing MCP tools.</p>
              </div>

              <div className="p-2 rounded border border-border bg-surface">
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">tweakio-sdk (PyPI)</span>
                  <a href="https://pypi.org/project/tweakio-sdk/" target="_blank" rel="noreferrer" className="text-ember-600 hover:underline">pypi.org/project/tweakio-sdk &#8599;</a>
                </div>
                <p className="text-[11px] text-text-dim mt-0.5">High-frequency parameter tuning and live telemetry injection client for robotics rigs.</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'quant':
      case 'delphi':
        onUnlockBadge('delphi', 'Delphic Initiate: Tested Quant Telemetry Routine');
        output = (
          <div className="space-y-2 text-xs font-mono text-text-muted leading-relaxed">
            <p className="text-ember-600 dark:text-ember-400 font-semibold">
              Delphic Alpha Engine &middot; WorldQuant Consultancy
            </p>
            <p>
              Systematic quantitative alpha generation covering market anomaly detection, cross-asset signal processing, and orthogonal risk factor modeling.
            </p>
            <div className="p-2.5 rounded border border-border bg-surface space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Signal Universe:</span>
                <span className="text-text font-semibold">Global Equities &middot; Top 3000 Liquid</span>
              </div>
              <div className="flex justify-between">
                <span>Optimization Routine:</span>
                <span className="text-text font-semibold">Convex Quadratic / LQR-equivalent Formulation</span>
              </div>
              <div className="flex justify-between">
                <span>Information Coefficient (Mean IC):</span>
                <span className="text-ember-600 font-semibold">&gt; 0.052 Orthogonalized</span>
              </div>
              <div className="flex justify-between">
                <span>Turnover Constraint:</span>
                <span className="text-text font-semibold">&lt; 15% Daily Neutralized</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-xs font-mono text-text-muted leading-relaxed">
            <p className="text-ember-600 dark:text-ember-400 font-semibold">
              Verbose Technical Competencies:
            </p>
            <div className="space-y-1.5">
              <p><span className="text-text font-semibold">Languages:</span> Python, TypeScript, JavaScript, Shell, Rust, C, SQL</p>
              <p><span className="text-text font-semibold">Web &amp; Systems:</span> Next.js, Vite, React, FastAPI, Appwrite, WebRTC, Docker, Linux, PostgreSQL, Redis</p>
              <p><span className="text-text font-semibold">Quant:</span> Alpha Research, Alpha Generation, Signal Processing, Risk Modeling, Systematic Trading, WorldQuant Brain</p>
              <p><span className="text-text font-semibold">AI &amp; Tooling:</span> PyTorch, tree-sitter AST, MCP Protocol, LLM Autonomous Agents, Scikit-Learn</p>
              <p><span className="text-text font-semibold">Robotics &amp; Control:</span> ROS 2 (Jazzy/Humble), MuJoCo, LQR-MPC, MATLAB/Simulink, Isaac Sim, Kalman Filters</p>
              <p><span className="text-text font-semibold">Embedded Hardware:</span> Arduino, ESP32, Verilog, FPGA, I2C/SPI/CAN Bus</p>
            </div>
          </div>
        );
        break;

      case 'pantheon':
        output = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-ember-600 dark:text-ember-400 font-semibold">
              The Pantheon Architectures ({PROJECTS.length} Registered):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-text-muted">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="text-left p-1.5 rounded hover:bg-surface border border-transparent hover:border-border transition-colors truncate flex items-center justify-between"
                >
                  <span className="text-text font-semibold">{p.id}</span>
                  <span className="text-ember-600 text-[10px]">{p.mythicCodename}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-dim">
              Tip: Click any entry above or type &apos;inspect &lt;id&gt;&apos; to open the technical blueprint.
            </p>
          </div>
        );
        break;

      case 'inspect':
        if (!arg) {
          output = <p className="text-xs font-mono text-red-400">Usage: inspect &lt;project-id&gt; (e.g., inspect codeshield, inspect lqrmpc)</p>;
        } else {
          const match = PROJECTS.find((p) => p.id.toLowerCase() === arg || p.title.toLowerCase().includes(arg));
          if (match) {
            onSelectProject(match.id);
            output = (
              <p className="text-xs font-mono text-ember-600 dark:text-ember-400">
                Opening architectural blueprint for {match.title}...
              </p>
            );
          } else {
            output = <p className="text-xs font-mono text-red-400">Project &apos;{arg}&apos; not found in Pantheon. Type &apos;pantheon&apos; to view all IDs.</p>;
          }
        }
        break;

      case 'labors':
        output = (
          <div className="space-y-1.5 text-xs font-mono text-text-muted">
            <p className="text-ember-600 dark:text-ember-400 font-semibold">The Labors of Autonomy:</p>
            <p>1. [Cartographer] - Tune the Horizon Astrolabe elevation</p>
            <p>2. [Argo Helmsman] - Inspect the 4.7ms LQR-MPC Navigation stack</p>
            <p>3. [Aegis Warden] - Inspect CodeShield AST taint graph compiler</p>
            <p>4. [Hermes Post] - Inspect SynCine zero-cost WebRTC mesh</p>
            <p>5. [Delphic Oracle] - Execute &apos;quant&apos; or &apos;delphi&apos; telemetry routine</p>
            <p>6. [Hephaestus] - Inspect Mirage Multi-Agent Framework</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1.5 text-xs font-mono text-text-muted">
            <p className="text-ember-600 dark:text-ember-400 font-semibold">Communication Channels:</p>
            <p>Email: <a href="mailto:contact@erebuzzz.me" className="text-text hover:underline">contact@erebuzzz.me</a></p>
            <p>GitHub: <a href="https://github.com/Erebuzzz" target="_blank" rel="noreferrer" className="text-text hover:underline">github.com/Erebuzzz &#8599;</a></p>
            <p>Unstable Kernel Lab: <a href="https://unstable-kernel.github.io/docs" target="_blank" rel="noreferrer" className="text-text hover:underline">unstable-kernel.github.io/docs &#8599;</a></p>
          </div>
        );
        break;

      case 'clear':
        setLogs([]);
        return;

      default:
        output = (
          <p className="text-xs font-mono text-red-400">
            Unknown command &apos;{cmd}&apos;. Type &apos;help&apos; for available routines.
          </p>
        );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: raw,
        output
      }
    ]);
  };

  // Watch prefill command
  useEffect(() => {
    if (prefillCmd) {
      executeCommand(prefillCmd);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillCmd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx] || '');
      }
    }
  };

  return (
    <section className="pt-12 pb-16" id="terminal">
      <div className="flex flex-col gap-3 mb-4">
        <div className="font-mono text-xs text-ember-600 dark:text-ember-500 uppercase tracking-wider font-semibold">
          Interactive Diagnostic Shell
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-text tracking-tight shimmer-text">
          Horizon Terminal Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Direct terminal interface into the autonomy lab, released packages, quant routines, and system blueprints.
        </p>
      </div>

      {/* Terminal Window */}
      <div className="liquid-glass-card rounded-xl border border-border overflow-hidden shadow-2xl">
        
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            <span className="font-mono text-xs text-text-muted ml-2 font-medium">erebus@horizon:~$</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setLogs([]);
              }}
              className="text-text-muted hover:text-text font-mono text-[11px] flex items-center gap-1 transition-colors"
              title="Clear terminal buffer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>clear</span>
            </button>
          </div>
        </div>

        {/* Command Output Buffer */}
        <div className="p-4 sm:p-5 font-mono text-xs space-y-4 max-h-[300px] sm:max-h-[380px] overflow-y-auto bg-bg-sunken/90">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-text">
                <span className="text-ember-600 dark:text-ember-400 font-bold">&gt;</span>
                <span className="text-text font-semibold">{log.command}</span>
              </div>
              <div className="pl-4 border-l border-border">{log.output}</div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Quick Command Chips (Horizontally Scrollable on Mobile) */}
        <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-surface border-t border-border flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-wider mr-1 whitespace-nowrap">Routines:</span>
          {['whoami', 'pantheon', 'packages', 'quant', 'skills', 'labors', 'delphi', 'contact'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="whitespace-nowrap px-2.5 py-1 rounded border border-border bg-surface-elevated font-mono text-[11px] text-text-muted hover:text-ember-600 dark:hover:text-ember-400 hover:border-ember-600/50 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 bg-surface border-t border-border">
          <span className="font-mono text-xs text-ember-600 dark:text-ember-400 font-bold mr-2">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            id="terminal-input"
            name="command"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (try 'whoami', 'packages', 'quant')..."
            className="flex-1 bg-transparent font-mono text-sm sm:text-xs text-text outline-none placeholder:text-text-dim"
          />
          <button
            type="submit"
            className="text-text-muted hover:text-ember-600 transition-colors ml-2 p-1"
            aria-label="Send command"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
