import { describe, it, expect, vi } from 'vitest';
import { COUNT_DURATION_MS, animateCount, easeOutCubic, initCounters } from '../src/counters.js';
import {
  installIntersectionObserver,
  removeIntersectionObserver,
  setReducedMotion
} from './helpers.js';

function stubAnimationFrame(stepMs = 300) {
  let now = 0;

  vi.stubGlobal('performance', { now: () => now });
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    now += stepMs;
    cb(now);
    return 1;
  });

  return () => now;
}

function renderCounter(count, suffix) {
  const attrSuffix = suffix ? ` data-suffix="${suffix}"` : '';
  document.body.innerHTML = `<dd data-count="${count}"${attrSuffix}>0</dd>`;
  return document.querySelector('[data-count]');
}

describe('Suite 4 - Contadores animados', () => {
  it('easeOutCubic vai de 0 a 1 de forma desacelerada', () => {
    const inicio = 0;
    const meio = 0.5;
    const fim = 1;

    const resultados = [easeOutCubic(inicio), easeOutCubic(meio), easeOutCubic(fim)];

    expect(resultados[0]).toBe(0);
    expect(resultados[2]).toBe(1);
    expect(resultados[1]).toBeGreaterThan(meio);
  });

  it('anima ate o valor alvo definido em data-count', () => {
    stubAnimationFrame(COUNT_DURATION_MS / 4);
    const el = renderCounter(60);

    animateCount(el);

    expect(el.textContent).toBe('60');
  });

  it('preserva o sufixo declarado em data-suffix', () => {
    stubAnimationFrame(COUNT_DURATION_MS / 4);
    const el = renderCounter(1200, '+');

    animateCount(el);

    expect(el.textContent).toBe('1200+');
  });

  it('escreve valores intermediarios crescentes durante a animacao', () => {
    stubAnimationFrame(COUNT_DURATION_MS / 6);
    const el = renderCounter(1000);
    const valores = [];
    const observer = new MutationObserver(() => valores.push(Number(el.textContent)));
    observer.observe(el, { childList: true, characterData: true, subtree: true });

    animateCount(el);
    observer.disconnect();

    expect(Number(el.textContent)).toBe(1000);
    expect(el.textContent).not.toBe('0');
  });

  it('observa os contadores e dispara a animacao ao entrarem na tela', () => {
    const instances = installIntersectionObserver();
    stubAnimationFrame(COUNT_DURATION_MS);
    const el = renderCounter(24);
    const observer = initCounters(document);

    instances[0].trigger([el]);

    expect(observer).not.toBeNull();
    expect(instances[0].observed).toEqual([el]);
    expect(instances[0].unobserved).toEqual([el]);
    expect(el.textContent).toBe('24');
  });

  it('nao anima contadores que ainda nao intersectaram a viewport', () => {
    const instances = installIntersectionObserver();
    const el = renderCounter(24);
    initCounters(document);

    instances[0].trigger([el], false);

    expect(el.textContent).toBe('0');
    expect(instances[0].unobserved).toEqual([]);
  });

  it('nao cria observer quando ha preferencia por movimento reduzido', () => {
    installIntersectionObserver();
    setReducedMotion(true);
    renderCounter(60);

    const observer = initCounters(document);

    expect(observer).toBeNull();
  });

  it('nao cria observer quando o navegador nao suporta IntersectionObserver', () => {
    removeIntersectionObserver();
    renderCounter(60);

    const observer = initCounters(document);

    expect(observer).toBeNull();
  });
});
