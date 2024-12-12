import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer.model';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss']
})
export class CustomerModalComponent {
  @Input() customer!: Customer;
  formGroup: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      age: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.customer) {
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
      this.modalCtrl.dismiss({ action: 'save', data: this.formGroup.value });
    }
  }

  delete() {
    this.modalCtrl.dismiss({ action: 'delete', data: this.customer });
  }
}
