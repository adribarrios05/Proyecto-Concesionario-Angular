import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.model';
import { Customer } from 'src/app/core/models/customer.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { dniValidator, passwordsMatchValidator, passwordValidator } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  registerForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private authSvc:BaseAuthenticationService,
    private customerSvc: CustomerService,
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, dniValidator]],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      age: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator, dniValidator });
  }

  onSubmit() {
    if (this.registerForm.valid) {

      this.authSvc.signUp(this.registerForm.value).subscribe({
        next: (resp:User) => {
          console.log('Respuesta del backend:', resp);
          const userData = {
            ...this.registerForm.value,
            userId: resp.id,
            age: this.convertToISODate(this.registerForm.value.age)
          };

          console.log('Datos del cliente después de formatear la fecha:', userData);

          this.customerSvc.add({userData}).subscribe({
            next: resp => {
              console.log('Customer registrado: ', resp)
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
              this.router.navigateByUrl(returnUrl);
            },
            error: err => {
              console.error('Error al registrar el cliente: ', err)
            }
          });
        },
        error: err => {
          console.log('Error al registrar el usuario: ', err);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  onLogin(){
    this.registerForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/login'], {queryParams:{ returnUrl:returnUrl}, replaceUrl:true});
  }

  convertToISODate(date: string): string {
    const [day, month, year] = date.split('-');
  
    return `${year}-${month}-${day}`;
  }

  get name() {
    return this.registerForm.get('name');
  }
  get surname() {
    return this.registerForm.get('surname');
  }
  get username() {
    return this.registerForm.get('username')
  }
  get dni() {
    return this.registerForm.get('dni');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get age() {
    return this.registerForm.get('age');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

}
