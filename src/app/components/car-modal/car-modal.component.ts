import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html',
  styleUrls: ['./car-modal.component.scss'],
})
export class CarModalComponent {
  addCarForm: FormGroup;
  selectedFile: File | null = null; // Archivo seleccionado
  imagePreview: string | null = null; // Vista previa de la imagen

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.addCarForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      horsePower: [0, [Validators.required, Validators.min(0)]],
      doors: [0, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      type: ['', Validators.required],
      plate: ['', Validators.required],
      description: [''],
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
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  addCar() {
    if (this.addCarForm.valid && this.selectedFile) {
      const carData = { ...this.addCarForm.value };
      this.modalCtrl.dismiss({ carData, file: this.selectedFile });
    }
  }
}
