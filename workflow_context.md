# Workflow context: Erebuzzz profile README

Use this if another agent continues after the software/tools/robotics README pass.

## Repo

- Special profile repo: https://github.com/Erebuzzz/Erebuzzz
- Profile surface: https://github.com/Erebuzzz
- Default branch: `main`
- Feature branch for this work: `cursor/profile-readme-software-focus-9fd1`
- Extra file already on `main`: `CNAME` -> `erebuzzz.me` (leave it)

GitHub only renders `README.md` from the default branch on the profile. A PR updates the visible profile only after merge. Do not merge unless asked.

## What changed (this pass)

Final owner clarification for PR #2:

- Keep header QR Consultant / WorldQuant badge
- Keep whoami part-time **Quantitative Research Consultant** at WorldQuant
- Restore a **Quant** skills subsection (Alpha Generation, Signal Processing, Risk Modeling, Systematic Trading, WorldQuant Brain). No numeric claims on those badges
- Do **not** mention 60+ alphas or IQC 2025 Stage 1 India #29 / Global #119
- Do **not** include the museum bullet about quant experiments
- No CPI / GPA anywhere
- Rest of whoami still leans software, tools, and robotics
- Non-Quant skills stay evidence-based from public repos
- Featured builds, socials, Unstable Kernel blurb, Pixasso, SimWeaver, Merge left in place

## Hard constraints (still apply)

- No em dashes (`—`) and no `--` used as an em dash in prose
- Markdown `---` rules, CLI-style headings (`skills --verbose`), and shields.io hyphen escaping (`LQR--MPC`, `tree--sitter`) are allowed
- Do not invent metrics, stars, or unlisted projects
- Graduation is **April 2027**, not May
- Degree: IISER Bhopal, BS Engineering Science, ECE
- WorldQuant: keep the header QR Consultant badge and the part-time Quantitative Research Consultant sentence. Keep a Quant skills group with label-only badges. Do **not** put alpha counts, IQC ranks, CPI, or GPA in the README. Do **not** restore the "quant experiments / laptop unionizing" museum bullet
- Skills badges must be technologies actually used in public repos, not aspirational
- Avoid corporate filler ("passionate about", "perfectly aligns")
- Do not change `CNAME` or Pages config

## Skills inventory (evidence, not a shopping list)

Languages: Python, TypeScript, JavaScript, HTML/CSS, Shell, Rust.

- Rust is from Unstable Kernel (`kernel`, `swarm`, `mycelium`, `sim`, `signal`), not a personal-account featured app
- Kotlin exists in TextLexiq but that build is demoted; do not add Kotlin unless it returns to the featured grid
- Dropped PostgreSQL-as-language; it was not a primary language badge

Web & backend: Next.js, React, Vite, FastAPI, Appwrite, WebRTC, Vercel.

- Vite: SynCine (`vite.config.ts`)
- FastAPI: SimWeaver, CodeShield, merge-ytm backend
- Docker lives under Robotics / systems (CodeShield, SimWeaver, LQR-MPC) to avoid a duplicate badge

AI / tooling: PyTorch (ML repos such as Humor-Identification, PathOptix), tree-sitter + MCP (CodeShield), LLM Agents (Pixasso skill, SimWeaver, CodeGrandmaster-style agent work)

Robotics / systems: ROS2, Docker, LQR-MPC

Quant (label badges only, no numbers): Alpha Generation, Signal Processing, Risk Modeling, Systematic Trading, WorldQuant Brain.

## Featured builds (priority)

1. **SynCine** (live): control plane vs media plane, WebRTC + Appwrite. https://syncine.confluxa.app · https://github.com/Erebuzzz/SynCine
2. **CodeShield** (live): CFG/DFG/taint for AI-generated code. Docs https://codeshield-five.vercel.app · npm `codeshield-mcp` · PyPI `codeshield-ai` · https://github.com/Erebuzzz/CodeShield
3. **Confluxa** (live only, repo private): Next.js + Appwrite Realtime/LiveToast, named realms, Bifrost. https://www.confluxa.app
4. **MIRAGE** (foundation, not a finished platform): https://github.com/Unstable-Kernel/MIRAGE · org https://github.com/Unstable-Kernel · docs https://unstable-kernel.github.io/docs
5. **Risk-Aware Hybrid LQR-MPC** (keep, current method is LQR + risk-triggered adaptive MPC safety filter; blended hybrid is historical baseline): https://github.com/Erebuzzz/Risk-Aware-Hybrid-LQR-MPC-Navigation-for-Autonomous-Systems
6. Secondary / idle backends: Merge (`Erebuzzz/merge-ytm`), SignalThief, AsciiRaw (`Erebuzzz/ascii-raw`). Cryptopad and ScribeAI are secondary. TextLexiq and Trajectory were demoted.
7. Keep Pixasso (`npx skills add Erebuzzz/pixasso`) and SimWeaver in the grid.

## Contacts

- LinkedIn: https://www.linkedin.com/in/kksinha23
- Email: kshitiz23kumar@gmail.com
- X: @erebuzzz
- Instagram: https://instagram.com/artem.enies

## whoami line

Final-year ECE at IISER Bhopal (April 2027); software + tools + robotics first; part-time WorldQuant (no stats); founder of Unstable Kernel.

## Sources used (do not treat as license to invent)

Project blurbs were checked against public READMEs for SynCine (`Readme.md`), CodeShield, MIRAGE, LQR-MPC, merge-ytm, SignalThief, Cryptopad, ScribeAI, and the Unstable Kernel org profile. Language badges were cross-checked against public GitHub languages and repo files (SimWeaver FastAPI, CodeShield tree-sitter/MCP/FastAPI/Docker, SynCine Vite/WebRTC/Appwrite, Unstable Kernel Rust crates). Confluxa details stayed limited to what earlier tasks stated because the repo is private.

## Suggested next steps

1. Merge the PR so https://github.com/Erebuzzz shows the new README (only if the owner asks)
2. If live URLs rot, update badges only after confirming the new URL
3. Do not promote TextLexiq/Trajectory back into the main grid unless they become core again
4. Do not reintroduce IQC/alpha stats, CPI, or the quant museum bullet. Quant skill badges and the WorldQuant seat are intentional.
