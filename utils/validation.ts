export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-$$$$]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

export const validateForm = (data: Record<string, any>, rules: Record<string, any[]>) => {
  const errors: Record<string, string> = {}

  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field]

    for (const rule of fieldRules) {
      if (rule.type === "required" && !validateRequired(value)) {
        errors[field] = rule.message || `${field} is required`
        break
      }

      if (rule.type === "email" && value && !validateEmail(value)) {
        errors[field] = rule.message || "Invalid email format"
        break
      }

      if (rule.type === "phone" && value && !validatePhone(value)) {
        errors[field] = rule.message || "Invalid phone number"
        break
      }

      if (rule.type === "minLength" && value && !validateMinLength(value, rule.value)) {
        errors[field] = rule.message || `Minimum length is ${rule.value}`
        break
      }

      if (rule.type === "maxLength" && value && !validateMaxLength(value, rule.value)) {
        errors[field] = rule.message || `Maximum length is ${rule.value}`
        break
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
