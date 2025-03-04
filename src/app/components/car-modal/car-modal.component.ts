import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { FirebaseMediaService } from 'src/app/core/services/impl/firebase-media.service';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss'],
})
export class CarModalComponent implements OnInit{
  formGroup: FormGroup;
  isUploading = false;

  constructor(
    private modalCtrl: ModalController, 
    private fb: FormBuilder,
    private mediaService: BaseMediaService,
    private toastController: ToastController,
    private loadingController: LoadingController,

  ) {
    this.formGroup = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      horsePower: ['', [Validators.required, Validators.min(0)]],
      doors: ['', [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      type: ['', Validators.required],
      plate: ['', Validators.required],
      description: [''],
      picture: ['']
    });
  }

  ngOnInit() {}

  async base64ToBlob(base64: string): Promise<Blob> {
    try {
      const response = await fetch(base64);
      return await response.blob();
    } catch (error) {
      console.error('❌ Error convirtiendo base64 a Blob:', error);
      throw error;
    }
  }

  async addCar() {
    if (this.formGroup.invalid) {
      console.error('❌ Formulario no válido:', this.formGroup.value);
      return;
    }

    const loading = await this.loadingController.create({ message: 'Subiendo imagen...' });
    await loading.present();

    const carData = { ...this.formGroup.value };

    try {
      if (carData.picture && typeof carData.picture === 'string' && carData.picture.startsWith('data:image')) {
        console.log("📌 Imagen en base64 obtenida del formulario:", carData.picture);

        // Convertimos la imagen base64 en Blob
        const imageBlob = await this.base64ToBlob(carData.picture);
        console.log("📌 Imagen convertida a Blob:", imageBlob);

        // Subimos la imagen
        const uploadResult = await firstValueFrom(this.mediaService.upload(imageBlob));
        console.log("📌 Respuesta del servicio de subida:", uploadResult);

        if (uploadResult.length > 0) {
          carData.picture = uploadResult[0]; // Guardamos la URL de la imagen subida
          console.log("✅ Imagen subida correctamente. URL:", carData.picture);
        } else {
          throw new Error("No se recibió URL de imagen después de la subida.");
        } 
      } else {
        console.warn("⚠️ No se detectó una imagen en base64, se mantiene la imagen existente:", carData.picture);
      }

      if (!carData.picture) {
        console.warn("⚠️ No se ha encontrado la imagen, verificando antes de cerrar el modal.");
      } else {
        console.log("✅ Imagen final que se enviará a Firebase:", carData.picture);
      }
      this.modalCtrl.dismiss({ carData });

      const toast = await this.toastController.create({
        message: 'Coche guardado correctamente.',
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();

    } catch (error) {
      console.error('❌ Error al subir la imagen:', error);

      const toast = await this.toastController.create({
        message: 'Error al guardar el coche.',
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      
    } finally {
      await loading.dismiss();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  get brand(){
    return this.formGroup.controls['brand']
  }
  get model(){
    return this.formGroup.controls['model']
  }
  get price(){
    return this.formGroup.controls['price']
  }
  get horsePower(){
    return this.formGroup.controls['horsePower']
  }
  get doors(){
    return this.formGroup.controls['doors']
  }
  get color(){
    return this.formGroup.controls['color']
  }
  get type(){
    return this.formGroup.controls['type']
  }
  get plate(){
    return this.formGroup.controls['plate']
  }
  get description(){
    return this.formGroup.controls['description']
  }
  get picture(){
    return this.formGroup.controls['picture']
  }
}