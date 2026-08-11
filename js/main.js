/* ================================================================
   VSC Website — Main JS
   ================================================================ */

/* ---- Nav scroll state ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- Scroll reveal (CSS class-based, not inline opacity) ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Number counter animation ---- */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const isNum = !isNaN(target);
  if (!isNum) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = target + '+';
    return;
  }

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---- Contact form ---- */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));
    data.page = document.documentElement.dataset.page || 'unknown';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        btn.textContent = 'Message sent! We\'ll be in touch.';
        btn.style.background = 'var(--color-ok)';
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Send failed — email us directly.';
      btn.disabled = false;
    }
  });
}

/* ---- Hero wave overlay (static — drawn once, redrawn on resize only) ---- */
const heroWaves = document.getElementById('hero-waves');
if (heroWaves) {
  const styles = getComputedStyle(document.documentElement);
  const layerColors = [
    styles.getPropertyValue('--color-wave-shadow').trim() || '#223249',
    styles.getPropertyValue('--color-forest-deep').trim() || '#2B3328',
    styles.getPropertyValue('--color-forest').trim() || '#425047',
  ];

  const drawWaves = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = heroWaves.clientWidth;
    const h = heroWaves.clientHeight;
    heroWaves.width = Math.round(w * dpr);
    heroWaves.height = Math.round(h * dpr);
    const ctx = heroWaves.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < 3; i++) {
      const baseline = h * (0.66 + i * 0.12);
      const phase = i * 2.1 + 1.4;
      const amp = h * 0.045 * (1 - i * 0.2);
      const freq = (Math.PI * 2 * (1.5 + i * 0.5)) / w;

      ctx.globalAlpha = 0.45 - i * 0.08;
      ctx.fillStyle = layerColors[i];
      ctx.beginPath();
      ctx.moveTo(0, baseline + amp * Math.sin(phase));
      for (let x = 1; x <= w; x++) {
        ctx.lineTo(x, baseline + amp * Math.sin(x * freq + phase));
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  drawWaves();
  window.addEventListener('resize', drawWaves, { passive: true });
}

/* ---- Smooth active nav on scroll (homepage) ---- */
if (document.documentElement.dataset.page === 'home') {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
}
