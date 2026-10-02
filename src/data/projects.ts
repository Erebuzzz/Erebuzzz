export interface Project {
  id: string;
  title: string;
  mythicCodename: string;
  tagline: string;
  description: string;
  categories: ('flagship' | 'robotics' | 'security' | 'quant' | 'ai')[];
  tags: string[];
  metric?: string;
  githubUrl?: string;
  liveUrl?: string;
  pypiUrl?: string;
  npmUrl?: string;
  docsUrl?: string;
  blueprint: {
    thesis: string;
    pipeline: string;
    highlights: string[];
    stack: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: "codeshield",
    title: "CodeShield: AST Taint & Graph Verification",
    mythicCodename: "The Aegis of Athena",
    tagline: "CFG, DFG, and taint graphs for AI-generated code. Trust the graph, not the vibes.",
    description: "A local-first verification firewall that parses AI-generated code with tree-sitter, builds Control-Flow and Data-Flow Graphs, and hunts taint leaks, shell injections, and secrets before execution.",
    categories: ["flagship", "security"],
    tags: ["Python", "tree-sitter", "CFG/DFG", "MCP Server", "Security AST"],
    metric: "PyPI + npm Released",
    githubUrl: "https://github.com/Erebuzzz/CodeShield",
    liveUrl: "https://codeshield-five.vercel.app",
    pypiUrl: "https://pypi.org/project/codeshield-ai/",
    npmUrl: "https://www.npmjs.com/package/codeshield-mcp",
    docsUrl: "https://codeshield-five.vercel.app",
    blueprint: {
      thesis: "LLM-generated code frequently contains subtle taint flows, shell injections, unsafe evals, and leaked API credentials. Rather than relying on fuzzy heuristics, CodeShield constructs deterministic program graphs using tree-sitter AST queries to prove code safety mathematically before execution.",
      pipeline: "Source File -> tree-sitter AST -> Control-Flow Graph (CFG) -> Data-Flow Graph (DFG) -> Taint Propagation Matrix -> Model Context Protocol (MCP) Server & CLI Report",
      highlights: [
        "Released as PyPI package 'codeshield-ai' and npm tool 'codeshield-mcp'.",
        "Deterministic taint tracking across source-to-sink variable assignments.",
        "Zero-latency local-first scanning with automated AST query caches.",
        "Direct MCP server integration for agent environments."
      ],
      stack: "Python, tree-sitter, NetworkX, MCP Protocol, Node.js wrapper"
    }
  },
  {
    id: "lqrmpc",
    title: "Risk-Aware Hybrid LQR-MPC Navigation",
    mythicCodename: "The Argo Navis",
    tagline: "Predictive risk filtering cutting optimization latency from 180 ms to 4.7 ms.",
    description: "Hybrid Linear Quadratic Regulator (LQR) baseline paired with predictive risk assessment that activates Model Predictive Control selectively under dynamic constraints in obstacle-ridden corridors.",
    categories: ["flagship", "robotics"],
    tags: ["Python", "ROS 2 Jazzy", "Gazebo", "CasADi", "OSQP", "IPOPT"],
    metric: "4.7 ms Latency",
    githubUrl: "https://github.com/Erebuzzz/control-systems",
    blueprint: {
      thesis: "Nonlinear Model Predictive Control (MPC) delivers optimal trajectories but suffers prohibitive latency spikes (180ms) when navigating fast dynamic obstacles. This architecture runs an ultra-lean LQR controller as baseline, activating a constrained quadratic-programming MPC risk filter only when safety barrier certificates approach zero.",
      pipeline: "State Vector x_k -> LQR Riccati Gain K -> Barrier Function Check gamma(x) >= 0 -> CasADi/OSQP Quadratic Program (4.7 ms) -> ROS 2 Jazzy Actuation",
      highlights: [
        "Slashed optimization solve latency from 180 ms to 4.7 ms in Monte Carlo Gazebo tests.",
        "Zero barrier violations across heavily dynamic obstacle scenarios.",
        "Seamless integration with ROS 2 Jazzy and Gazebo multi-robot worlds.",
        "Analytical stability bounds validated under process noise."
      ],
      stack: "Python, ROS 2 Jazzy, CasADi, OSQP, IPOPT, Gazebo"
    }
  },
  {
    id: "mirage",
    title: "Mirage: Agentic Robotics Modeling Framework",
    mythicCodename: "Hephaestus's Forge",
    tagline: "Autonomous robotics controller synthesis and simulation engine.",
    description: "An agentic robotics framework that automates simulation, controller generation, and multi-physics verification across ROS 2, Gazebo, MuJoCo, Isaac Sim, and MATLAB using provider-agnostic MCP orchestration.",
    categories: ["flagship", "robotics", "ai"],
    tags: ["Python", "ROS 2", "MuJoCo", "Isaac Sim", "MATLAB", "MCP"],
    metric: "Multi-Simulator MCP",
    githubUrl: "https://github.com/Unstable-Kernel/MIRAGE",
    docsUrl: "https://unstable-kernel.github.io/docs",
    blueprint: {
      thesis: "Designing robotics control stacks requires constant human context switching between CAD formats, URDF models, Gazebo plugins, and MuJoCo XMLs. Mirage introduces an Engineering Intermediate Representation (EIR) allowing autonomous agents to formulate, simulate, evaluate, and tune controllers in an automated loop.",
      pipeline: "Natural Language / Goal Spec -> EIR Compiler -> MCP Simulator Adapters -> MuJoCo / Isaac Sim / Gazebo Run -> Performance Evaluation -> Iterative Tuning",
      highlights: [
        "Provider-agnostic LLM integration supporting OpenAI, Anthropic, and local models.",
        "Multi-runtime execution across ROS 2, Gazebo, MuJoCo, Isaac Sim, and MATLAB.",
        "Automated simulation error diagnosis and gain re-tuning.",
        "Foundational initiative of the Unstable Kernel research lab."
      ],
      stack: "Python, ROS 2, Gazebo, MuJoCo, Isaac Sim, MATLAB, MCP"
    }
  },
  {
    id: "dsgfa",
    title: "Multi-Robot Source Localization & Formation",
    mythicCodename: "The Daedalus Lab",
    tagline: "Distributed sign gradient-free multi-source localization and formation.",
    description: "Research intern at DSCL IIT Jodhpur under Prof. Anoop Jain: Extended distributed sign gradient-free laws to multi-source and non-stationary targets with Voronoi basin containment and ISS tracking bounds.",
    categories: ["robotics"],
    tags: ["MATLAB", "Simulink", "Voronoi", "ISS Bounds", "TurtleBot"],
    metric: "IEEE TCNS Parity",
    githubUrl: "https://github.com/Erebuzzz/SSL_n_F_DSGFA",
    blueprint: {
      thesis: "Extends Simultaneous Source Localization and Formation (IEEE Transactions on Control of Network Systems 2024) to non-stationary and multi-source environments without direct gradient communication.",
      pipeline: "Distributed Sign Gradient-Free Law -> Decentralized Robot-Team Allocation -> Voronoi Basin Containment -> ISS Tracking Bound -> MATLAB & CoppeliaSim Verification",
      highlights: [
        "Derived Input-to-State Stability (ISS) tracking bound separating sensing noise from source motion error.",
        "Proved exact steady-state tracking lag for constant-velocity moving targets.",
        "Decentralized Voronoi basin allocation for multi-source assignment.",
        "Full MATLAB numerical reproduction and CoppeliaSim 3D multi-robot simulation."
      ],
      stack: "MATLAB, Simulink, CoppeliaSim, TurtleBot, Control Theory"
    }
  },
  {
    id: "worldquant",
    title: "WorldQuant Brain Quantitative Alphas",
    mythicCodename: "The Delphic Oracle",
    tagline: "60+ benchmark-approved systematic alphas and predictive factor models.",
    description: "Quantitative Research Consultant at WorldQuant Brain: Engineered 60+ benchmark-approved cross-sectional alpha signals across equities. Ran robustness testing, signal validation, and performance attribution.",
    categories: ["quant"],
    tags: ["Statistical Modeling", "Alpha Generation", "Risk Modeling", "Signal Processing"],
    metric: "India #29 / Global #119",
    githubUrl: "https://github.com/Erebuzzz/WQ-Brain",
    blueprint: {
      thesis: "Extracting persistent statistical edges in cross-sectional equity markets requires disciplined hypothesis-driven factor research, non-linear mathematical transforms, and strict risk factor neutralization.",
      pipeline: "Price & Fundamental Datasets -> Cross-Sectional Ranking Operators -> Volatility Scaling -> Neutralization & Risk Attribution -> Platform Benchmark Approval",
      highlights: [
        "International Quant Championship 2025: India Rank #29 and Global Rank #119 (Stage 1).",
        "Over 60 approved quantitative alphas meeting strict Sharpe and turnover criteria.",
        "Sub-factor neutralization across industry, momentum, and size exposures.",
        "Automated simulation and API submission workflows."
      ],
      stack: "Python, WorldQuant Brain Platform, Pandas, NumPy, Optimization"
    }
  },
  {
    id: "syncine",
    title: "SynCine: Peer-to-Peer Collaborative Cinema",
    mythicCodename: "The Caduceus",
    tagline: "Control plane vs media plane. Appwrite talks. WebRTC carries the movie.",
    description: "Collaborative watch rooms without expensive media servers. Signaling, rooms, and chat sit on Appwrite Realtime. Video streams peer-to-peer over a high-efficiency WebRTC mesh with sub-millisecond drift compensation.",
    categories: ["flagship", "ai"],
    tags: ["TypeScript", "Vite", "WebRTC", "Appwrite", "Realtime"],
    metric: "Live P2P Mesh",
    githubUrl: "https://github.com/Erebuzzz/SynCine",
    liveUrl: "https://syncine.confluxa.app",
    blueprint: {
      thesis: "Traditional watch parties rely on expensive central media relay servers (SFUs) that rack up huge bandwidth bills. SynCine decouples the control plane (Appwrite) from the media plane, using WebRTC peer-to-peer data channels and canvas streams.",
      pipeline: "Host Playback Event -> Origin Timestamp Injection -> Appwrite Realtime Channel -> WebRTC Peer Mesh -> Drift Compensation Engine",
      highlights: [
        "Zero media server costs: all video streams peer-to-peer.",
        "Sub-frame synchronization using origin timestamps and drift smoothing.",
        "Supports screen sharing, local video file broadcast, and YouTube sync.",
        "Full test coverage with Vitest and Appwrite cloud persistence."
      ],
      stack: "TypeScript, Vite, WebRTC, Appwrite Realtime, Tailwind CSS"
    }
  },
  {
    id: "norn",
    title: "NORN: Network for Obligation Routing & Netting",
    mythicCodename: "The Fates' Ledger",
    tagline: "Multilateral debt netting protocol for autonomous AI agent economies.",
    description: "As autonomous AI agents consume machine-to-machine APIs and services, settling every transaction onchain incurs prohibitive gas fees. NORN compresses cyclic obligations across agent debt graphs before settlement epochs.",
    categories: ["quant", "security"],
    tags: ["Rust", "Arbitrum Stylus", "Graph Netting", "EIP-712", "x402"],
    metric: "Stylus Rust Contract",
    githubUrl: "https://github.com/Erebuzzz/norn",
    blueprint: {
      thesis: "In high-frequency autonomous agent service networks, circular financial obligations (Agent A owes B, B owes C, C owes A) can be netted off-chain and verified via formal zero-knowledge or Stylus WASM proofs, compressing total settlement transactions by up to 80%.",
      pipeline: "EIP-712 Signed Obligations -> Cyclic Graph Cancellation Engine -> Arbitrum Stylus Rust Contract -> Compressed Settlement Batch",
      highlights: [
        "Rust smart contract compiled to WebAssembly via Arbitrum Stylus.",
        "Bilateral and multilateral cycle reduction algorithms.",
        "Conservation-of-value invariants mathematically verified.",
        "Zero-gas off-chain netting with on-chain cryptographic settlement proofs."
      ],
      stack: "Rust, Arbitrum Stylus, WASM, EIP-712, Graph Theory"
    }
  },
  {
    id: "muninn",
    title: "Muninn: Living Memory Companion",
    mythicCodename: "The Raven's Memory",
    tagline: "Continuous context capture and relational knowledge graphs for engineering.",
    description: "Converts spoken audio turns into discrete verifiable atomic claims and constructs a relational vector knowledge graph, eliminating lost momentum across long-running development projects.",
    categories: ["flagship", "ai"],
    tags: ["TypeScript", "Cloudflare Workers", "Neon pgvector", "AssemblyAI", "Next.js"],
    metric: "Living Memory Graph",
    githubUrl: "https://github.com/Erebuzzz/Muninn",
    blueprint: {
      thesis: "Engineers constantly lose mental context when switching between terminal tasks, meetings, and commits. Muninn continuously records audio, extracts structured claims, and embeds them into a vector graph for instant conversational recall.",
      pipeline: "Audio Stream (24kHz PCM16) -> AssemblyAI WebSocket -> Claim Extraction Gateway -> Neon pgvector -> Next.js 15 Assistant Interface",
      highlights: [
        "Edge-first deployment on Cloudflare Workers and Neon serverless Postgres.",
        "Automatic contradiction detection across spoken statements.",
        "Android background recording service with hardware wake locks.",
        "Real-time semantic search over months of technical thoughts."
      ],
      stack: "TypeScript, Cloudflare Workers, Neon pgvector, AssemblyAI, Next.js 15"
    }
  },
  {
    id: "softfinger",
    title: "Adaptive Control for Soft Robotic Finger",
    mythicCodename: "The Talos Construct",
    tagline: "4th-order electromechanical modeling and adaptive PID control under load variation.",
    description: "Servo-driven compliant robotic finger with transport delay. Benchmarked classical Ziegler-Nichols, RLS ARX identification with adaptive gains, Fuzzy Adaptive PID (3.87% overshoot), and Extremum Seeking Control.",
    categories: ["robotics"],
    tags: ["MATLAB", "Simulink", "Fuzzy Adaptive PID", "RLS ARX", "ESC"],
    metric: "3.87% Overshoot",
    blueprint: {
      thesis: "Compliant robotic fingers suffer from severe load-varying dynamics and non-negligible transport delay, causing classical fixed-gain PID controllers to exhibit extreme overshoot or instability. Online recursive identification and fuzzy adaptation preserve tight settling bounds.",
      pipeline: "DC Motor + Compliant Tendon -> RLS ARX(2,2) Parameter Estimator -> SIMC Constraint Law -> Fuzzy Adaptive Inference -> Torque Command",
      highlights: [
        "Fuzzy Adaptive PID achieved 3.87% overshoot and 4.56s settling under sudden load jumps.",
        "Extremum Seeking Control (ESC) reduced steady-state error to 0.05 degrees.",
        "Proved classical Ziegler-Nichols becomes unstable on the delay-dominant plant.",
        "Complete SIMULINK electromechanical model with compliant tendon elasticity."
      ],
      stack: "MATLAB, Simulink, System Identification, Fuzzy Logic, Adaptive Control"
    }
  },
  {
    id: "pixasso",
    title: "Pixasso: Frontend Engineering & Design Orchestrator",
    mythicCodename: "The Daedalian Automaton",
    tagline: "16-pillar frontend architecture, MCP server, typography direction, and automated QA for AI agents.",
    description: "The complete end-to-end design orchestrator and MCP server for autonomous agents. Synthesizes Design Genomes, executes 16 frontend pillars, coordinates 3D WebGL, and enforces WCAG AA multi-viewport test automation.",
    categories: ["flagship", "ai"],
    tags: ["TypeScript", "npm", "MCP Server", "Tailwind CSS", "Design Systems", "Automated QA"],
    metric: "npm v1.1.0 Released",
    githubUrl: "https://github.com/Erebuzzz/pixasso",
    npmUrl: "https://www.npmjs.com/package/pixasso-mcp",
    liveUrl: "https://pixasso.erebuzzz.tech",
    blueprint: {
      thesis: "AI coding assistants frequently generate generic purple gradients, Lucide icon flooding, and broken responsive layouts. Pixasso provides a machine-readable Design Genome schema and an MCP server that governs all 16 pillars of frontend architecture with rigorous automated testing.",
      pipeline: "Agent Intent Discovery -> Design Genome YAML -> Task DAG -> 16 Architecture Pillars -> Automated Multi-Viewport QA",
      highlights: [
        "Published official npm package 'pixasso-mcp' with Model Context Protocol tooling.",
        "Automated testing across 390px, 768px, 1024px, and 1440px viewports.",
        "Full support for 3D WebGL, modern CSS typography scales, and sensory audio synthesis.",
        "Deterministic design audit engine eliminating generic AI styling anti-patterns."
      ],
      stack: "TypeScript, Node.js, MCP Protocol, npm, React, Tailwind CSS"
    }
  },
  {
    id: "merge",
    title: "Merge: YouTube Music Taste Blender",
    mythicCodename: "Apollo's Chariot",
    tagline: "Algorithmic taste intersection and shared playlist synthesis.",
    description: "Invite and paste modes for joint musical taste exploration. Normalizes track metadata via ytmusicapi, runs distributed Celery blend tasks, and exports algorithmic discoveries directly to OAuth playlists.",
    categories: ["flagship"],
    tags: ["Next.js", "FastAPI", "Postgres", "Celery", "Redis"],
    metric: "Live Web App",
    githubUrl: "https://github.com/Erebuzzz/merge-ytm",
    liveUrl: "http://merge.erebuzzz.tech",
    blueprint: {
      thesis: "Two friends sharing music often struggle to find common ground between disparate genres. Merge computes the mathematical intersection and mutual transition paths across listening histories.",
      pipeline: "User Playlist Ingest -> ytmusicapi Normalization -> Celery Asynchronous Blend Task -> Taste Graph Matching -> OAuth Playlist Export",
      highlights: [
        "Asynchronous task queues using Celery and Redis to handle large library analysis.",
        "Direct export to authenticated YouTube Music accounts.",
        "Generates shared, each-side, and discovery exploration buckets.",
        "Built with modern Next.js and FastAPI microservices."
      ],
      stack: "Next.js, FastAPI, Postgres, Celery, Redis, Docker"
    }
  },
  {
    id: "simweaver",
    title: "SimWeaver: Multi-Agent Simulation Engineer",
    mythicCodename: "The Weavers of Fate",
    tagline: "Multi-agent robotics engineering loop: EIR -> simulate -> evaluate -> diagnose -> iterate.",
    description: "Compiles natural-language robotics intent into an Engineering Intermediate Representation (EIR), then runs an autonomous multi-agent loop of simulation, evaluation, diagnosis, and iterative controller refinement.",
    categories: ["robotics", "ai"],
    tags: ["Python", "FastAPI", "EIR", "Multi-Agent", "Simulation"],
    metric: "Live Control Room",
    githubUrl: "https://github.com/Erebuzzz/SimWeaver",
    liveUrl: "https://simweaver.vercel.app",
    blueprint: {
      thesis: "Autonomous robotics controller synthesis fails when agents lack a formal intermediate representation between high-level prompt specifications and low-level physics simulation joints.",
      pipeline: "User Specification -> EIR Compiler -> Multi-Agent Diagnostic Loop -> Simulation Harness -> Validated Controller",
      highlights: [
        "Live control room dashboard deployed on Vercel.",
        "Structured intermediate representations prevent agent hallucinations.",
        "Automated simulation failure root-cause analysis.",
        "Supports robotic arms, mobile platforms, and quadruped rigs."
      ],
      stack: "Python, FastAPI, EIR, Multi-Agent Architecture, Next.js"
    }
  },
  {
    id: "asciiraw",
    title: "ASCII Raw: 4K Retro Bayer Dithering Camera",
    mythicCodename: "Optics of Daedalus",
    tagline: "High-performance browser HTML5 Canvas ASCII camera in an interactive cyberpunk HUD.",
    description: "Browser-based ASCII camera featuring real-time image processing, mathematical RGB/CMYK pixel snapping, classic retro Bayer dithering, and 4K print-quality exports.",
    categories: ["flagship"],
    tags: ["TypeScript", "HTML5 Canvas", "WebGL", "Dithering", "Cyberpunk HUD"],
    metric: "4K Print Export",
    githubUrl: "https://github.com/Erebuzzz/ascii-raw",
    liveUrl: "http://asciiraw.erebuzzz.tech",
    blueprint: {
      thesis: "High-frame-rate pixel dithering in browser environments requires optimized raw Uint8ClampedArray manipulation and integer luminance weighting without garbage collection spikes.",
      pipeline: "Webcam Video Stream -> Canvas 2D / WebGL Pixel Buffer -> Bayer Matrix Dithering -> ASCII Glyph Snapping -> 4K PNG / Vector Export",
      highlights: [
        "Live retro cyberpunk HUD camera deployed at asciiraw.erebuzzz.tech.",
        "Real-time 60 FPS ASCII rendering with zero frame drops.",
        "Print-ready 4K resolution image exports.",
        "Custom Bayer dithering matrix and CMYK palette separation."
      ],
      stack: "TypeScript, HTML5 Canvas, Web Audio, CSS Custom Properties"
    }
  }
];
