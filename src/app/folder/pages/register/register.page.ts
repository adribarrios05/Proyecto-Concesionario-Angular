import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.model';
import { Customer } from 'src/app/core/models/customer.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import {
  dniValidator,
  passwordsMatchValidator,
  passwordValidator,
} from 'src/app/core/utils/validators';

/**
 * Página de registro para nuevos usuarios.
 * Permite registrar usuarios en Firebase Auth y crear su perfil como `Customer`.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  /** Formulario de registro reactivo */
  registerForm: FormGroup;

  /** Booleano que controla la visibilidad del campo de contraseña */
  showPassword: boolean = false;

  /**
   * Constructor de la clase.
   * @param fb Servicio para construir formularios reactivos
   * @param router Servicio para redirección de rutas
   * @param route Ruta actual para obtener parámetros de navegación
   * @param authSvc Servicio de autenticación base
   * @param customerSvc Servicio de gestión de clientes
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService
  ) {
    // Inicialización del formulario con validaciones personalizadas
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
      { validators: passwordsMatchValidator }
    );
  }

  /**
   * Envía el formulario si es válido, crea el usuario en Firebase
   * y guarda los datos como `Customer`.
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      let formData = this.registerForm.value;

      const adminKey = 'CONCESIONARIOSBACA2025';
      const assignedRoles =
        formData.adminPassword === adminKey
          ? ['customer', 'admin']
          : ['customer'];

      const { email, username, password } = formData;

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
            user: user,
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

  /**
   * Redirige a la vista de login y reinicia el formulario de registro.
   */
  onLogin(): void {
    this.registerForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: returnUrl },
      replaceUrl: true,
    });
  }

  /**
   * Alterna la visibilidad del campo de contraseña.
   */
  changePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /** Getter del campo `name` del formulario */
  get name() {
    return this.registerForm.get('name');
  }

  /** Getter del campo `surname` del formulario */
  get surname() {
    return this.registerForm.get('surname');
  }

  /** Getter del campo `username` del formulario */
  get username() {
    return this.registerForm.get('username');
  }

  /** Getter del campo `dni` del formulario */
  get dni() {
    return this.registerForm.get('dni');
  }

  /** Getter del campo `phone` del formulario */
  get phone() {
    return this.registerForm.get('phone');
  }

  /** Getter del campo `age` (birthDate) del formulario */
  get age() {
    return this.registerForm.get('age');
  }

  /** Getter del campo `email` del formulario */
  get email() {
    return this.registerForm.get('email');
  }

  /** Getter del campo `password` del formulario */
  get password() {
    return this.registerForm.get('password');
  }
}
