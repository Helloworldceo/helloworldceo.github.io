// Theme / style / language state
const styleNames = {
  atelier: { en: 'Style: Atelier', zh: '风格：Atelier' },
  editorial: { en: 'Style: Editorial', zh: '风格：Editorial' },
  lab: { en: 'Style: Lab', zh: '风格：Lab' },
};
const styleOrder = ['atelier', 'editorial', 'lab'];
const languageOrder = ['en', 'zh'];

const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
const savedStyle = localStorage.getItem('designStyle') || 'atelier';
document.documentElement.setAttribute('data-style', styleOrder.includes(savedStyle) ? savedStyle : 'atelier');
const savedLang = localStorage.getItem('language') || 'en';
const normalizedSavedLang = languageOrder.includes(savedLang) ? savedLang : 'en';
document.documentElement.setAttribute('data-language', normalizedSavedLang);
document.documentElement.setAttribute('lang', normalizedSavedLang === 'zh' ? 'zh-CN' : 'en');

function applyLanguageVisibility(language) {
  document.querySelectorAll('[data-lang]').forEach((node) => {
    const nodeLang = node.getAttribute('data-lang');
    const show = () => {
      node.style.display = 'inline';
    };
    const hide = () => {
      node.style.display = 'none';
    };

    nodeLang === language ? show() : hide();
  });
}

applyLanguageVisibility(normalizedSavedLang);

const heroLead = document.getElementById('hero-lead');
const heroLeadToggle = document.getElementById('hero-lead-toggle');

function updateHeroLeadToggleLabel() {
  if (!heroLead || !heroLeadToggle) return;
  const isCollapsed = heroLead.classList.contains('collapsed');
  const en = heroLeadToggle.querySelector('[data-lang="en"]');
  const zh = heroLeadToggle.querySelector('[data-lang="zh"]');
  if (en) en.textContent = isCollapsed ? 'Read more' : 'Show less';
  if (zh) zh.textContent = isCollapsed ? '展开' : '收起';
  heroLeadToggle.setAttribute('aria-expanded', String(!isCollapsed));
}

if (heroLead && heroLeadToggle) {
  heroLeadToggle.addEventListener('click', () => {
    heroLead.classList.toggle('collapsed');
    updateHeroLeadToggleLabel();
  });
  updateHeroLeadToggleLabel();
}

function updateDesignLabel(mode) {
  const btn = document.querySelector('.design-toggle');
  if (!btn) return;
  const currentLang = document.documentElement.getAttribute('data-language') || 'en';
  const labels = styleNames[mode] || styleNames.atelier;
  const label = labels[currentLang] || labels.en;
  btn.setAttribute('title', label);
  btn.setAttribute('aria-label', label);
}
updateDesignLabel(document.documentElement.getAttribute('data-style'));

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function toggleDesign() {
  const html = document.documentElement;
  const current = html.getAttribute('data-style') || 'atelier';
  const idx = styleOrder.indexOf(current);
  const next = styleOrder[(idx + 1) % styleOrder.length];
  html.setAttribute('data-style', next);
  localStorage.setItem('designStyle', next);
  updateDesignLabel(next);
}

function toggleLanguage() {
  const html = document.documentElement;
  const current = html.getAttribute('data-language') || 'en';
  const idx = languageOrder.indexOf(current);
  const next = languageOrder[(idx + 1) % languageOrder.length];
  html.setAttribute('data-language', next);
  html.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en');
  localStorage.setItem('language', next);
  applyLanguageVisibility(next);
  updateHeroLeadToggleLabel();
  updateDesignLabel(html.getAttribute('data-style') || 'atelier');
  renderSpotlight(activeSpotlight);
}

// Mobile nav with escape, outside-click, and focus return
const navMenu = document.getElementById('nav-menu');
const navButton = document.querySelector('.nav-toggle');

function closeNav() {
  if (!navMenu || !navButton) return;
  navMenu.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

function toggleNav() {
  if (!navMenu || !navButton) return;
  const isOpen = navMenu.classList.toggle('open');
  navButton.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
}

document.addEventListener('click', (event) => {
  if (!navMenu || !navButton || !navMenu.classList.contains('open')) return;
  const nav = document.querySelector('nav');
  if (nav && !nav.contains(event.target)) closeNav();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNav();
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', closeNav);
});

// Back to top
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  if (window.scrollY > 500) backToTop.classList.add('visible');
  else backToTop.classList.remove('visible');
});
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Project filters
function filterProjects(category, btn) {
  document.querySelectorAll('.filter-btn').forEach((b) => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  document.querySelectorAll('.project-card').forEach((card) => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// WeChat quick copy + accessible toast feedback
function showToast(message) {
  const toast = document.getElementById('status-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.setTimeout(() => toast.classList.remove('visible'), 1800);
}

const wechatCard = document.getElementById('wechat-card');
if (wechatCard) {
  wechatCard.addEventListener('click', async () => {
    const copyValue = wechatCard.getAttribute('data-copy') || 'Helloworld_Ceo';
    try {
      await navigator.clipboard.writeText(copyValue);
      const language = document.documentElement.getAttribute('data-language') || 'en';
      if (language === 'zh') {
        showToast('微信号已复制');
      } else {
        showToast('WeChat ID copied');
      }
    } catch {
      showToast('Copy failed');
    }
  });
}

// Interactive case-study spotlight
const spotlightCases = {
  rag: {
    title: { en: 'RAG Assistant', zh: 'RAG 助手' },
    summary: {
      en: 'Built a citation-grounded assistant for private docs with retrieval quality tracing and production-friendly observability.',
      zh: '构建了面向私有文档的可追溯引用式助手，具备检索质量评估与生产级可观测能力。',
    },
    metrics: [
      { en: 'Traceable response flow', zh: '可追溯响应流程', value: 'LangSmith + RAGAS' },
      { en: 'Source-grounded answers', zh: '基于来源的答案', value: 'Citations enabled' },
      { en: 'Stack', zh: '技术栈', value: 'LCEL · ChromaDB · Streamlit' },
    ],
    link: 'https://github.com/helloworldceo/rag-assistant',
  },
  pv: {
    title: { en: 'PV-BESS Decision AI', zh: '光储决策 AI' },
    summary: {
      en: 'Designed a multi-agent feasibility pipeline for solar + storage planning with scenario, sizing, and finance outputs.',
      zh: '设计了用于光储规划的多智能体可行性流程，覆盖情景分析、容量配置与财务输出。',
    },
    metrics: [
      { en: 'Site-to-report workflow', zh: '从场站到报告流程', value: 'Automated pipeline' },
      { en: 'Scenario modeling', zh: '情景建模', value: 'Sizing + finance' },
      { en: 'Focus', zh: '重点', value: 'Decision support' },
    ],
    link: '#projects',
  },
  security: {
    title: { en: 'Prompt Injection Security', zh: '提示词注入安全' },
    summary: {
      en: 'Built a scanner that stress-tests system prompts against categorized injection payloads and judge-based evaluations.',
      zh: '构建了提示词注入扫描器，可按攻击类别压测系统提示词并结合评审机制评估风险。',
    },
    metrics: [
      { en: 'Payload coverage', zh: '载荷覆盖', value: '22 attack categories' },
      { en: 'Dual evaluation', zh: '双重评估', value: 'Rules + LLM judge' },
      { en: 'Goal', zh: '目标', value: 'Safer LLM deployment' },
    ],
    link: 'https://github.com/helloworldceo/prompt-injection-scanner',
  },
};

let activeSpotlight = 'rag';

function renderSpotlight(caseId) {
  const spotlight = spotlightCases[caseId];
  if (!spotlight) return;

  const currentLang = document.documentElement.getAttribute('data-language') || 'en';
  const language = ['en', 'zh'].includes(currentLang) ? currentLang : 'en';
  const title = document.getElementById('spotlight-title');
  const summary = document.getElementById('spotlight-summary');
  const metrics = document.getElementById('spotlight-metrics');
  const link = document.getElementById('spotlight-link');

  if (!title || !summary || !metrics || !link) return;

  title.textContent = spotlight.title[language] || spotlight.title.en;
  summary.textContent = spotlight.summary[language] || spotlight.summary.en;
  metrics.innerHTML = '';
  spotlight.metrics.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item[language] || item.en}</span><strong>${item.value}</strong>`;
    metrics.appendChild(li);
  });
  link.setAttribute('href', spotlight.link);
}

document.querySelectorAll('.spotlight-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.spotlight-tab').forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeSpotlight = tab.getAttribute('data-case') || 'rag';
    renderSpotlight(activeSpotlight);
  });
});

renderSpotlight(activeSpotlight);

// Marquee population
const marqueeItems = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Docker', 'PostgreSQL', 'TensorFlow', 'PyTorch', 'Git', 'Linux',
  'Angular', 'REST APIs', 'EV Charging', 'ESS', 'Microgrids',
  'LangChain', 'LangGraph', 'RAG', 'ChromaDB', 'LangSmith',
  'Streamlit', 'Scapy', 'Prompt Injection',
];
const track = document.getElementById('marqueeTrack');
if (track) {
  const createSpan = (text) => {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  };
  const createSep = () => {
    const sep = document.createElement('span');
    sep.textContent = '·';
    return sep;
  };
  const build = () => {
    marqueeItems.forEach((item, i) => {
      track.appendChild(createSpan(item));
      if (i < marqueeItems.length - 1) track.appendChild(createSep());
    });
  };
  build();
  track.appendChild(createSep());
  build();
}

// Bilingual typing animation
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const rolesByLanguage = {
    en: ['Agentic AI Security', 'LLM / RAG Systems', 'AI Security Researcher', 'Cybersecurity Engineer', 'Software Engineer', 'Solution Engineer', 'Full-Stack Builder'],
    zh: ['智能体 AI 安全', '大模型 / RAG 系统', 'AI 安全研究者', '网络安全工程师', '软件工程师', '解决方案工程师', '全栈构建者'],
  };

  let lang = document.documentElement.getAttribute('data-language') || 'en';
  let roles = rolesByLanguage[lang] || rolesByLanguage.en;
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timerId = null;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx += 1;
      if (charIdx === current.length) {
        deleting = true;
        timerId = setTimeout(tick, 1700);
        return;
      }
      timerId = setTimeout(tick, 75);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx -= 1;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timerId = setTimeout(tick, 340);
        return;
      }
      timerId = setTimeout(tick, 40);
    }
  }

  new MutationObserver(() => {
    const newLang = document.documentElement.getAttribute('data-language') || 'en';
    if (newLang !== lang) {
      lang = newLang;
      roles = rolesByLanguage[lang] || rolesByLanguage.en;
      roleIdx = 0;
      charIdx = 0;
      deleting = false;
      el.textContent = '';
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(tick, 50);
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });

  tick();
})();

// Adaptive particles tuned for performance
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (prefersReducedMotion || saveData) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cpuCores = Math.max(2, navigator.hardwareConcurrency || 4);
  let width = 0;
  let height = 0;
  let rafId = null;
  let active = true;
  const particles = [];

  function particleCount() {
    const mobileBase = window.innerWidth < 768 ? 16 : 34;
    const budget = Math.min(14, cpuCores * 2);
    return mobileBase + budget;
  }

  function connectDistance() {
    return window.innerWidth < 768 ? 68 : 110;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function seedParticles() {
    particles.length = 0;
    const count = particleCount();
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.6 + 0.8,
      });
    }
  }

  function draw() {
    if (!active) return;
    ctx.clearRect(0, 0, width, height);
    const distMax = connectDistance();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const base = isDark ? '242,159,103' : '41,95,109';

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${base}, 0.22)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < distMax) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${base}, ${0.12 * (1 - dist / distMax)})`;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  resize();
  seedParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    seedParticles();
  });

  document.addEventListener('visibilitychange', () => {
    active = !document.hidden;
    if (active && !rafId) draw();
    if (!active && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
})();

// Make future non-critical images lazy by default
document.querySelectorAll('img').forEach((img) => {
  if (!img.closest('.hero-photo') && !img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }
  img.setAttribute('decoding', 'async');
});

