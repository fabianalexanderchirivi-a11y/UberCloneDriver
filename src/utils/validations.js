import { t } from '../i18n';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Pure functions: they receive the text and return an error message ('' if valid).
export const validateEmail = (value) => {
  const email = (value ?? '').trim();
  if (email === '') return t.errors.emailEmpty;
  if (!EMAIL_REGEX.test(email)) return t.errors.emailInvalid;
  return '';
};

export const validatePassword = (value) => {
  if (!value) return t.errors.passwordEmpty;
  if (value.length < 6) return t.errors.passwordShort;
  return '';
};