const MIN_LENGTH = 12;

/**
 * Validates password: min 12 chars, 1 upper, 1 lower, 1 digit, 1 special.
 * Returns null if valid, or an error message string.
 */
export function validatePassword(password: string): string | null {
  if (!password || password.length < MIN_LENGTH) {
    return 'La contraseña debe tener al menos 12 caracteres.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe incluir al menos una mayúscula.';
  }
  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe incluir al menos una minúscula.';
  }
  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe incluir al menos un número.';
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'La contraseña debe incluir al menos un carácter especial.';
  }
  return null;
}

export const PASSWORD_REQUIREMENTS =
  'Mín. 12 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.';
