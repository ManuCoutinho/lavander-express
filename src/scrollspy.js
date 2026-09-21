import { supportsIntersectionObserver } from './motion.js';

export function highlightLink(navLinks, sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === '#' + sectionId);
  });
}

export function resolveSections(navLinks, doc = document) {
  return navLinks
    .map((link) => doc.querySelector(link.getAttribute('href')))
    .filter(Boolean);
}

export function initScrollSpy(doc = document) {
  const navLinks = Array.from(doc.querySelectorAll('.nav__link'));
  const sections = resolveSections(navLinks, doc);

  if (!sections.length || !supportsIntersectionObserver()) return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        highlightLink(navLinks, entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50%' }
  );

  sections.forEach((section) => observer.observe(section));

  return observer;
}
