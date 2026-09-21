import { describe, it, expect } from 'vitest';
import { REVEAL_STEP_MS, initReveal, revealAll, revealEntries } from '../src/reveal.js';
import {
  installIntersectionObserver,
  removeIntersectionObserver,
  setReducedMotion
} from './helpers.js';

function renderRevealables(total = 3) {
  document.body.innerHTML = Array.from(
    { length: total },
    (_, i) => `<section class="reveal" id="bloco-${i}"></section>`
  ).join('');

  return Array.from(document.querySelectorAll('.reveal'));
}

describe('Suite 3 - Animacao de revelacao', () => {
  it('observa todos os blocos .reveal quando o IntersectionObserver existe', () => {
    const instances = installIntersectionObserver();
    const blocos = renderRevealables(3);

    const observer = initReveal(document);

    expect(observer).not.toBeNull();
    expect(instances[0].observed).toEqual(blocos);
    expect(instances[0].options).toEqual({ threshold: 0.15, rootMargin: '0px 0px -60px' });
  });

  it('revela os blocos em cascata e para de observa-los ao entrarem na tela', () => {
    const instances = installIntersectionObserver();
    const blocos = renderRevealables(3);
    initReveal(document);

    instances[0].trigger(blocos);

    blocos.forEach((bloco, i) => {
      expect(bloco.classList.contains('is-visible')).toBe(true);
      expect(bloco.style.transitionDelay).toBe(i * REVEAL_STEP_MS + 'ms');
    });
    expect(instances[0].unobserved).toEqual(blocos);
  });

  it('nao revela blocos que ainda nao intersectaram a viewport', () => {
    const instances = installIntersectionObserver();
    const blocos = renderRevealables(2);
    initReveal(document);

    instances[0].trigger(blocos, false);

    blocos.forEach((bloco) => expect(bloco.classList.contains('is-visible')).toBe(false));
    expect(instances[0].unobserved).toEqual([]);
  });

  it('revela tudo imediatamente quando o usuario pede movimento reduzido', () => {
    installIntersectionObserver();
    setReducedMotion(true);
    const blocos = renderRevealables(3);

    const observer = initReveal(document);

    expect(observer).toBeNull();
    blocos.forEach((bloco) => expect(bloco.classList.contains('is-visible')).toBe(true));
  });

  it('revela tudo imediatamente quando o navegador nao suporta IntersectionObserver', () => {
    removeIntersectionObserver();
    const blocos = renderRevealables(2);

    const observer = initReveal(document);

    expect(observer).toBeNull();
    blocos.forEach((bloco) => expect(bloco.classList.contains('is-visible')).toBe(true));
  });

  it('revealAll e revealEntries operam sobre listas vazias sem quebrar', () => {
    const observer = { unobserve: () => {} };

    revealAll([]);
    revealEntries([], observer);

    expect(document.querySelectorAll('.is-visible')).toHaveLength(0);
  });
});
