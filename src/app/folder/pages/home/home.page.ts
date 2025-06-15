import { Component, OnInit } from '@angular/core';

/**
 * Página principal de la aplicación. Sirve como punto de entrada al sistema.
 * Actualmente no contiene lógica activa, pero puede usarse para mostrar 
 * información general, dashboards o accesos rápidos.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  /**
   * Constructor del componente HomePage.
   */
  constructor() {}

  /**
   * Ciclo de vida OnInit: se ejecuta al inicializar el componente.
   */
  ngOnInit() {}
}
