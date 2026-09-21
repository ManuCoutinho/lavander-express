import { describe, it, expect, vi } from 'vitest';
import { SCROLL_THRESHOLD, initHeader, syncHeader } from '../src/header.js';
import { highlightLink, initScrollSpy, resolveSections } from '../src/scrollspy.js';
import { initYear } from '../src/year.js';
import { installIntersectionObserver, removeIntersectionObserver } from './helpers.js';

function renderPage() {
  document.body.innerHTML = `
    <header id="header"></header>
    <nav>
      <a class="nav__link" href="#como-funciona">Como funciona</a>
      <a class="nav__link" href="#servicos">Servicos</a>
      <a class="nav__link" href="#inexistente">Fantasma</a>
    </nav>
    <section id="como-funciona"></section>
    <section id="servicos"></section>
    <span id="year"></span>
  `;

  return {
    header: document.getElementById('header'),
    links: Array.from(document.querySelectorAll('.nav__link')),
    comoFunciona: document.getElementById('como-funciona'),
    servicos: document.getElementById('servicos')
  };
}

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true });
}

describe('Suite 5 - Header, scroll spy e rodape', () => {
  it('nao marca o header como rolado enquanto o scroll esta no limite', () => {
    const { header } = renderPage();

    const rolado = syncHeader(header, SCROLL_THRESHOLD);

    expect(rolado).toBe(false);
    expect(header.classList.contains('is-scrolled')).toBe(false);
  });

  it('marca o header como rolado ao ultrapassar o limite', () => {
    const { header } = renderPage();

    const rolado = syncHeader(header, SCROLL_THRESHOLD + 1);

    expect(rolado).toBe(true);
    expect(header.classList.contains('is-scrolled')).toBe(true);
  });

  it('reage ao evento de scroll da janela apos a inicializacao', () => {
    const { header } = renderPage();
    setScrollY(0);
    initHeader(document);

    setScrollY(120);
    window.dispatchEvent(new Event('scroll'));

    expect(header.classList.contains('is-scrolled')).toBe(true);
  });

  it('registra o listener de scroll como passivo', () => {
    renderPage();
    const addEventListener = vi.spyOn(window, 'addEventListener');

    initHeader(document);

    expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true
    });
  });

  it('nao inicializa o header quando o elemento nao existe', () => {
    document.body.innerHTML = '<div></div>';

    const inicializou = initHeader(document);

    expect(inicializou).toBe(false);
  });

  it('descarta links do menu que nao apontam para uma secao existente', () => {
    const { links, comoFunciona, servicos } = renderPage();

    const secoes = resolveSections(links, document);

    expect(secoes).toEqual([comoFunciona, servicos]);
  });

  it('ativa apenas o link da secao visivel', () => {
    const instances = installIntersectionObserver();
    const { links, servicos } = renderPage();
    initScrollSpy(document);

    instances[0].trigger([servicos]);

    expect(links[0].classList.contains('is-active')).toBe(false);
    expect(links[1].classList.contains('is-active')).toBe(true);
  });

  it('troca o link ativo quando outra secao entra na tela', () => {
    const instances = installIntersectionObserver();
    const { links, comoFunciona, servicos } = renderPage();
    initScrollSpy(document);
    instances[0].trigger([servicos]);

    instances[0].trigger([comoFunciona]);

    expect(links[0].classList.contains('is-active')).toBe(true);
    expect(links[1].classList.contains('is-active')).toBe(false);
  });

  it('ignora secoes que sairam da tela', () => {
    const instances = installIntersectionObserver();
    const { links, servicos } = renderPage();
    initScrollSpy(document);

    instances[0].trigger([servicos], false);

    expect(links.some((link) => link.classList.contains('is-active'))).toBe(false);
  });

  it('highlightLink aceita uma lista vazia de links', () => {
    const links = [];

    highlightLink(links, 'servicos');

    expect(links).toHaveLength(0);
  });

  it('nao cria scroll spy sem secoes correspondentes', () => {
    installIntersectionObserver();
    document.body.innerHTML = '<a class="nav__link" href="#nada"></a>';

    const observer = initScrollSpy(document);

    expect(observer).toBeNull();
  });

  it('nao cria scroll spy quando o navegador nao suporta IntersectionObserver', () => {
    removeIntersectionObserver();
    renderPage();

    const observer = initScrollSpy(document);

    expect(observer).toBeNull();
  });

  it('escreve o ano corrente no rodape', () => {
    renderPage();
    const dataFixa = new Date('2026-09-21T12:00:00Z');

    const ano = initYear(document, dataFixa);

    expect(ano).toBe('2026');
    expect(document.getElementById('year').textContent).toBe('2026');
  });

  it('ignora o rodape quando o elemento de ano nao existe', () => {
    document.body.innerHTML = '<footer></footer>';

    const ano = initYear(document);

    expect(ano).toBeNull();
  });
});
