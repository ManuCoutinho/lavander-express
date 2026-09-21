import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { installIntersectionObserver } from './helpers.js';

const INDEX_HTML = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

const PAGE = `
  <header id="header"></header>
  <button id="burger" aria-expanded="false" aria-label="Abrir menu"></button>
  <nav id="nav">
    <a class="nav__link" href="#servicos">Servicos</a>
  </nav>
  <section id="servicos" class="reveal">
    <dd data-count="60">0</dd>
  </section>
  <form id="form" novalidate>
    <input id="nome" name="nome" type="text" />
    <input id="email" name="email" type="email" />
    <p id="formMsg"></p>
  </form>
  <span id="year"></span>
`;

async function loadBootstrap() {
  const module = await import('../main.js');
  return module.bootstrap;
}

describe('Suite 6 - Bootstrap da land page', () => {
  it('liga todos os modulos sem lancar erro em uma pagina completa', async () => {
    installIntersectionObserver();
    document.body.innerHTML = PAGE;
    const bootstrap = await loadBootstrap();

    const executar = () => bootstrap(document);

    expect(executar).not.toThrow();
  });

  it('deixa o menu, o formulario e o rodape funcionais apos o bootstrap', async () => {
    installIntersectionObserver();
    document.body.innerHTML = PAGE;
    const bootstrap = await loadBootstrap();
    bootstrap(document);

    document.getElementById('burger').click();
    document.getElementById('nome').value = 'Ana';
    document.getElementById('email').value = 'ana@lavander.com.br';
    document.getElementById('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );

    expect(document.getElementById('nav').classList.contains('is-open')).toBe(true);
    expect(document.getElementById('formMsg').textContent).toContain('Pronto, Ana!');
    expect(document.getElementById('year').textContent).toBe(String(new Date().getFullYear()));
  });

  it('nao quebra quando a pagina nao tem nenhum dos elementos esperados', async () => {
    document.body.innerHTML = '<div id="vazio"></div>';
    const bootstrap = await loadBootstrap();

    const executar = () => bootstrap(document);

    expect(executar).not.toThrow();
  });

  it('encontra todos os elementos esperados no index.html real', async () => {
    installIntersectionObserver();
    document.documentElement.innerHTML = INDEX_HTML;
    const bootstrap = await loadBootstrap();

    bootstrap(document);
    document.getElementById('burger').click();

    expect(document.getElementById('nav').classList.contains('is-open')).toBe(true);
    expect(document.getElementById('year').textContent).toBe(String(new Date().getFullYear()));
    expect(document.querySelectorAll('.reveal').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('[data-count]').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.nav__link').length).toBeGreaterThan(0);
  });
});