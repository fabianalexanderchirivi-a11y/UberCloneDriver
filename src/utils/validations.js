
import {
  genderValues,
  languageValues,
  categoryValues,
  colorValues,
} from './options';

export const validateEmail = (value) => {
  const email = (value ?? '').trim().toLowerCase();

  if (email === '') return 'emailEmpty';

  const emailRegex =
    /^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/;

  if (!emailRegex.test(email)) return 'emailInvalid';

  const domain = email.split('@')[1];

  const allowedDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'live.com',
    'hotmail.es',
    'outlook.es',
  ];

  if (!allowedDomains.includes(domain)) return 'emailInvalid';

  return '';
};

export const validatePassword = (value) => {
  const password = value ?? '';

  if (password === '') return 'passwordEmpty';
  if (password.length < 6) return 'passwordShort';

  return '';
};

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: [A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
const VEHICLE_TEXT_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 -]+$/;
const DOCUMENT_REGEX = /^\d{6,10}$/;
const PHONE_REGEX = /^\d{10}$/;
const PLATE_REGEX = /^[A-Z]{3}\d{3}$/;
const YEAR_REGEX = /^\d{4}$/;
const DIGITS_REGEX = /^\d+$/;

const MIN_AGE = 18;
const MAX_NAME_LENGTH = 50;
const MAX_TEXT_LENGTH = 30;
const XL_MIN_CAPACITY = 6;

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  String(value).trim() === '';

export const validatePhoto = (uri) =>
  isEmpty(uri) ? 'photoRequired' : '';

export const validateFullName = (value) => {
  if (isEmpty(value)) return 'required';

  const name = String(value).trim();

  if (name.length > MAX_NAME_LENGTH) return 'fullNameTooLong';

  const words = name.split(' ');

  if (words.some((word) => word.length < 2)) {
    return 'fullNameInvalid';
  }

  if (!NAME_REGEX.test(name)) return 'fullNameInvalid';

  return '';
};

export const validateDocumentNumber = (value) => {
  if (isEmpty(value)) return 'required';

  return DOCUMENT_REGEX.test(String(value).trim())
    ? ''
    : 'documentInvalid';
};

export const validatePhone = (value) => {
  if (isEmpty(value)) return 'required';

  return PHONE_REGEX.test(String(value).trim())
    ? ''
    : 'phoneInvalid';
};

export const validateBirthDate = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return 'required';
  }

  const today = new Date();

  let age = today.getFullYear() - value.getFullYear();

  const hadBirthday =
    today.getMonth() > value.getMonth() ||
    (today.getMonth() === value.getMonth() &&
      today.getDate() >= value.getDate());

  if (!hadBirthday) age -= 1;

  return age >= MIN_AGE ? '' : 'underage';
};

export const validateOption = (value, allowedValues) =>
  allowedValues.includes(value) ? '' : 'optionRequired';

export const validatePlate = (value) => {
  if (isEmpty(value)) return 'required';

  return PLATE_REGEX.test(String(value).trim().toUpperCase())
    ? ''
    : 'plateInvalid';
};

const validateShortText = (value) => {
  if (isEmpty(value)) return 'required';

  const text = String(value).trim();

  if (text.length > MAX_TEXT_LENGTH) return 'textTooLong';
  if (!VEHICLE_TEXT_REGEX.test(text)) return 'textInvalid';

  return '';
};

export const validateBrand = validateShortText;
export const validateModel = validateShortText;

export const validateYear = (value) => {
  if (isEmpty(value)) return 'required';

  const year = String(value).trim();

  if (!YEAR_REGEX.test(year)) return 'yearInvalid';
  if (Number(year) > new Date().getFullYear()) return 'yearFuture';

  return '';
};

export const validateCapacity = (value, category) => {
  if (isEmpty(value)) return 'required';

  const capacity = String(value).trim();

  if (!DIGITS_REGEX.test(capacity) || Number(capacity) < 1) {
    return 'capacityInvalid';
  }

  if (category === 'xl' && Number(capacity) < XL_MIN_CAPACITY) {
    return 'capacityXl';
  }

  return '';
};

export const validatePersonalData = (data) => ({
  photo: validatePhoto(data.photo),
  fullName: validateFullName(data.fullName),
  documentNumber: validateDocumentNumber(data.documentNumber),
  phone: validatePhone(data.phone),
  birthDate: validateBirthDate(data.birthDate),
  gender: validateOption(data.gender, genderValues),
  email: validateEmail(data.email),
  language: validateOption(data.language, languageValues),
});

export const validateVehicleData = (data) => ({
  category: validateOption(data.category, categoryValues),
  plate: validatePlate(data.plate),
  brand: validateBrand(data.brand),
  model: validateModel(data.model),
  year: validateYear(data.year),
  color: validateOption(data.color, colorValues),
  capacity: validateCapacity(data.capacity, data.category),
  vehiclePhoto: validatePhoto(data.vehiclePhoto),
});

export const hasErrors = (errors) =>
  Object.values(errors).some(Boolean);
