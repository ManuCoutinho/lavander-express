import { prefersReducedMotion, supportsIntersectionObserver } from './motion.js';

export const COUNT_DURATION_MS = 1200;

export function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

export function animateCount(el, duration = COUNT_DURATION_MS) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * easeOutCubic(progress)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

export function initCounters(doc = document) {
  const counters = Array.from(doc.querySelectorAll('[data-count]'));

  if (prefersReducedMotion() || !supportsIntersectionObserver()) return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));

  return observer;
}
