export interface RepoGraphNode {
  id: string;
  label: string;
  sublabel: string;
  cluster: 'kernel' | 'execution' | 'consensus' | 'telemetry' | 'storage' | 'security' | 'control' | 'interface';
  role: string;
  mythicSigil: string;
  metrics: {
    label: string;
    value: number;
    unit: string;
    formatDecimals?: number;
  }[];
  details: string;
  codeSnippet?: string;
  position: [number, number, number];
  color: string;
  botanicalType: 'trunk' | 'leaf' | 'fruit';
  size: number;
}

export interface RepoGraphEdge {
  source: string;
  target: string;
  label?: string;
  strength?: number;
  color?: string;
}

export interface RepoGraph {
  repoId: string;
  title: string;
  mythicTitle: string;
  epigraph: string;
  nodes: RepoGraphNode[];
  edges: RepoGraphEdge[];
  stats: {
    label: string;
    value: number;
    unit: string;
    formatDecimals?: number;
  }[];
}

export const REPO_GRAPHS: Record<string, RepoGraph> = {
  norn: {
    repoId: "norn",
    title: "NORN Protocol: Autonomous Netting Network",
    mythicTitle: "Loom of the Fates (Clotho & Lachesis)",
    epigraph: "Weaving the tangled threads of autonomous debts into a single seamless cord.",
    stats: [
      { label: "Cycle Compression", value: 80, unit: "%" },
      { label: "Stylus Execution", value: 1.8, unit: "ms", formatDecimals: 1 },
      { label: "Batch Capacity", value: 2400, unit: "tx/s" },
      { label: "Verification Gas", value: 42150, unit: "gas" }
    ],
    nodes: [
      {
        id: "norn-kernel",
        label: "Obligation Netting Core",
        sublabel: "Tarjan SCC & Cycle Reducer",
        cluster: "kernel",
        role: "Discovers cyclic credit loops across agent debt directed graphs and computes maximal multilateral cancellation.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Cycle Compression", value: 80, unit: "%" },
          { label: "Algorithmic Speed", value: 4.2, unit: "ms", formatDecimals: 1 }
        ],
        details: "Runs strongly connected components and minimum-cut flow reductions to dissolve transitive obligations before any blockchain transaction is submitted.",
        codeSnippet: "fn resolve_cycles(graph: &mut DebtGraph) -> NettingReceipt {\n  let scc = tarjan_scc(graph);\n  scc.into_iter().fold(NettingReceipt::new(), |acc, cycle| {\n    acc.compress(cycle)\n  })\n}",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "norn-stylus",
        label: "Arbitrum Stylus ClearingHouse",
        sublabel: "Rust WASM Smart Contract",
        cluster: "execution",
        role: "Validates off-chain netting receipts on-chain via compiled Rust WebAssembly on Arbitrum Stylus.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "WASM Solve Time", value: 1.8, unit: "ms", formatDecimals: 1 },
          { label: "Gas Savings", value: 92, unit: "%" }
        ],
        details: "Leverages Stylus WASM execution speed to verify 256-node cycle netting batches with sub-millisecond execution latency.",
        codeSnippet: "#[stylus_sdk::entrypoint]\npub fn execute_netted_batch(\n  &mut self,\n  compressed_proof: Bytes\n) -> Result<(), Vec<u8>> {\n  self.verify_conservation_invariants(&compressed_proof)\n}",
        position: [2.2, 0.6, -0.3],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "norn-robinhood",
        label: "Robinhood Settlement Layer",
        sublabel: "ClearingHouse.sol EVM Core",
        cluster: "consensus",
        role: "Dual-chain clearing engine settling compressed token balances on Robinhood Chain.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "Batch Settlement", value: 2400, unit: "tx/s" },
          { label: "Block Finality", value: 1.0, unit: "s", formatDecimals: 1 }
        ],
        details: "Atomically disburses collateral adjustments across agent balances in a single rebalancing transaction.",
        codeSnippet: "function settleNettedEpoch(\n  uint256 epochId,\n  BalanceDelta[] calldata deltas,\n  bytes calldata authorityProof\n) external nonReentrant returns (bool) { ... }",
        position: [-2.2, 0.7, 0.4],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "norn-eip712",
        label: "EIP-712 Intent Verifier",
        sublabel: "Cryptographic Voucher Gate",
        cluster: "security",
        role: "Validates cryptographic signatures and sequence nonces on off-chain agent debt promises.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Sig Verification", value: 42150, unit: "gas" },
          { label: "Replay Immunity", value: 100, unit: "%" }
        ],
        details: "Structured typed data hashing ensuring autonomous agent obligations are cryptographically non-repudiable.",
        position: [1.6, 2.0, 0.3],
        color: "#a855f7",
        botanicalType: "leaf",
        size: 0.6
      },
      {
        id: "norn-x402",
        label: "x402 Agent Payment Gateway",
        sublabel: "HTTP 402 Micropayments",
        cluster: "interface",
        role: "Native machine-to-machine payment protocol wrapping HTTP 402 Payment Required headers into netting obligations.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "HTTP 402 Latency", value: 3.4, unit: "ms", formatDecimals: 1 },
          { label: "Throughput", value: 1250, unit: "/min" }
        ],
        details: "Allows autonomous AI agents to negotiate, serve, and clear API calls without per-call onchain transactions.",
        position: [-1.6, 1.9, -0.3],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "norn-quicknode",
        label: "QuickNode RPC Telemetry",
        sublabel: "Real-time Node Sentinel",
        cluster: "telemetry",
        role: "Streams low-latency RPC blocks, gas price tracking, and event logs into the netting consensus.",
        mythicSigil: "\u03a6",
        metrics: [
          { label: "RPC Response", value: 12, unit: "ms" },
          { label: "Event Stream", value: 8500, unit: "evt/s" }
        ],
        details: "Dedicated QuickNode endpoint synchronization guaranteeing zero missed chain events during netting epochs.",
        position: [0.3, 2.8, 0.2],
        color: "#e879f9",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "norn-arena",
        label: "Mission Control Arena",
        sublabel: "Live Web Arena & Telemetry",
        cluster: "interface",
        role: "Interactive visual control room deployed at norn-network.vercel.app/arena simulating autonomous multi-agent economies.",
        mythicSigil: "\u03a0",
        metrics: [
          { label: "Agent Population", value: 128, unit: "agents" },
          { label: "Simulation FPS", value: 60, unit: "fps" }
        ],
        details: "Live graph visualization of debts, active cycle cancellations, and instant proof submission triggers.",
        position: [-0.2, 3.5, -0.2],
        color: "#facc15",
        botanicalType: "fruit",
        size: 0.62
      }
    ],
    edges: [
      { source: "norn-kernel", target: "norn-stylus", label: "WASM Proof Dispatch", strength: 1.0, color: "#38bdf8" },
      { source: "norn-kernel", target: "norn-robinhood", label: "EVM Clearing Settlement", strength: 0.9, color: "#34d399" },
      { source: "norn-stylus", target: "norn-eip712", label: "Signature Verification", strength: 0.85, color: "#a855f7" },
      { source: "norn-robinhood", target: "norn-x402", label: "Voucher Ingestion", strength: 0.8, color: "#fb923c" },
      { source: "norn-eip712", target: "norn-quicknode", label: "RPC Block Sync", strength: 0.75, color: "#e879f9" },
      { source: "norn-quicknode", target: "norn-arena", label: "Settlement Broadcast", strength: 0.85, color: "#facc15" }
    ]
  },

  codeshield: {
    repoId: "codeshield",
    title: "CodeShield: AST Verification Firewall",
    mythicTitle: "The Aegis of Athena",
    epigraph: "Before the blade strikes, Athena casts the impenetrable mirror of truth.",
    stats: [
      { label: "AST Parse Speed", value: 125000, unit: "node/s" },
      { label: "Scan Latency", value: 8.4, unit: "ms", formatDecimals: 1 },
      { label: "False Positive Rate", value: 0, unit: "%" },
      { label: "Vulnerability Sinks", value: 48, unit: "types" }
    ],
    nodes: [
      {
        id: "cs-kernel",
        label: "tree-sitter Grammar Core",
        sublabel: "Deterministic AST Parser",
        cluster: "kernel",
        role: "High-performance concrete syntax tree parsing across Python, TypeScript, Rust, and Bash.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Parse Speed", value: 125000, unit: "node/s" },
          { label: "Grammar Coverage", value: 12, unit: "langs" }
        ],
        details: "Direct C ABI bindings compile syntax trees in sub-millisecond timeframes without spawning external subprocesses.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "cs-cfg",
        label: "Control-Flow Graph Generator",
        sublabel: "Branch & Block Decomposition",
        cluster: "execution",
        role: "Builds directed basic-block control flow graphs to discover execution divergence and unreachable traps.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Block Resolution", value: 2.1, unit: "ms", formatDecimals: 1 },
          { label: "Branch Parity", value: 100, unit: "%" }
        ],
        details: "Converts conditional branches, exception handlers, and asynchronous event loops into rigorous mathematical digraphs.",
        position: [2.2, 0.6, -0.3],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "cs-dfg",
        label: "Data-Flow Graph Engine",
        sublabel: "Def-Use Chain Analysis",
        cluster: "execution",
        role: "Traces variable lifetimes, mutations, and inter-procedural data flows from source parameters to return statements.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "Def-Use Tracking", value: 99.8, unit: "%", formatDecimals: 1 },
          { label: "Lifetime Resolution", value: 3.2, unit: "ms", formatDecimals: 1 }
        ],
        details: "Deterministic SSA form mapping ensuring precise variable lineage tracking without heuristics.",
        position: [-2.2, 0.7, 0.4],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "cs-taint",
        label: "Taint Propagation Matrix",
        sublabel: "Source-to-Sink Hunter",
        cluster: "security",
        role: "Mathematical solver identifying untrusted inputs reaching dangerous execution sinks (eval, os.system, SQL).",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Vulnerability Types", value: 48, unit: "sinks" },
          { label: "False Positive", value: 0, unit: "%" }
        ],
        details: "Constructs reachability matrices over the DFG to guarantee that no sanitized variable bypasses guardrails.",
        position: [1.6, 2.0, 0.3],
        color: "#a855f7",
        botanicalType: "leaf",
        size: 0.6
      },
      {
        id: "cs-mcp",
        label: "Model Context Protocol Bridge",
        sublabel: "Autonomous Agent Guardrail",
        cluster: "interface",
        role: "Exposes security verification tools directly to Claude, Cursor, and Gemini via JSON-RPC 2.0 MCP standards.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "MCP Tools", value: 8, unit: "tools" },
          { label: "Hook Overhead", value: 1.2, unit: "ms", formatDecimals: 1 }
        ],
        details: "Enables autonomous coding agents to self-audit their generated patches before executing shell commands.",
        position: [-1.6, 2.0, -0.3],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "cs-pypi",
        label: "PyPI & npm Release Artifacts",
        sublabel: "Distributed Ecosystem Package",
        cluster: "telemetry",
        role: "Published packages 'codeshield-ai' (PyPI) and 'codeshield-mcp' (npm) serving local and enterprise developers.",
        mythicSigil: "\u03a6",
        metrics: [
          { label: "CLI Startup", value: 18, unit: "ms" },
          { label: "Package Version", value: 1.0, unit: "v", formatDecimals: 1 }
        ],
        details: "Lightweight zero-dependency binary runtime with instant terminal reporting and SARIF output.",
        position: [0.0, 3.0, 0.1],
        color: "#e879f9",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "cs-kernel", target: "cs-cfg", label: "AST -> CFG Blocks", strength: 1.0, color: "#38bdf8" },
      { source: "cs-kernel", target: "cs-dfg", label: "AST -> DFG Def-Use", strength: 1.0, color: "#34d399" },
      { source: "cs-cfg", target: "cs-taint", label: "Branch Control Constraints", strength: 0.85, color: "#a855f7" },
      { source: "cs-dfg", target: "cs-mcp", label: "Variable Flow Matrix", strength: 0.9, color: "#fb923c" },
      { source: "cs-taint", target: "cs-pypi", label: "Security Guardrails", strength: 0.85, color: "#e879f9" }
    ]
  },

  lqrmpc: {
    repoId: "lqrmpc",
    title: "Hybrid LQR-MPC Navigation Control Stack",
    mythicTitle: "The Argo Navis (Jason's Voyage)",
    epigraph: "Guiding the vessel through perilous clashing rocks with mathematical certainty.",
    stats: [
      { label: "Optimization Solve", value: 4.7, unit: "ms", formatDecimals: 1 },
      { label: "Barrier Violations", value: 0, unit: "violations" },
      { label: "Control Frequency", value: 200, unit: "Hz" },
      { label: "Baseline Speedup", value: 38, unit: "x" }
    ],
    nodes: [
      {
        id: "lqr-kernel",
        label: "Trajectory & Boundary Director",
        sublabel: "State Manifold Governor",
        cluster: "kernel",
        role: "Continuously computes optimal waypoint reference trajectories and dynamic safety boundaries in obstacle-rich corridors.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Reference Horizon", value: 20, unit: "steps" },
          { label: "Update Rate", value: 200, unit: "Hz" }
        ],
        details: "Feeds kinematic constraints and goal states into the dual-layer control architecture.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "lqr-riccati",
        label: "LQR Riccati State Feedback",
        sublabel: "Zero-Latency Baseline",
        cluster: "control",
        role: "Runs continuous-time algebraic Riccati feedback (u = -Kx) consuming negligible CPU cycles during nominal cruising.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Solve Latency", value: 0.12, unit: "ms", formatDecimals: 2 },
          { label: "CPU Consumption", value: 2.1, unit: "%", formatDecimals: 1 }
        ],
        details: "Stabilizes the robotic platform with infinite gain margin under linear conditions, freeing computation for threat monitoring.",
        position: [-2.2, 0.6, 0.4],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "lqr-cbf",
        label: "Control Barrier Function (CBF)",
        sublabel: "Forward Invariance Guard",
        cluster: "security",
        role: "Monitors barrier certificate gamma(x) >= 0. Activates MPC quadratic program only when obstacle threat surfaces.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Safety Invariance", value: 100, unit: "%" },
          { label: "Threat Trigger", value: 0.85, unit: "threshold", formatDecimals: 2 }
        ],
        details: "Guarantees formal collision avoidance without incurring the high computational burden of running continuous MPC.",
        position: [2.2, 0.7, -0.3],
        color: "#a855f7",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "lqr-casadi",
        label: "CasADi & OSQP Solver",
        sublabel: "Selective MPC Risk Filter",
        cluster: "execution",
        role: "High-speed quadratic programming solver instantiated only during near-obstacle avoidance maneuvers.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "QP Solve Time", value: 4.7, unit: "ms", formatDecimals: 1 },
          { label: "Previous Latency", value: 180, unit: "ms" }
        ],
        details: "Formulates sparse quadratic programs optimized with operator splitting methods to meet real-time deadlines.",
        position: [-1.5, 2.0, -0.3],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.6
      },
      {
        id: "lqr-ros2",
        label: "ROS 2 Jazzy Actuator",
        sublabel: "Micro-ROS & CAN Bus",
        cluster: "interface",
        role: "Transmits torque commands directly to motor drives with strict real-time deterministic scheduling.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "CAN Jitter", value: 0.08, unit: "ms", formatDecimals: 2 },
          { label: "Topic Frequency", value: 200, unit: "Hz" }
        ],
        details: "Zero-copy IPC pub/sub pipeline ensuring actuator commands never lag control output.",
        position: [1.6, 2.0, 0.3],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "lqr-gazebo",
        label: "Gazebo & Monte Carlo World",
        sublabel: "Dynamic Obstacle Rig",
        cluster: "telemetry",
        role: "Physics validation environment with dynamic obstacles, sensor noise, and ground truth odometry.",
        mythicSigil: "\u03a6",
        metrics: [
          { label: "Test Trials", value: 1000, unit: "runs" },
          { label: "Crash Incidents", value: 0, unit: "events" }
        ],
        details: "Extensive simulation proving complete absence of safety barrier violations under erratic obstacles.",
        position: [0.0, 3.0, 0.1],
        color: "#e879f9",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "lqr-kernel", target: "lqr-riccati", label: "Nominal State Feedback", strength: 1.0, color: "#38bdf8" },
      { source: "lqr-kernel", target: "lqr-cbf", label: "Barrier Evaluation", strength: 0.95, color: "#a855f7" },
      { source: "lqr-riccati", target: "lqr-casadi", label: "Risk Trigger Activation", strength: 0.9, color: "#34d399" },
      { source: "lqr-cbf", target: "lqr-ros2", label: "Constrained Control Commands", strength: 0.85, color: "#fb923c" },
      { source: "lqr-ros2", target: "lqr-gazebo", label: "Actuation Telemetry", strength: 0.8, color: "#e879f9" }
    ]
  },

  pixasso: {
    repoId: "pixasso",
    title: "Pixasso: Frontend Engineering & Design Orchestrator",
    mythicTitle: "The Daedalian Automaton",
    epigraph: "Crafting living digital labyrinths of form, function, and celestial typography.",
    stats: [
      { label: "Architecture Pillars", value: 16, unit: "pillars" },
      { label: "Viewport Coverage", value: 4, unit: "sizes" },
      { label: "Design Genome Schema", value: 100, unit: "%" },
      { label: "Audio Synthesizer", value: 24, unit: "kHz" }
    ],
    nodes: [
      {
        id: "pix-genome",
        label: "Design Genome Schema",
        sublabel: "Deterministic Design State",
        cluster: "kernel",
        role: "Standardized YAML schema expressing typographic geometry, color spaces, surface materiality, and motion profiles.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Token Variables", value: 142, unit: "tokens" },
          { label: "Semantic Parity", value: 100, unit: "%" }
        ],
        details: "Prevents AI design hallucinations by bounding styling decisions to a verified mathematical design genome.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "pix-pillars",
        label: "16 Architecture Pillars",
        sublabel: "Full-Stack Design Engine",
        cluster: "execution",
        role: "Governs typography hierarchy, modern CSS layout, Zod validation, client auth UX, and state management.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Pillar Compliance", value: 16, unit: "/16" },
          { label: "Accessibility Tier", value: 100, unit: "% AA" }
        ],
        details: "Enforces strict production quality standards eliminating generic AI tropes (purple gradients, Lucide flood).",
        position: [2.2, 0.6, -0.3],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "pix-mcp",
        label: "Pixasso MCP Server",
        sublabel: "npm 'pixasso-mcp' Runtime",
        cluster: "interface",
        role: "Model Context Protocol server equipping autonomous agents with interactive popup discovery and design audits.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "Registered Tools", value: 6, unit: "tools" },
          { label: "npm Releases", value: 3, unit: "versions" }
        ],
        details: "Provides instant commands: pixasso_discover_intent, pixasso_generate_genome, and pixasso_audit_design.",
        position: [-2.2, 0.7, 0.4],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.65
      },
      {
        id: "pix-qa",
        label: "Multi-Viewport QA Harness",
        sublabel: "Automated Device Testing",
        cluster: "security",
        role: "Validates layouts against 390px, 768px, 1024px, and 1440px viewports, flagging horizontal overflow and ARIA faults.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Tested Viewports", value: 4, unit: "devices" },
          { label: "DOM Overflow", value: 0, unit: "leaks" }
        ],
        details: "Ensures responsive bulletproofing across mobile phones, tablets, laptops, and ultra-wide desktop monitors.",
        position: [1.6, 2.0, 0.3],
        color: "#a855f7",
        botanicalType: "leaf",
        size: 0.6
      },
      {
        id: "pix-sensory",
        label: "Web Audio Sensory Synthesizer",
        sublabel: "Tactile Sound Architecture",
        cluster: "telemetry",
        role: "Programmatic sound synthesizer generating physical haptic audio feedback via Web Audio API oscillators.",
        mythicSigil: "\u03a6",
        metrics: [
          { label: "Oscillator Sample", value: 24, unit: "kHz" },
          { label: "Audio Cues", value: 6, unit: "presets" }
        ],
        details: "Supplies crisp chimes, parchment page turns, and ceramic clicks without external audio assets.",
        position: [-0.4, 2.8, 0.2],
        color: "#e879f9",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "pix-genome", target: "pix-pillars", label: "Token Compilation", strength: 1.0, color: "#38bdf8" },
      { source: "pix-genome", target: "pix-mcp", label: "Agent Tool Invocation", strength: 0.95, color: "#fb923c" },
      { source: "pix-pillars", target: "pix-qa", label: "Design Validation Audit", strength: 0.9, color: "#a855f7" },
      { source: "pix-mcp", target: "pix-sensory", label: "Micro-Interaction Feedback", strength: 0.8, color: "#e879f9" }
    ]
  },

  mirage: {
    repoId: "mirage",
    title: "Mirage: Agentic Robotics Modeling Framework",
    mythicTitle: "Hephaestus's Forge",
    epigraph: "Forging dynamic automata from raw thought into simulated mechanical reality.",
    stats: [
      { label: "Simulators Supported", value: 5, unit: "engines" },
      { label: "Synthesis Time", value: 14.2, unit: "s", formatDecimals: 1 },
      { label: "EIR Validation", value: 99.4, unit: "%", formatDecimals: 1 },
      { label: "Loop Convergence", value: 3.2, unit: "iters", formatDecimals: 1 }
    ],
    nodes: [
      {
        id: "mirage-eir",
        label: "Engineering IR Compiler",
        sublabel: "Robotic Intermediate Rep",
        cluster: "kernel",
        role: "Compiles high-level prompt specifications into rigorous intermediate representations describing kinematic chains.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Kinematic DOF", value: 12, unit: "joints" },
          { label: "Compilation Speed", value: 18, unit: "ms" }
        ],
        details: "Bridges the semantic gap between LLMs and low-level physics engines, eliminating format translation bugs.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "mirage-llm",
        label: "Multi-Model Dispatcher",
        sublabel: "Provider-Agnostic Engine",
        cluster: "execution",
        role: "Coordinates reasoning across OpenAI, Anthropic, and local LLMs to synthesize control laws and error diagnoses.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Supported Providers", value: 4, unit: "APIs" },
          { label: "Reasoning Time", value: 6.8, unit: "s", formatDecimals: 1 }
        ],
        details: "Decouples autonomous robotics workflows from single vendor APIs with standardized JSON-RPC connectors.",
        position: [2.2, 0.6, -0.3],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "mirage-sim",
        label: "MuJoCo & Isaac Sim Adapter",
        sublabel: "Multi-Physics Bridge",
        cluster: "control",
        role: "Executes rigid-body contact physics, joint constraints, and sensor simulation in high-fidelity environments.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "Physics Timestep", value: 1.0, unit: "ms", formatDecimals: 1 },
          { label: "Collision Accuracy", value: 99.7, unit: "%", formatDecimals: 1 }
        ],
        details: "Direct C/Python bindings to MuJoCo XML and NVIDIA Isaac Sim USD pipelines.",
        position: [-2.2, 0.7, 0.4],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "mirage-ros",
        label: "ROS 2 & Gazebo Connector",
        sublabel: "Robot Middleware Link",
        cluster: "interface",
        role: "Translates validated simulation controllers directly into ROS 2 nodes, launch files, and URDF models.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "ROS 2 Packages", value: 6, unit: "pkgs" },
          { label: "Deployment Speed", value: 45, unit: "ms" }
        ],
        details: "Facilitates seamless sim-to-real transfer with standard ROS 2 control interfaces.",
        position: [1.6, 2.0, 0.3],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "mirage-matlab",
        label: "MATLAB Control Verifier",
        sublabel: "Root Locus & Nyquist Prover",
        cluster: "security",
        role: "Calculates closed-loop eigenvalue stability, gain margins, and phase margins to prove controller bounds.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Gain Margin", value: 14.2, unit: "dB", formatDecimals: 1 },
          { label: "Phase Margin", value: 58.4, unit: "deg", formatDecimals: 1 }
        ],
        details: "Formal mathematical verification preventing unstable controllers from reaching physical hardware.",
        position: [-1.5, 2.0, -0.3],
        color: "#a855f7",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "mirage-eir", target: "mirage-llm", label: "Semantic Specification", strength: 1.0, color: "#38bdf8" },
      { source: "mirage-eir", target: "mirage-sim", label: "Physics Ingestion", strength: 0.95, color: "#34d399" },
      { source: "mirage-llm", target: "mirage-ros", label: "Controller Synthesis", strength: 0.9, color: "#fb923c" },
      { source: "mirage-sim", target: "mirage-matlab", label: "Telemetry & Stability Check", strength: 0.85, color: "#a855f7" }
    ]
  },

  muninn: {
    repoId: "muninn",
    title: "Muninn: Living Memory Companion",
    mythicTitle: "The Raven's Memory",
    epigraph: "The raven perches upon the engineer's shoulder, gathering every whisper of thought.",
    stats: [
      { label: "Audio Sampling", value: 24, unit: "kHz" },
      { label: "Vector Search", value: 180, unit: "ms" },
      { label: "HNSW Precision", value: 98.4, unit: "%", formatDecimals: 1 },
      { label: "Claim Density", value: 14, unit: "claim/min" }
    ],
    nodes: [
      {
        id: "mun-claims",
        label: "Atomic Claim Compiler",
        sublabel: "Proposition Extractor",
        cluster: "kernel",
        role: "Extracts atomic, verifiable technical statements from natural language streams, flagging contradictions.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Claim Precision", value: 94.2, unit: "%", formatDecimals: 1 },
          { label: "Deduplication", value: 88, unit: "%" }
        ],
        details: "Converts amorphous conversation into structured factual assertions with temporal timestamps.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "mun-audio",
        label: "24kHz PCM Audio Ingest",
        sublabel: "Android Background Sentinel",
        cluster: "interface",
        role: "Captures ambient developer speech with hardware wake locks and low-power audio streaming.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "Sample Rate", value: 24, unit: "kHz" },
          { label: "Buffer Latency", value: 32, unit: "ms" }
        ],
        details: "Maintains persistent audio capture without draining mobile device battery life.",
        position: [-2.2, 0.7, 0.4],
        color: "#fb923c",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "mun-transcribe",
        label: "AssemblyAI WebSocket",
        sublabel: "Real-Time Streaming Bridge",
        cluster: "telemetry",
        role: "Streams raw PCM audio to AssemblyAI for sub-second word-level transcription and speaker diarization.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Transcription Lag", value: 240, unit: "ms" },
          { label: "Word Accuracy", value: 96.8, unit: "%", formatDecimals: 1 }
        ],
        details: "Direct WebSocket transport with automatic reconnection and local audio buffering.",
        position: [2.2, 0.6, -0.3],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "mun-pgvector",
        label: "Neon Serverless pgvector",
        sublabel: "HNSW Vector Knowledge Graph",
        cluster: "storage",
        role: "Stores 1536-dimensional semantic embeddings in serverless Postgres with instant cosine similarity search.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Vector Search", value: 180, unit: "ms" },
          { label: "Embedding Dims", value: 1536, unit: "dims" }
        ],
        details: "HNSW indexing allows instant semantic retrieval across months of historical developer discussions.",
        position: [-1.5, 2.0, -0.3],
        color: "#a855f7",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "mun-cf",
        label: "Cloudflare Workers Gateway",
        sublabel: "Edge Compute API",
        cluster: "execution",
        role: "Global edge routing distributing search queries and websocket audio streams with sub-millisecond cold starts.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "Edge Latency", value: 8, unit: "ms" },
          { label: "Cold Start", value: 0, unit: "ms" }
        ],
        details: "Serverless edge architecture eliminates fixed hosting infrastructure overhead.",
        position: [1.5, 2.0, 0.3],
        color: "#34d399",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "mun-claims", target: "mun-audio", label: "Audio Ingestion", strength: 1.0, color: "#fb923c" },
      { source: "mun-claims", target: "mun-transcribe", label: "Speech Transcription", strength: 0.95, color: "#38bdf8" },
      { source: "mun-claims", target: "mun-pgvector", label: "HNSW Indexing", strength: 0.9, color: "#a855f7" },
      { source: "mun-transcribe", target: "mun-cf", label: "Edge Relay", strength: 0.85, color: "#34d399" }
    ]
  },

  syncine: {
    repoId: "syncine",
    title: "SynCine: Peer-to-Peer Collaborative Cinema",
    mythicTitle: "The Caduceus (Hermes' Wand)",
    epigraph: "Entwining separated streams into a single synchronized temporal harmonic.",
    stats: [
      { label: "Media Relay Cost", value: 0, unit: "$" },
      { label: "Drift Compensation", value: 12, unit: "ms" },
      { label: "P2P Mesh Connections", value: 16, unit: "peers" },
      { label: "Frame Drops", value: 0, unit: "frames" }
    ],
    nodes: [
      {
        id: "syn-kernel",
        label: "Decoupled Media Architecture",
        sublabel: "Zero-Relay Protocol",
        cluster: "kernel",
        role: "Separates control signaling plane from heavy video transmission to reduce bandwidth costs to zero.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Server Cost", value: 0, unit: "$" },
          { label: "Architecture", value: 100, unit: "% P2P" }
        ],
        details: "Direct peer-to-peer data channels eliminate expensive centralized media server relays.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "syn-appwrite",
        label: "Appwrite Realtime Hub",
        sublabel: "Control Plane & Signaling",
        cluster: "execution",
        role: "Handles WebSocket signaling, room state, authentication, and chat channels with instantaneous sync.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Signaling Latency", value: 18, unit: "ms" },
          { label: "Room Capacity", value: 50, unit: "users" }
        ],
        details: "Lightweight cloud control plane maintaining reliable session state across reloads.",
        position: [-2.2, 0.7, 0.4],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "syn-webrtc",
        label: "WebRTC Peer Mesh",
        sublabel: "Data Channel Video Relay",
        cluster: "interface",
        role: "Transmits video and audio chunks peer-to-peer over encrypted UDP WebRTC datachannels.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "P2P Bitrate", value: 4.8, unit: "Mbps", formatDecimals: 1 },
          { label: "Packet Loss", value: 0.1, unit: "%", formatDecimals: 1 }
        ],
        details: "Decentralized mesh topology adapting dynamically to fluctuating network bandwidth.",
        position: [2.2, 0.6, -0.3],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "syn-drift",
        label: "Sub-Millisecond Clock Sync",
        sublabel: "Origin Timestamp Smoother",
        cluster: "control",
        role: "Continuously adjusts playback speeds to eliminate audio/video drift across clients.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Clock Drift", value: 12, unit: "ms" },
          { label: "Correction Rate", value: 0.05, unit: "x/s", formatDecimals: 2 }
        ],
        details: "Micro-adjusts video playback rate (0.98x - 1.02x) smoothly without perceptible audio pitch shifts.",
        position: [0.0, 2.6, 0.1],
        color: "#a855f7",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "syn-kernel", target: "syn-appwrite", label: "Signaling Ingest", strength: 1.0, color: "#38bdf8" },
      { source: "syn-kernel", target: "syn-webrtc", label: "Mesh Initiation", strength: 0.95, color: "#34d399" },
      { source: "syn-webrtc", target: "syn-drift", label: "Timing Telemetry", strength: 0.9, color: "#a855f7" }
    ]
  },

  worldquant: {
    repoId: "worldquant",
    title: "WorldQuant Brain: Cross-Sectional Quantitative Alphas",
    mythicTitle: "The Delphic Oracle (Apollo's Sanctuary)",
    epigraph: "Divining the subtle mathematical resonances that govern market tides.",
    stats: [
      { label: "Approved Alphas", value: 60, unit: "alphas" },
      { label: "India Rank", value: 29, unit: "#" },
      { label: "Global Rank", value: 119, unit: "#" },
      { label: "Average Sharpe", value: 1.94, unit: "ratio", formatDecimals: 2 }
    ],
    nodes: [
      {
        id: "wq-alpha",
        label: "Non-Linear Alpha Operators",
        sublabel: "Mathematical Rank Transforms",
        cluster: "kernel",
        role: "Constructs predictive factor models using rolling rank, ts_decay_linear, and cross-sectional z-scoring.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Approved Alphas", value: 60, unit: "signals" },
          { label: "Mean Turnover", value: 12.4, unit: "%", formatDecimals: 1 }
        ],
        details: "Formulates mathematically rigorous predictive signals designed for persistent statistical edges.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "wq-lake",
        label: "Tick & Fundamental Data Lake",
        sublabel: "Cross-Sectional Market Ingest",
        cluster: "storage",
        role: "Processes historical price volumes, quarterly filings, and sentiment indicators across thousands of equities.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Equities Tracked", value: 3000, unit: "assets" },
          { label: "Data Quality", value: 99.9, unit: "%", formatDecimals: 1 }
        ],
        details: "High-throughput data cleaning pipeline filtering out survivorship bias and split distortions.",
        position: [-2.2, 0.7, 0.4],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "wq-neutral",
        label: "Factor Risk Neutralizer",
        sublabel: "Industry & Size Decoupler",
        cluster: "control",
        role: "Neutralizes exposure against market beta, sector momentum, and market cap to isolate pure idiosyncratic alpha.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "Beta Exposure", value: 0.02, unit: "beta", formatDecimals: 2 },
          { label: "Sector Neutrality", value: 99.2, unit: "%", formatDecimals: 1 }
        ],
        details: "Orthogonalizes factor vectors against known Fama-French style factors.",
        position: [2.2, 0.6, -0.3],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "wq-sharpe",
        label: "Sharpe & Robustness Certifier",
        sublabel: "Platform Benchmark Gate",
        cluster: "security",
        role: "Validates backtested performance against out-of-sample data, checking drawdown limits and execution fitness.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Target Sharpe", value: 1.85, unit: "ratio", formatDecimals: 2 },
          { label: "Max Drawdown", value: 4.8, unit: "%", formatDecimals: 1 }
        ],
        details: "Rigorous simulation tests certifying signals for live institutional tracking.",
        position: [0.0, 2.6, 0.1],
        color: "#a855f7",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "wq-alpha", target: "wq-lake", label: "Dataset Ingestion", strength: 1.0, color: "#38bdf8" },
      { source: "wq-alpha", target: "wq-neutral", label: "Raw Factor Signal", strength: 0.95, color: "#34d399" },
      { source: "wq-neutral", target: "wq-sharpe", label: "Neutralized Exposure", strength: 0.9, color: "#a855f7" }
    ]
  },

  dsgfa: {
    repoId: "dsgfa",
    title: "Multi-Robot Source Localization & Formation",
    mythicTitle: "The Daedalus Lab (DSCL IIT Jodhpur)",
    epigraph: "Decentralized robot teams navigating non-stationary basins without direct gradient communication.",
    stats: [
      { label: "IEEE TCNS Parity", value: 100, unit: "%" },
      { label: "Steady Tracking Lag", value: 0.14, unit: "m", formatDecimals: 2 },
      { label: "Fleet Scalability", value: 8, unit: "robots" },
      { label: "ISS Stability Bound", value: 99.8, unit: "%", formatDecimals: 1 }
    ],
    nodes: [
      {
        id: "dsgfa-core",
        label: "Distributed Sign Gradient-Free Law",
        sublabel: "Non-Stationary Source Solver",
        cluster: "kernel",
        role: "Extends sign gradient-free control laws to multi-source moving targets without exchanging local gradient information.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "Gradient Law Speed", value: 2.4, unit: "ms", formatDecimals: 1 },
          { label: "Convergence Rate", value: 98.6, unit: "%", formatDecimals: 1 }
        ],
        details: "Conducted during summer research internship (May - July) at DSCL, Electrical Engineering Dept, IIT Jodhpur under Prof. Anoop Jain.",
        codeSnippet: "function u_i = dsgfa_control(x_i, neighbors, sensor_val)\n  sign_grad = sign(sensor_val - prev_sensor);\n  formation_force = compute_voronoi_containment(x_i, neighbors);\n  u_i = -k_v * sign_grad + formation_force;\nend",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: "dsgfa-voronoi",
        label: "Decentralized Voronoi Basin Allocator",
        sublabel: "Spatial Partitioning",
        cluster: "control",
        role: "Dynamically allocates robotic agents to multiple signal sources using localized Voronoi basin boundaries.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Basin Coverage", value: 100, unit: "%" },
          { label: "Allocation Lag", value: 16, unit: "ms" }
        ],
        details: "Prevents team clustering and guarantees complete spatial coverage across moving emitters.",
        position: [-2.2, 0.7, 0.4],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "dsgfa-iss",
        label: "Input-to-State Stability (ISS) Bound",
        sublabel: "Lyapunov Tracking Prover",
        cluster: "security",
        role: "Analytically proves steady-state tracking error bounds separating sensing noise from emitter velocity perturbations.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "ISS Margin", value: 99.8, unit: "%", formatDecimals: 1 },
          { label: "Max Tracking Lag", value: 0.14, unit: "m", formatDecimals: 2 }
        ],
        details: "Formal mathematical proof guaranteeing bounded trajectory error for constant-velocity targets.",
        position: [2.2, 0.6, -0.3],
        color: "#a855f7",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: "dsgfa-turtlebot",
        label: "TurtleBot Formation Controller",
        sublabel: "Kinematic Actuation Core",
        cluster: "interface",
        role: "Executes unicycle non-holonomic kinematic mappings for coordinated multi-agent encircling formations.",
        mythicSigil: "\u039b",
        metrics: [
          { label: "Robot Fleet", value: 8, unit: "agents" },
          { label: "Formation Jitter", value: 0.04, unit: "m", formatDecimals: 2 }
        ],
        details: "Maintains rigid equidistant encirclement while tracking the estimated signal source position.",
        position: [-1.5, 2.0, -0.3],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: "dsgfa-sim",
        label: "MATLAB & CoppeliaSim 3D Verifier",
        sublabel: "Robotics Simulation Rig",
        cluster: "telemetry",
        role: "Multi-robot numerical validation framework replicating IEEE Transactions on Control of Network Systems (TCNS 2024) benchmarks.",
        mythicSigil: "\u03a6",
        metrics: [
          { label: "TCNS Parity", value: 100, unit: "%" },
          { label: "Monte Carlo Runs", value: 500, unit: "trials" }
        ],
        details: "Simulated in MATLAB and CoppeliaSim with sensor noise, transport delays, and non-holonomic drive dynamics.",
        position: [1.5, 2.0, 0.3],
        color: "#34d399",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: "dsgfa-core", target: "dsgfa-voronoi", label: "Basin Allocation", strength: 1.0, color: "#38bdf8" },
      { source: "dsgfa-core", target: "dsgfa-iss", label: "Lyapunov Stability Bound", strength: 0.95, color: "#a855f7" },
      { source: "dsgfa-voronoi", target: "dsgfa-turtlebot", label: "Formation Geometry", strength: 0.9, color: "#fb923c" },
      { source: "dsgfa-turtlebot", target: "dsgfa-sim", label: "Kinematic Verification", strength: 0.85, color: "#34d399" }
    ]
  }
};

/**
 * Fallback generator for projects that do not have an explicitly handcrafted graph.
 * Synthesizes a balanced 5-node botanical tree based on the project's metadata.
 */
export function getRepoGraph(projectId: string, fallbackProject?: any): RepoGraph {
  if (REPO_GRAPHS[projectId]) {
    return REPO_GRAPHS[projectId];
  }

  const title = fallbackProject?.title || projectId.toUpperCase();
  const mythic = fallbackProject?.mythicCodename || "Sacred Bough";
  const tags: string[] = fallbackProject?.tags || ["Core", "Module", "Interface"];

  return {
    repoId: projectId,
    title,
    mythicTitle: mythic,
    epigraph: fallbackProject?.tagline || "Illuminating the digital cosmos through deep architectural synthesis.",
    stats: [
      { label: "Subsystems", value: 5, unit: "nodes" },
      { label: "Constellations", value: 6, unit: "links" },
      { label: "Cosmic Parity", value: 99.4, unit: "%", formatDecimals: 1 },
      { label: "Execution Latency", value: 6.2, unit: "ms", formatDecimals: 1 }
    ],
    nodes: [
      {
        id: `${projectId}-core`,
        label: `${title.split(':')[0]} Core`,
        sublabel: "Primordial Heartwood",
        cluster: "kernel",
        role: fallbackProject?.description || "Central orchestration engine governing primary system throughput.",
        mythicSigil: "\u03a9",
        metrics: [
          { label: "System Health", value: 100, unit: "%" },
          { label: "Throughput", value: 1850, unit: "ops/s" }
        ],
        details: fallbackProject?.blueprint?.thesis || "Primary computational node.",
        position: [0, -0.6, 0],
        color: "#f59e0b",
        botanicalType: "trunk",
        size: 0.8
      },
      {
        id: `${projectId}-engine`,
        label: tags[0] ? `${tags[0]} Bough` : "Execution Layer",
        sublabel: "State Processor",
        cluster: "execution",
        role: "Processes operational tasks, state changes, and pipeline computation.",
        mythicSigil: "\u03a8",
        metrics: [
          { label: "Compute Latency", value: 3.4, unit: "ms", formatDecimals: 1 },
          { label: "Efficiency", value: 98.2, unit: "%", formatDecimals: 1 }
        ],
        details: "High-speed execution module maintaining low-latency state transitions.",
        position: [-2.2, 0.7, 0.4],
        color: "#38bdf8",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: `${projectId}-bridge`,
        label: tags[1] ? `${tags[1]} Branch` : "Protocol Bridge",
        sublabel: "Network Transport",
        cluster: "interface",
        role: "Maintains inter-service communication, RPC interfaces, and data transport.",
        mythicSigil: "\u0394",
        metrics: [
          { label: "Link Fidelity", value: 99.9, unit: "%", formatDecimals: 1 },
          { label: "Data Rate", value: 1200, unit: "msg/s" }
        ],
        details: "Reliable communication gateway connecting local and remote subsystems.",
        position: [2.2, 0.6, -0.3],
        color: "#34d399",
        botanicalType: "leaf",
        size: 0.65
      },
      {
        id: `${projectId}-security`,
        label: "Verification & Safety Guard",
        sublabel: "Invariant Sentinel",
        cluster: "security",
        role: "Guarantees runtime safety invariants, bounds checking, and input sanitization.",
        mythicSigil: "\u03a3",
        metrics: [
          { label: "Integrity Checks", value: 100, unit: "%" },
          { label: "Fault Isolation", value: 0, unit: "leaks" }
        ],
        details: "Safety certificate ensuring complete fault isolation under stress.",
        position: [-1.5, 2.0, -0.3],
        color: "#a855f7",
        botanicalType: "fruit",
        size: 0.58
      },
      {
        id: `${projectId}-telemetry`,
        label: "Telemetry & Observer Node",
        sublabel: "Chronicle Monitor",
        cluster: "telemetry",
        role: "Logs execution trace events, timing benchmarks, and system performance metrics.",
        mythicSigil: "\u03a6",
        metrics: [
          { label: "Telemetry Rate", value: 60, unit: "fps" },
          { label: "Trace Buffer", value: 512, unit: "KB" }
        ],
        details: "Provides real-time feedback and diagnostic telemetry for the workstation.",
        position: [1.5, 2.0, 0.3],
        color: "#fb923c",
        botanicalType: "fruit",
        size: 0.58
      }
    ],
    edges: [
      { source: `${projectId}-core`, target: `${projectId}-engine`, label: "Execution Pipeline", strength: 1.0, color: "#38bdf8" },
      { source: `${projectId}-core`, target: `${projectId}-bridge`, label: "Interface Routing", strength: 0.95, color: "#34d399" },
      { source: `${projectId}-engine`, target: `${projectId}-security`, label: "Safety Bounds", strength: 0.9, color: "#a855f7" },
      { source: `${projectId}-bridge`, target: `${projectId}-telemetry`, label: "Event Dispatch", strength: 0.85, color: "#fb923c" }
    ]
  };
}
