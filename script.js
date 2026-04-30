/* ═══════════════════════════════════════════════════════════════════════════
   David 大卫 — Portfolio Scripts v2
   Particles · Typing · Dark Mode · Reveal Animations
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Dark Mode Toggle ──────────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.querySelector('.theme-toggle').addEventListener('click', () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ─── Particle System ───────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function getParticleCount() {
    return window.innerWidth <= 768 ? 24 : 60;
  }

  function getConnectDistance() {
    return window.innerWidth <= 768 ? 80 : 120;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const particleCount = getParticleCount();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const color = isDark ? '255,255,255' : '26,60,110';
    const connectDist = getConnectDistance();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, 0.25)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - dist / connectDist)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ─── Typing Animation ─────────────────────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const roles = [
    'Software Engineer',
    'AI & Machine Learning',
    'Cybersecurity Expert',
    'Solution Engineer',
    'Full-Stack Developer',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  tick();
})();

// ─── Mobile Nav Toggle ─────────────────────────────────────────────────────
document.querySelector('.nav-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// ─── Active Nav Highlight ──────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ─── Reveal on Scroll ──────────────────────────────────────────────────────
(function initReveal() {
  const containers = [
    '.skills-grid',
    '.projects-grid',
    '.cv-grid',
    '.edu-grid',
    '.cert-grid',
    '.cert-badges',
    '.awards-list',
    '.contact-grid',
    '.about-facts',
    '.timeline',
  ];

  // add reveal + stagger classes to children of grid containers
  containers.forEach(sel => {
    const parent = document.querySelector(sel);
    if (!parent) return;
    Array.from(parent.children).forEach((child, i) => {
      child.classList.add('reveal', `stagger-${Math.min(i + 1, 11)}`);
    });
  });

  // fallback: any remaining items without reveal
  document.querySelectorAll(
    '.skill-card, .timeline-item, .project-card, .edu-card, .cert-item, .cert-badge, .award-item, .contact-card, .fact-card'
  ).forEach(el => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─── Counter Animation for Fact Numbers ────────────────────────────────────
(function initCounters() {
  const factNumbers = document.querySelectorAll('.fact-number');
  if (!factNumbers.length) return;

  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const initial = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(initial + (target - initial) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(\+?)$/);
        if (match) {
          animateCounter(el, parseInt(match[1], 10), match[2]);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  factNumbers.forEach(el => observer.observe(el));
})();

// ─── 3D Card Tilt Effect ───────────────────────────────────────────────────
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // radial glow follow for all glow cards
  document.querySelectorAll('.skill-card, .edu-card, .timeline-content').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  });
})();

// ─── Navbar Shadow on Scroll ───────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.style.boxShadow = window.scrollY > 50
    ? '0 2px 30px rgba(0, 0, 0, 0.12)'
    : '0 1px 20px rgba(0, 0, 0, 0.06)';
});

// ─── Back to Top Button ────────────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ─── Mobile Particle Optimization ──────────────────────────────────────────
(function optimizeParticles() {
  const originalResize = window.addEventListener;
  void originalResize;
})();
