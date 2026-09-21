import { describe, it, expect } from 'vitest';
import { closeMenu, toggleMenu, initMenu } from '../src/menu.js';

function renderMenu() {
  document.body.innerHTML = `
    <button id="burger" aria-expanded="false" aria-label="Abrir menu"></button>
    <nav id="nav">
      <a class="nav__link" href="#servicos">Servicos</a>
      <span id="naoLink">texto</span>
    </nav>
  `;

  return {
    burger: document.getElementById('burger'),
    nav: document.getElementById('nav'),
    link: document.querySelector('.nav__link'),
    naoLink: document.getElementById('naoLink')
  };
}

describe('Suite 1 - Menu mobile', () => {
  it('abre o menu e atualiza os atributos ARIA no primeiro clique', () => {
    const { burger, nav } = renderMenu();
    initMenu(document);

    burger.click();

    expect(nav.classList.contains('is-open')).toBe(true);
    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(burger.getAttribute('aria-label')).toBe('Fechar menu');
  });

  it('fecha o menu no segundo clique', () => {
    const { burger, nav } = renderMenu();
    initMenu(document);
    burger.click();

    burger.click();

    expect(nav.classList.contains('is-open')).toBe(false);
    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(burger.getAttribute('aria-label')).toBe('Abrir menu');
  });

  it('fecha o menu ao clicar em um link da navegacao', () => {
    const { burger, nav, link } = renderMenu();
    initMenu(document);
    burger.click();

    link.click();

    expect(nav.classList.contains('is-open')).toBe(false);
    expect(burger.getAttribute('aria-expanded')).toBe('false');
  });

  it('mantem o menu aberto ao clicar em um elemento que nao e link', () => {
    const { burger, nav, naoLink } = renderMenu();
    initMenu(document);
    burger.click();

    naoLink.click();

    expect(nav.classList.contains('is-open')).toBe(true);
  });

  it('fecha o menu ao pressionar Escape', () => {
    const { burger, nav } = renderMenu();
    initMenu(document);
    burger.click();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(nav.classList.contains('is-open')).toBe(false);
    expect(burger.getAttribute('aria-label')).toBe('Abrir menu');
  });

  it('ignora teclas diferentes de Escape', () => {
    const { burger, nav } = renderMenu();
    initMenu(document);
    burger.click();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(nav.classList.contains('is-open')).toBe(true);
  });

  it('nao inicializa quando o burger ou o nav nao existem', () => {
    document.body.innerHTML = '<nav id="nav"></nav>';

    const inicializou = initMenu(document);

    expect(inicializou).toBe(false);
  });

  it('toggleMenu devolve o estado aberto e closeMenu normaliza o ARIA', () => {
    const { burger, nav } = renderMenu();

    const aberto = toggleMenu(burger, nav);
    closeMenu(burger, nav);

    expect(aberto).toBe(true);
    expect(nav.classList.contains('is-open')).toBe(false);
    expect(burger.getAttribute('aria-expanded')).toBe('false');
  });
});
