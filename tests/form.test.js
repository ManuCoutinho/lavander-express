import { describe, it, expect, vi } from 'vitest';
import {
  ERROR_MESSAGE,
  firstName,
  handleSubmit,
  initForm,
  isValidEmail,
  isValidName,
  successMessage
} from '../src/form.js';

function renderForm() {
  document.body.innerHTML = `
    <form id="form" novalidate>
      <input id="nome" name="nome" type="text" />
      <input id="email" name="email" type="email" />
      <button type="submit">Quero meu cupom</button>
      <p id="formMsg"></p>
    </form>
  `;

  return {
    form: document.getElementById('form'),
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    formMsg: document.getElementById('formMsg')
  };
}

function submit(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('Suite 2 - Formulario do cupom', () => {
  it.each([
    ['ana@lavander.com.br', true],
    ['ana.silva+cupom@dominio.co', true],
    ['sem-arroba.com', false],
    ['duplo@@dominio.com', false],
    ['ana@dominio', false],
    ['ana@dominio.c', false],
    ['ana com espaco@dominio.com', false]
  ])('valida o e-mail "%s" como %s', (entrada, esperado) => {
    const valor = entrada;

    const resultado = isValidEmail(valor);

    expect(resultado).toBe(esperado);
  });

  it.each([
    ['Ana', true],
    ['Al', true],
    ['A', false],
    ['  ', false],
    ['', false]
  ])('valida o nome "%s" como %s', (entrada, esperado) => {
    const valor = entrada;

    const resultado = isValidName(valor);

    expect(resultado).toBe(esperado);
  });

  it('monta a mensagem de sucesso usando apenas o primeiro nome', () => {
    const nomeCompleto = '  Ana Beatriz Souza  ';

    const mensagem = successMessage(nomeCompleto);

    expect(firstName(nomeCompleto)).toBe('Ana');
    expect(mensagem).toBe('Pronto, Ana! Seu cupom vai chegar por e-mail.');
  });

  it('exibe erro e marca os campos quando os dados sao invalidos', () => {
    const { form, nome, email, formMsg } = renderForm();
    initForm(document);
    nome.value = 'A';
    email.value = 'invalido';

    submit(form);

    expect(formMsg.textContent).toBe(ERROR_MESSAGE);
    expect(formMsg.classList.contains('is-error')).toBe(true);
    expect(nome.classList.contains('is-invalid')).toBe(true);
    expect(email.classList.contains('is-invalid')).toBe(true);
  });

  it('aceita o envio valido, limpa o formulario e remove o estado de erro', () => {
    const { form, nome, email, formMsg } = renderForm();
    initForm(document);
    formMsg.classList.add('is-error');
    nome.value = 'Ana Beatriz';
    email.value = 'ana@lavander.com.br';

    submit(form);

    expect(formMsg.textContent).toBe('Pronto, Ana! Seu cupom vai chegar por e-mail.');
    expect(formMsg.classList.contains('is-error')).toBe(false);
    expect(nome.classList.contains('is-invalid')).toBe(false);
    expect(nome.value).toBe('');
    expect(email.value).toBe('');
  });

  it('impede o recarregamento da pagina ao submeter', () => {
    const { form, nome, email } = renderForm();
    initForm(document);
    nome.value = 'Ana';
    email.value = 'ana@lavander.com.br';
    const evento = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefault = vi.spyOn(evento, 'preventDefault');

    form.dispatchEvent(evento);

    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('handleSubmit devolve false para dados invalidos e true para validos', () => {
    const { form, nome, email, formMsg } = renderForm();
    nome.value = 'A';
    email.value = 'x';

    const invalido = handleSubmit(form, formMsg, new Event('submit', { cancelable: true }));
    nome.value = 'Ana';
    email.value = 'ana@lavander.com.br';
    const valido = handleSubmit(form, formMsg, new Event('submit', { cancelable: true }));

    expect(invalido).toBe(false);
    expect(valido).toBe(true);
  });

  it('nao inicializa quando o formulario nao esta na pagina', () => {
    document.body.innerHTML = '<div id="outro"></div>';

    const inicializou = initForm(document);

    expect(inicializou).toBe(false);
  });
});
