import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.model';
import { Customer } from 'src/app/core/models/customer.model';
import { CustomerStrapiRepositoryService } from 'src/app/core/repositories/impl/customer-strapi-repository.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import {
  dniValidator,
  passwordsMatchValidator,
  passwordValidator,
} from 'src/app/core/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordValidator]],
        confirmPassword: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(2)]],
        surname: ['', [Validators.required, Validators.minLength(2)]],
        dni: ['', [Validators.required, dniValidator]],
        phone: ['', [Validators.required, Validators.minLength(9)]],
        birthDate: ['', [Validators.required]],
        role: [''],
      },
      { validators: passwordsMatchValidator, dniValidator }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let formData = this.registerForm.value;

      const adminKey = 'CONCESIONARIOSBACA2025';
      const assignedRoles =
        formData.adminPassword === adminKey
          ? ['customer', 'admin']
          : ['customer'];

      const { email, username, password } = formData;

      // 1. Crear usuario de Firebase Auth
      this.authSvc.signUp({ email, username, password }).subscribe({
        next: (user: User) => {
          const customer: Customer = {
            id: user.id,
            name: formData.name,
            surname: formData.surname,
            dni: formData.dni,
            phone: formData.phone,
            birthDate: new Date(formData.birthDate),
            picture: '',
            username: formData.username,
            role: assignedRoles,
            user: user, // objeto User
          };

          this.customerSvc.add(customer).subscribe({
            next: () => {
              this.router.navigateByUrl('/home');
            },
            error: (err) =>
              console.error('❌ Error al guardar el Customer', err),
          });
        },
        error: (err) => console.error('❌ Error al registrar el usuario', err),
      });
    } else {
      console.log('⚠️ Formulario no válido');
    }
  }

  onLogin() {
    this.registerForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: returnUrl },
      replaceUrl: true,
    });
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get name() {
    return this.registerForm.get('name');
  }
  get surname() {
    return this.registerForm.get('surname');
  }
  get username() {
    return this.registerForm.get('username');
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
