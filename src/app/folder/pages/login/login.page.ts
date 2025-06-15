import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

/**
 * Página de Login del usuario. Permite autenticarse con email y contraseña.
 * Si el usuario ya está autenticado, redirige automáticamente.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  /** Formulario reactivo de login con campos de email y contraseña */
  loginForm: FormGroup;

  /** Determina si el campo de contraseña se muestra como texto o como puntos */
  showPassword: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para construir el formulario reactivo
   * @param router Router para redirección después del login
   * @param route ActivatedRoute para acceder a parámetros como `returnUrl`
   * @param authSvc Servicio de autenticación
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: BaseAuthenticationService
  ) {
    // 🧱 Inicialización del formulario con validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Al inicializar el componente, comprueba si ya hay una sesión activa.
   * Si la hay, redirige automáticamente al `returnUrl` o a `/home`.
   */
  ngOnInit() {
    this.authSvc.me().subscribe({
      next: (user) => {
        if (user) {
          console.log("Hay una sesión activa: ", user)
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err) => {
        console.log('No hay sesión activa.', err);
      }
    });
  }

  /**
   * Ejecuta el proceso de login si el formulario es válido.
   * En caso de éxito, redirige al `returnUrl` o a `/home`.
   */
  login() {
    if (this.loginForm.valid) {
      this.authSvc.signIn(this.loginForm.value).subscribe({
        next: resp => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
          console.log("Usuario logueado correctamente: ", resp.username);
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  /**
   * Redirige a la página de registro, conservando el `returnUrl` si existe.
   */
  onRegister() {
    this.loginForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/register'], { queryParams: { returnUrl: returnUrl }, replaceUrl: true });
  }

  /**
   * Alterna la visibilidad del campo de contraseña.
   */
  changePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Getter para el campo `email` del formulario.
   */
  get email() {
    return this.loginForm.controls['email'];
  }

  /**
   * Getter para el campo `password` del formulario.
   */
  get password() {
    return this.loginForm.controls['password'];
  }
}
