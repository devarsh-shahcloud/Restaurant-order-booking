const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

const isValidZipCode = (zipCode) => {
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zipCode);
};

const isRequired = (value) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateField = (fieldName, value, rules = {}) => {
  if (rules.required && !isRequired(value)) {
    return `${fieldName} is required`;
  }

  if (rules.email && !isValidEmail(value)) {
    return `${fieldName} must be a valid email`;
  }

  if (rules.phone && !isValidPhone(value)) {
    return `${fieldName} must be a 10-digit phone number`;
  }

  if (rules.zipCode && !isValidZipCode(value)) {
    return `${fieldName} must be a 5-digit zip code`;
  }

  if (rules.minLength && !hasMinLength(value, rules.minLength)) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  return null;
};
