import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordView',
  standalone: true
})
export class PasswordViewPipe implements PipeTransform {

  transform(value: string, showPassword: boolean): string {
    return showPassword ? value : "*".repeat(value.length);
  }

}
