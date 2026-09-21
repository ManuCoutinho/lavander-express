export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ERROR_MESSAGE = 'Confira o nome e o e-mail para continuar.';

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value).trim());
}

export function isValidName(value) {
  return String(value).trim().length >= 2;
}

export function firstName(value) {
  return String(value).trim().split(' ')[0];
}

export function successMessage(name) {
  return 'Pronto, ' + firstName(name) + '! Seu cupom vai chegar por e-mail.';
}

export function handleSubmit(form, formMsg, event) {
  event.preventDefault();

  const nome = form.elements.nome;
  const email = form.elements.email;
  const nomeOk = isValidName(nome.value);
  const emailOk = isValidEmail(email.value);

  nome.classList.toggle('is-invalid', !nomeOk);
  email.classList.toggle('is-invalid', !emailOk);

  if (!nomeOk || !emailOk) {
    formMsg.textContent = ERROR_MESSAGE;
    formMsg.classList.add('is-error');
    return false;
  }

  formMsg.classList.remove('is-error');
  formMsg.textContent = successMessage(nome.value);
  form.reset();

  return true;
}

export function initForm(doc = document) {
  const form = doc.getElementById('form');
  const formMsg = doc.getElementById('formMsg');

  if (!form || !formMsg) return false;

  form.addEventListener('submit', (e) => handleSubmit(form, formMsg, e));

  return true;
}
