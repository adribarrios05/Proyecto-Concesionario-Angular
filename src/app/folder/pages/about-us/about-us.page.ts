import { Component, AfterViewInit } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
/// <reference types="google.maps" />

/**
 * Página que muestra un mapa con la localización de varios concesionarios.
 * 
 * Usa Google Maps de Capacitor para renderizar el mapa y colocar marcadores con eventos interactivos.
 */
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements AfterViewInit {

  /** Instancia del mapa de Google */
  map!: GoogleMap;

  /** Nombre del concesionario seleccionado */
  selectedLocation: string = '';

  /** Lista de IDs de los marcadores agregados al mapa */
  markerIds: string[] = [];

  /**
   * Coordenadas y nombres de los concesionarios a mostrar en el mapa.
   */
  dealershipLocations = [
    { lat: 36.740593415355185, lng: -4.554227569330064, title: "Campanillas" }, 
    { lat: 36.71474387800368, lng: -4.313236528055307, title: "Rincón de la Victoria" },  
    { lat: 38.66433838189199, lng: -9.074217301969389, title: "Barreiro" }
  ];

  constructor() {}

  /**
   * Hook del ciclo de vida que se ejecuta después de que la vista se ha inicializado.
   */
  async ngAfterViewInit() {
    await this.loadMap();
  }

  /**
   * Carga el mapa de Google y añade los marcadores definidos en `dealershipLocations`.
   */
  async loadMap() {
    this.map = await GoogleMap.create({
      id: 'map',
      element: document.getElementById('map') as HTMLElement,
      apiKey: 'AIzaSyC8wq96z-YBLYIMmLRioPgW_SDFq8MgBHU',
      config: {
        center: { lat: 40.4168, lng: -3.7038 }, // Centrado en España
        zoom: 6
      }
    });

    // 📌 Añadir marcadores de concesionarios
    for (let location of this.dealershipLocations) {
      const markerId = await this.map.addMarker({
        coordinate: { lat: location.lat, lng: location.lng }
      });

      this.markerIds.push(markerId);

      // 📌 Evento para mostrar el nombre del concesionario en un div aparte
      this.map.setOnMarkerClickListener(async (event) => {
        const clickedMarkerIndex = this.markerIds.findIndex(id => id === event.markerId);
        if (clickedMarkerIndex !== -1) {
          this.selectedLocation = this.dealershipLocations[clickedMarkerIndex].title;
        }
      });
    }
  }
}
