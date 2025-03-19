import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-img-modal',
  templateUrl: './profile-img-modal.component.html',
  styleUrls: ['./profile-img-modal.component.scss'],
})
export class ProfileImgModalComponent {
  @Output() pictureSelected = new EventEmitter<string>(); 

  constructor(private modalCtrl: ModalController) {}

  onPictureChange(image: any) {
    if (typeof image === 'string') {
      this.modalCtrl.dismiss(image); 
    } else if (image && typeof image === 'object' && 'url' in image) {
      this.modalCtrl.dismiss(image.url); 
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
  }
}
