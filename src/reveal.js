import { prefersReducedMotion, supportsIntersectionObserver } from './motion.js';

export const REVEAL_STEP_MS = 90;

export function revealAll(elements) {
  elements.forEach((el) => el.classList.add('is-visible'));
}

export function revealEntries(entries, observer) {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.transitionDelay = i * REVEAL_STEP_MS + 'ms';
    el.classList.add('is-visible');
    observer.unobserve(el);
  });
}

export function initReveal(doc = document) {
  const revealables = Array.from(doc.querySelectorAll('.reveal'));

  if (prefersReducedMotion() || !supportsIntersectionObserver()) {
    revealAll(revealables);
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => revealEntries(entries, observer),
    { threshold: 0.15, rootMargin: '0px 0px -60px' }
  );

  revealables.forEach((el) => observer.observe(el));

  return observer;
}
