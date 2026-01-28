/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Validate zip code (5 digits)
 * @param {string} zipCode - Zip code to validate
 * @returns {boolean} Is valid
 */
export const isValidZipCode = (zipCode) => {
    const zipRegex = /^\d{5}$/
    return zipRegex.test(zipCode)
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} Is valid
 */
export const isRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0
    }
    return value !== null && value !== undefined
}

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @returns {boolean} Is valid
 */
export const hasMinLength = (value, minLength) => {
    return value && value.length >= minLength
}

/**
 * Validate field and return error message
 * @param {string} fieldName - Field name
 * @param {any} value - Value to validate
 * @param {object} rules - Validation rules
 * @returns {string|null} Error message or null
 */
export const validateField = (fieldName, value, rules = {}) => {
    if (rules.required && !isRequired(value)) {
        return `${fieldName} is required`
    }

    if (rules.email && !isValidEmail(value)) {
        return `${fieldName} must be a valid email`
    }

    if (rules.phone && !isValidPhone(value)) {
        return `${fieldName} must be a 10-digit phone number`
    }

    if (rules.zipCode && !isValidZipCode(value)) {
        return `${fieldName} must be a 5-digit zip code`
    }

    if (rules.minLength && !hasMinLength(value, rules.minLength)) {
        return `${fieldName} must be at least ${rules.minLength} characters`
    }

    return null
}

/**
 * Validate entire form
 * @param {object} formData - Form data object
 * @param {object} validationRules - Validation rules object
 * @returns {object} Errors object
 */
export const validateForm = (formData, validationRules) => {
    const errors = {}

    for (const [field, rules] of Object.entries(validationRules)) {
        const error = validateField(field, formData[field], rules)
        if (error) {
            errors[field] = error
        }
    }

    return errors
}
