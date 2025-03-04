import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss'],
})
export class CarModalComponent implements OnInit{
  formGroup: FormGroup;
  selectedFile: File | null = null; // Archivo seleccionado
  imagePreview: string | null = null; // Vista previa de la imagen

  constructor(
    private modalCtrl: ModalController, 
    private fb: FormBuilder
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

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
  
      this.formGroup.patchValue({ picture: this.imagePreview });
    }
  }
  

  /*getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
  
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });
  
    return dirtyValues;
  }*/

  ngOnInit() {}

  addCar() {
    if (this.formGroup.valid) {
      const carData = { ...this.formGroup.value };
  
      console.log("📌 Datos del coche antes de procesar la imagen:", carData);
  
      let imageFile: File | null = null;
      if (carData.picture && carData.picture.startsWith("data:image")) {
        imageFile = this.getFileFromBase64(carData.picture);
      }
  
      console.log("📌 Archivo de imagen convertido:", imageFile);
  
      this.modalCtrl.dismiss({ carData, imageFile });
    } else {
      console.error('❌ Formulario no válido:', this.formGroup.value);
    }
  }
  
  

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getFileFromBase64(base64String: string): File | null {
    if (!base64String) return null;
  
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'image.png', { type: mime });
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