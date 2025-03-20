import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer.model';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent {
  @Input() customer!: Customer;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  formGroup: FormGroup;
  selectedImageFile: File | null = null;
  selectedImageUrl: string | null = null;
  isUploading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      //picture: ['']
    });
  }

  ngOnInit() {
    if (this.customer) {
      console.log("Edad: ", this.customer.birthDate)
      this.formGroup.patchValue({
        ...this.customer
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (this.formGroup.valid) {
      const updatedData = { ...this.formGroup.value };

      // 🔥 Si hay una imagen seleccionada, subirla antes de guardar los datos
      if (this.selectedImageFile) {
        this.uploadImage(this.selectedImageFile, (imageUrl) => {
          updatedData.picture = imageUrl;
          this.modalCtrl.dismiss({ action: 'save', data: updatedData });
        });
      } else {
        this.modalCtrl.dismiss({ action: 'save', data: updatedData });
      }
    }
  }

  delete() {
    this.modalCtrl.dismiss({ action: 'delete', data: this.customer });
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]; // Aseguramos que sea un archivo válido
  
      if (file) {
        this.selectedImageFile = file; // Guardamos el archivo seleccionado
  
        // 🔥 Mostrar previsualización de la imagen seleccionada
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImageUrl = e.target.result;
        };
        reader.readAsDataURL(file); // ✅ Pasamos un objeto `File` válido (nunca null)
      }
    }
  }
  

  // 🔥 Subir la imagen a Firebase Storage
  uploadImage(file: File, callback: (url: string) => void) {
    this.isUploading = true;
    const storage = getStorage();
    const storageRef = ref(storage, `customers/${this.customer.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Subida: ${progress}% completado`);
      },
      (error) => {
        console.error('❌ Error al subir la imagen:', error);
        this.isUploading = false;
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('✅ Imagen subida con éxito:', downloadURL);
          this.isUploading = false;
          callback(downloadURL);
        });
      }
    );
  }
}
