# Lavander Express

Land page para o projeto de CI/CD do Lavander Express criado para a disciplina de DevOps do curso de ADS PUC/PR.

## Estrutura

```
index.html          markup da land page
styles.css          estilos
main.js             entrada ES module, liga os modulos ao DOM
src/                comportamentos isolados e testaveis
tests/              suites de teste (Vitest + jsdom)
```

| Modulo | Responsabilidade |
| --- | --- |
| `src/menu.js` | menu mobile e atributos ARIA |
| `src/header.js` | estado `is-scrolled` do header |
| `src/reveal.js` | animacao de entrada dos blocos |
| `src/counters.js` | contadores animados das metricas |
| `src/scrollspy.js` | link ativo conforme a secao visivel |
| `src/form.js` | validacao do formulario de cupom |
| `src/year.js` | ano corrente no rodape |
| `src/motion.js` | deteccao de `prefers-reduced-motion` e `IntersectionObserver` |

## Testes

Stack: [Vitest](https://vitest.dev) com ambiente [jsdom](https://github.com/jsdom/jsdom) e cobertura via V8.
Todas as suites seguem o padrao AAA (Arrange, Act, Assert).

```bash
npm install
npm test              # roda as suites uma vez
npm run test:watch    # modo interativo
npm run test:coverage # roda com relatorio de cobertura
```

As suites:

1. `tests/menu.test.js` - abertura, fechamento e acessibilidade do menu
2. `tests/form.test.js` - validacao de nome/e-mail e mensagens de retorno
3. `tests/reveal.test.js` - revelacao progressiva e fallback de movimento reduzido
4. `tests/counters.test.js` - easing, sufixos e disparo dos contadores
5. `tests/navigation.test.js` - header no scroll, scroll spy e ano do rodape
6. `tests/bootstrap.test.js` - integracao dos modulos contra o `index.html` real

A cobertura minima exigida e de **80%** em linhas, statements, funcoes e branches
(configurada em `vitest.config.js`); abaixo disso o comando falha.

## CI/CD

| Workflow | Gatilho | O que faz |
| --- | --- | --- |
| `.github/workflows/tests.yml` | todo push e pull request | roda as suites com cobertura no Node 20 e 22 e publica o relatorio como artefato |
| `.github/workflows/static.yml` | push em `main` | publica a land page no GitHub Pages |
| `.github/workflows/discord-webhook.yml` | eventos do repositorio | notifica o canal do Discord |
