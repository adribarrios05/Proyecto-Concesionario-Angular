import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para ocultar o mostrar contraseñas.
 * Muestra asteriscos si `showPassword` es falso.
 */
@Pipe({
  name: 'passwordView',
  standalone: true
})
export class PasswordViewPipe implements PipeTransform {

  /**
   * Transforma una cadena de contraseña en una vista segura u original.
   * @param value Contraseña original
   * @param showPassword Booleano que indica si se muestra la contraseña en texto plano
   * @returns Contraseña visible u oculta con asteriscos
   */
  transform(value: string, showPassword: boolean): string {
    return showPassword ? value : '*'.repeat(value.length);
  }

}
