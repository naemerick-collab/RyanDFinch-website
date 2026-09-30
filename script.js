// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navEl = document.querySelector('.nav');
const navToggleBtn = document.querySelector('.nav__toggle');
if (navEl && navToggleBtn) {
  const setOpen = (open) => {
    navEl.classList.toggle('is-open', open);
    navToggleBtn.setAttribute('aria-expanded', String(open));
    navToggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  navToggleBtn.addEventListener('click', () => {
    setOpen(!navEl.classList.contains('is-open'));
  });
  navEl.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navEl.classList.contains('is-open')) {
      setOpen(false);
    }
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = window.innerWidth > 768;

// =========================
// Reveal-on-scroll
// =========================
const revealTargets = document.querySelectorAll(
  '.welcome, .about__content, .values__grid, .interest, .education__content, .philosophy__columns > div, .connect__lede, .connect__actions, .chapter, .next-up a, .gallery, .feature-photo'
);
revealTargets.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

// =========================
// Hero: combined scroll + mouse parallax (eased)
// =========================
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero__media img');
if (hero && heroImg && !prefersReducedMotion && isDesktop) {
  let scrollY = 0;
  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;
  let rafActive = false;

  const onScroll = () => {
    scrollY = Math.min(window.scrollY, window.innerHeight);
    ensureRaf();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    ensureRaf();
  });
  hero.addEventListener('mouseleave', () => {
    targetX = 0; targetY = 0;
    ensureRaf();
  });

  function ensureRaf() {
    if (!rafActive) {
      rafActive = true;
      requestAnimationFrame(tick);
    }
  }

  function tick() {
    const dx = targetX - curX;
    const dy = targetY - curY;
    curX += dx * 0.06;
    curY += dy * 0.06;

    const tx = curX * -10;
    const ty = curY * -6;
    heroImg.style.transform =
      `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(1.02)`;

    // Keep animating if still easing toward target; otherwise stop until next input.
    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      requestAnimationFrame(tick);
    } else {
      rafActive = false;
    }
  }
  // Set initial transform once.
  ensureRaf();
}

// =========================
// Magnetic hero CTA
// =========================
const heroCta = document.querySelector('.hero__cta');
if (heroCta && !prefersReducedMotion && isDesktop) {
  const strength = 0.22;
  heroCta.addEventListener('mousemove', (e) => {
    const r = heroCta.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    heroCta.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  });
  heroCta.addEventListener('mouseleave', () => {
    heroCta.style.transform = '';
  });
}

// =========================
// Click flash on cards, image links, CTAs
// =========================
const clickTargets = document.querySelectorAll(
  '.chapter, .next-up a, .gallery__item, .feature-photo a, .booklist a, .btn'
);
clickTargets.forEach(el => {
  el.addEventListener('click', () => {
    el.classList.remove('is-clicked');
    void el.offsetWidth; // restart animation
    el.classList.add('is-clicked');
    setTimeout(() => el.classList.remove('is-clicked'), 600);
  });
});

// =========================
// Hero headline word cascade (run once on load)
// =========================
const heroHeadline = document.querySelector('.hero__headline');
if (heroHeadline && !prefersReducedMotion) {
  const text = heroHeadline.textContent.trim();
  const words = text.split(/\s+/);
  heroHeadline.innerHTML = words
    .map((w, i) => `<span class="hero__word" style="animation-delay:${(i * 0.055).toFixed(3)}s">${w}</span>`)
    .join(' ');
}
