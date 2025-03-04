import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerStrapiRepositoryService } from 'src/app/core/repositories/impl/customer-strapi-repository.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { User } from 'src/app/core/models/auth.model';
import { LoadingController, ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
  customer?: Customer | null

  constructor(
    private fb: FormBuilder,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateService: TranslateService,
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

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authSvc.getCurrentUser();
      if(user){
          this.customer = await lastValueFrom(this.customerSvc.getByUserId(user.id));
          console.log(this.customer);
          if (this.customer) {
            const updatedCustomer: any = {
              ...this.customer,
              email:user.email,
              userId:user.id,
              picture: typeof this.customer.picture === 'object' ? 
                           this.customer.picture.url : 
                           undefined
            };
            this.profileForm.patchValue(updatedCustomer);
          }
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateService.get('COMMON.ERROR.LOAD')),
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  saveChanges() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;

      console.log('Datos actualizados que se enviarán:', updatedData);
  
      if(this.customer)
        this.customerSvc.update(this.customer?.id, updatedData).subscribe({
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
