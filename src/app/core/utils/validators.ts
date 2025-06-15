import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validador personalizado que comprueba si una contraseña cumple con los requisitos de seguridad:
 * - Al menos 8 caracteres
 * - Al menos una mayúscula, una minúscula, un número y un carácter especial
 * 
 * @param control Campo del formulario que contiene la contraseña.
 * @returns Error de validación o null si es válida.
 */
export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
  const valid = passwordRegex.test(control.value);

  return valid ? null : { passwordStrength: 'La contraseña no cumple con los requisitos' };
}

/**
 * Validador personalizado que comprueba si los campos 'password' y 'confirmPassword' coinciden.
 * 
 * @param group Grupo de formulario que contiene ambos campos.
 * @returns Error de validación o null si coinciden.
 */
export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: 'Las contraseñas no coinciden' };
}

/**
 * Validador de formato para DNI español (8 dígitos seguidos de una letra mayúscula).
 * 
 * @param control Campo del formulario con el DNI.
 * @returns Error de validación o null si el formato es correcto.
 */
export function dniValidator(control: AbstractControl): ValidationErrors | null {
  const dniRegex = /^\d{8}[A-Z]$/;
  const valid = dniRegex.test(control.value);

  return valid ? null : { dniValidation: 'El DNI no existe' };
}
