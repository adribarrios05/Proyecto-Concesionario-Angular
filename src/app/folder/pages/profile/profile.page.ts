import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerStrapiRepositoryService } from 'src/app/core/repositories/impl/customer-strapi-repository.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { User } from 'src/app/core/models/auth.model';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProfileImgModalComponent } from 'src/app/components/profile-img-modal/profile-img-modal.component';
import { AppComponent } from 'src/app/app.component';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  adminPassword: string = 'CONCESIONARIOSBACA2025';
  userRole: string[] = [];
  profileForm: FormGroup;
  originalValues: any = {};
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  isLoggedIn: boolean = false;
  customer?: Customer | null;
  isPictureSelectorOpen = false;
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateService: TranslateService,
    private router: Router,
    private modalCtrl: ModalController,
    private appComponent: AppComponent,
    private mediaService: BaseMediaService
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
      role: [''],
      picture: [''],
    });
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authSvc.getCurrentUser();
      if (user) {
        this.customer = await lastValueFrom(
          this.customerSvc.getById(user.id)
        );
        console.log(this.customer);

        if (this.customer) {
          this.profileForm.patchValue({
            ...this.customer,
            picture:
              typeof this.customer.picture === 'string'
                ? this.customer.picture
                : this.customer.picture?.url ?? '',
          });

          this.profileImage =
            typeof this.customer.picture === 'string'
              ? this.customer.picture
              : this.customer.picture?.url ??
                'https://ionicframework.com/docs/img/demos/avatar.svg';

          const updatedCustomer: any = {
            ...this.customer,
            email: user.email,
            userId: user.id,
            role:
              this.customer.role && this.customer.role.length > 0
                ? this.customer.role
                : ['customer'],
          };

          this.userRole = updatedCustomer.role;
          this.profileForm.patchValue(updatedCustomer);
        }
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: await lastValueFrom(
          this.translateService.get('COMMON.ERROR.LOAD')
        ),
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  saveChanges() {
    if (this.profileForm.valid) {
      this.isSaving = true;

      console.log('⏳ Esperando 1 segundo antes de guardar...');

      setTimeout(() => {
        const updatedData = { ...this.profileForm.value };

        console.log('Datos actualizados que se enviarán:', updatedData);

        if (this.customer) {
          this.customerSvc.update(this.customer.id, updatedData).subscribe({
            next: async () => {
              console.log('✅ Cambios guardados correctamente');
              this.isSaving = false;

              const toast = await this.toastController.create({
                message: 'Cambios guardados con éxito',
                duration: 3000,
                color: 'success',
                position: 'bottom',
              });
              await toast.present();
            },
            error: async (err) => {
              console.error('❌ Error al guardar los cambios:', err);
              this.isSaving = false;

              const toast = await this.toastController.create({
                message: 'Error al guardar los cambios',
                duration: 3000,
                color: 'danger',
                position: 'bottom',
              });
              await toast.present();
            },
          });
        }
      }, 1000);
    } else {
      console.warn('⚠️ El formulario no es válido.');
    }
  }

  discardChanges() {
    this.profileForm.patchValue(this.originalValues);
    console.log('Cambios descartados');
  }

  updateProfileImage(picture: any) {
    if (!this.customer) return;

    const imageUrl = typeof picture === 'string' ? picture : picture.url;

    const previousPicture =
      typeof this.customer.picture === 'string'
        ? undefined
        : this.customer.picture;

    const updatedData = {
      ...this.customer,
      picture: {
        url: imageUrl,
        large: previousPicture?.large,
        medium: previousPicture?.medium,
        small: previousPicture?.small,
        thumbnail: previousPicture?.thumbnail,
      },
    };

    this.customerSvc.update(this.customer.id, updatedData).subscribe({
      next: () => {
        console.log('✅ Imagen de perfil actualizada correctamente');
        this.profileForm.patchValue({ picture: imageUrl });
        this.profileImage = imageUrl;
        this.appComponent.updateNavbarProfileImage(imageUrl);
      },
      error: (err) => {
        console.error('❌ Error al actualizar la imagen de perfil:', err);
      },
    });
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

  isClient(): boolean {
    return (
      this.userRole.includes('customer') && !this.userRole.includes('admin')
    );
  }

  confirmAdminPassword() {
    const adminKey = 'CONCESIONARIOSBACA2025';

    if (this.adminPassword === adminKey) {
      if (this.customer) {
        const updatedData = {
          ...this.customer,
          role: [...this.customer.role, 'administrador'],
        };

        this.customerSvc.update(this.customer.id, updatedData).subscribe({
          next: () => {
            console.log('Rol actualizado correctamente a Administrador');
            this.userRole = updatedData.role;
          },
          error: (err) => {
            console.error('Error al actualizar el rol:', err);
          },
        });
      }
    } else {
      alert('Contraseña incorrecta');
    }
  }

  async openPictureSelector() {
    const modal = await this.modalCtrl.create({
      component: ProfileImgModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.updateProfileImage(data.data);
        this.saveChanges;
      }
    });

    return await modal.present();
  }

  closePictureSelector() {
    this.isPictureSelectorOpen = false;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const blob = file as Blob;

    try {
      this.isSaving = true;

      const urls = await firstValueFrom(this.mediaService.upload(blob));
      const downloadURL = urls[0] as unknown as string;

      this.profileImage = downloadURL;
      this.profileForm.patchValue({ picture: downloadURL });

      if (this.customer) {
        const updatedData = {
          ...this.customer,
          picture: downloadURL || {
            url: downloadURL,
            large: undefined,
            medium: undefined,
            small: undefined,
            thumbnail: undefined,
          },
        };

        console.log("Customer id: ", this.customer.id)

        this.customerSvc.update(this.customer.id, updatedData).subscribe({
          next: () => {
            console.log('✅ Imagen subida y guardada correctamente');
            this.appComponent.updateNavbarProfileImage(downloadURL);
          },
          error: (err) => {
            console.error('❌ Error al guardar imagen en Firestore:', err);
          },
          complete: () => {
            this.isSaving = false;
          },
        });
      }
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      this.isSaving = false;
    }
  }
}
