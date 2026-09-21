export function prefersReducedMotion() {
  return Boolean(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function supportsIntersectionObserver() {
  return 'IntersectionObserver' in window;
}
