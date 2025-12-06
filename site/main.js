const projects = [
  {
    name: 'ScribeAI',
    status: 'Live',
    live: 'https://scribe-ai-zeta.vercel.app',
    repo: 'https://github.com/Erebuzzz/ScribeAI',
    blurb: 'Real-time meeting assistant with dual-channel WebRTC audio and Gemini transcription/summarization.',
    stack: ['Next.js', 'TypeScript', 'Socket.io', 'Node.js', 'Google Gemini', 'PostgreSQL', 'Prisma', 'Better Auth', 'TailwindCSS'],
  },
  {
    name: 'PathOptix',
    status: 'Paused',
    live: 'https://pathoptix-intelligent-real-time-nav.netlify.app',
    repo: 'https://github.com/Erebuzzz/PathOptix-Intelligent-Real-Time-Navigation-Engine',
    blurb: 'PyTorch congestion predictor (92% confidence) + fuel/cost/eco optimal routing via FastAPI backend.',
    stack: ['Python', 'PyTorch', 'FastAPI', 'React (Vite)', 'Google Maps API', 'TailwindCSS'],
  },
  {
    name: 'Cryptopad',
    status: 'Ongoing',
    live: 'https://cryptopad-beta.vercel.app',
    repo: 'https://github.com/Erebuzzz/Cryptopad',
    blurb: 'Zero-knowledge text sharing. Client-side AES-256 + HMAC, burn-after-read, timed expiry on edge storage.',
    stack: ['Next.js', 'TypeScript', 'AES-256', 'HMAC', 'Zeabur Edge Functions'],
  },
  {
    name: 'AI Code Plagiarism Detector',
    status: 'Live',
    live: 'https://code-plagiarism-detector.vercel.app',
    repo: 'https://github.com/Erebuzzz/Code-Plagiarism-Detector',
    blurb: 'Multi-agent LLMs (Cohere, Together, Replicate) + Python AST ensemble scoring + Monaco editor UI.',
    stack: ['React', 'Flask', 'Python AST', 'Cohere', 'Together', 'TailwindCSS'],
  },
  {
    name: 'Humor Identification Model',
    status: 'Archived',
    live: '',
    repo: 'https://github.com/Erebuzzz/Humor-Identification-Model',
    blurb: 'Hybrid NLP research on Yelp reviews (87% accuracy) using Zagreb indices + lexical ambiguity stacking ensemble.',
    stack: ['Python', 'PyTorch', 'BERT', 'Word2Vec', 'NetworkX', 'Scikit-learn'],
  },
  {
    name: 'Hybrid Movie Recommendation System',
    status: 'Paused',
    live: 'https://movie-recommendation-system-tmdb-hybrid.streamlit.app',
    repo: 'https://github.com/Erebuzzz/Movie-Recommendation-System',
    blurb: 'Hybrid CF (SVD) + content-based on MovieLens 100k with OMDb/TMDb enrichment to solve cold-start.',
    stack: ['Python', 'Scikit-learn', 'SVD', 'Streamlit', 'OMDb API', 'TMDb API'],
  },
  {
    name: 'TextLexiq',
    status: 'Ongoing',
    live: '',
    repo: 'https://github.com/Erebuzzz/TextLexiq',
    blurb: 'On-device document intelligence: OCR, PDF/Word/LaTeX export, summarize, QA, privacy-first.',
    stack: ['OCR', 'NLP', 'On-device AI'],
  },
];

const statusBadgeClass = {
  Live: 'badge badge-live',
  Ongoing: 'badge badge-ongoing',
  Paused: 'badge badge-paused',
  Archived: 'badge badge-archived',
};

const statusChipColor = {
  Live: 'dot-live',
  Ongoing: 'dot-ongoing',
  Paused: 'dot-paused',
  Archived: 'dot-archived',
};

function renderStatus() {
  const list = document.getElementById('status-list');
  list.innerHTML = '';
  projects.forEach((p) => {
    const chip = document.createElement('div');
    chip.className = 'status-chip';
    chip.innerHTML = `
      <div class="top">
        <span>${p.name}</span>
        <span class="badge ${statusBadgeClass[p.status] || ''}">${p.status}</span>
      </div>
      <div class="links">
        ${p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer">Demo</a>` : '<span class="muted">No demo</span>'}
        <a href="${p.repo}" target="_blank" rel="noreferrer">Repo</a>
      </div>
    `;
    list.appendChild(chip);
  });
  const liveCount = projects.filter((p) => p.status === 'Live').length;
  document.getElementById('live-count').textContent = `${liveCount} live`;
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';
  projects.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-head">
        <h3 class="project-title">${p.name}</h3>
        <span class="${statusBadgeClass[p.status] || 'badge'}">${p.status}</span>
      </div>
      <p class="project-meta">${p.blurb}</p>
      <div class="stack">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div>
      <div class="project-links">
        ${p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer">Live</a>` : ''}
        <a href="${p.repo}" target="_blank" rel="noreferrer">Repo</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

renderStatus();
renderProjects();
