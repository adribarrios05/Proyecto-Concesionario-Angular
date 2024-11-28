import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent  implements OnInit {
  @Output() filterChange = new EventEmitter<any>();

  caballos: RangeValue = { lower: 200, upper: 800 };
  precio: RangeValue = { lower: 50000, upper: 2000000 }
  marcasSeleccionadas: string[] = [];


  constructor() { }

  ngOnInit() {

  }

  onCaballosChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent;
    this.caballos = rangeEvent.detail.value;
    console.log('Nuevo rango de caballos:', this.caballos);
  }

  onPrecioChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent; 
    this.precio = rangeEvent.detail.value;
    console.log('Nuevo rango de precios:', this.precio);
  }

  onMarcaChange() {
    /*this.filterChange.emit({
      caballos: this.caballos,
      precio: this.precio,
      marcas: this.marcasSeleccionadas
    });*/
  }

}
