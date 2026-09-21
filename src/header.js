export const SCROLL_THRESHOLD = 8;

export function syncHeader(header, scrollY) {
  header.classList.toggle('is-scrolled', scrollY > SCROLL_THRESHOLD);
  return header.classList.contains('is-scrolled');
}

export function initHeader(doc = document) {
  const header = doc.getElementById('header');
  if (!header) return false;

  const onScroll = () => syncHeader(header, window.scrollY);

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  return true;
}
