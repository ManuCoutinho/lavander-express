export function closeMenu(burger, nav) {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Abrir menu');
}

export function toggleMenu(burger, nav) {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  return open;
}

export function initMenu(doc = document) {
  const burger = doc.getElementById('burger');
  const nav = doc.getElementById('nav');

  if (!burger || !nav) return false;

  burger.addEventListener('click', () => toggleMenu(burger, nav));

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu(burger, nav);
  });

  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu(burger, nav);
  });

  return true;
}
