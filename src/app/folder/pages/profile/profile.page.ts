import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerStrapiRepositoryService } from 'src/app/core/repositories/impl/customer-strapi-repository.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { User } from 'src/app/core/models/auth.model';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  originalValues: any = {};
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg'; 
  isLoggedIn: boolean = false;
  customerId!: string

  constructor(
    private fb: FormBuilder,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,
    private router: Router,
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      //password: ['', Validators.required],
      //confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.required],
      dni: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authSvc.me().subscribe({
      next: (user) => {
        this.isLoggedIn = true;
  
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
        });
  
        this.customerSvc.getByUserId(user.id).subscribe({
          next: (customer) => {
            if (customer) {
              this.customerId = customer.id;
              this.profileForm.patchValue({
                name: customer.name,
                surname: customer.surname,
                phone: customer.phone,
                dni: customer.dni,
              });
              this.profileImage = customer.picture?.url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
            } else {
              console.log('El usuario no tiene un cliente vinculado.');
            }
          },
          error: (err) => {
            console.error('Error al cargar los datos del cliente:', err);
            this.profileImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';
          }
        });
      },
      error: (err) => {
        this.isLoggedIn = false;
        console.error('Error al verificar la autenticación:', err);
      }
    });
  }

  saveChanges() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;

      console.log('Datos actualizados que se enviarán:', updatedData);
  
      this.customerSvc.update(this.customerId, updatedData).subscribe({
        next: () => {
          console.log('Cambios guardados correctamente');
  
          this.originalValues = { ...updatedData };

        },
        error: (err) => {
          console.error('Error al guardar los cambios:', err);
        }
      });
    } else {
      console.warn('El formulario no es válido.');
    }
  }
  

  discardChanges() {
    this.profileForm.patchValue(this.originalValues);
    console.log('Cambios descartados');
  }

  changeProfileImage() {
    console.log('Abrir modal para cambiar imagen');
    // Lógica para cambiar imagen
  }

  logout() {
    this.authSvc.signOut().subscribe({
      next: () => {
        console.log('Sesión cerrada correctamente');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      },
    });
  }
}
