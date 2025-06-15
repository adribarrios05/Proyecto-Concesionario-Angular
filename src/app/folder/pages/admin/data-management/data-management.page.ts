import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { CarService } from 'src/app/core/services/impl/car.service';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { Car } from 'src/app/core/models/car.model';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.page.html',
  styleUrls: ['./data-management.page.scss'],
})
export class DataManagementPage {
  archivoSeleccionado: string = 'clientes';
  datosCargados: any[] = [];
  columnas: string[] = [];

  clientes: any[] = [];
  private nombreClientes: Record<string, string> = {};

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private carService: CarService
  ) {}

  ngOnInit() {
    this.http
      .get<any[]>('/assets/resultados/clientes_ordenados_por_fecha.json')
      .subscribe((data) => {
        this.clientes = data;
      });

    this.cargarArchivo(this.archivoSeleccionado);
  }

  exportarDatos() {
    this.http.get('/assets/datos_completos.json').subscribe((data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      saveAs(blob, 'datos_completos.json');
    });
  }

  cargarArchivo(tipo: string) {
    let archivo = '';
    switch (tipo) {
      case 'clientes':
        archivo = 'clientes_ordenados_por_fecha.json';
        break;
      case 'cochesConCliente':
        archivo = 'coches_con_cliente.json';
        break;
      case 'cochesDisponibles':
        archivo = 'coches_disponibles.json';
        break;
      case 'cochesTodos':
        archivo = 'coches_todos.json';
        break;
    }

    this.http.get<any[]>(`/assets/resultados/${archivo}`).subscribe((data) => {
      this.datosCargados = data;
      this.columnas = data.length ? Object.keys(data[0]) : [];
    });
  }

  // Para detectar cambio de segmento
  ngOnChanges() {
    this.cargarArchivo(this.archivoSeleccionado);
  }

  onSegmentChanged(event: any) {
    const value = event.detail?.value;
    if (typeof value === 'string') {
      this.cargarArchivo(value);
    }
  }

  getName(clienteId: string): string {
    if (!clienteId || clienteId === 'Disponible') {
    return 'Disponible';
  }
  
  if (!clienteId || typeof clienteId !== 'string') return '';

  // Ya está en caché
  if (this.nombreClientes[clienteId]) {
    return this.nombreClientes[clienteId];
  }

  // Evitar duplicadas si ya se está pidiendo
  this.nombreClientes[clienteId] = 'Cargando...';

  this.customerService.getById(clienteId).subscribe({
    next: (cliente) => {
      const nombreCompleto = `${cliente?.name} ${cliente?.surname}`;
      this.nombreClientes[clienteId] = nombreCompleto;
    },
    error: () => {
      this.nombreClientes[clienteId] = 'Desconocido';
    }
  });

  return this.nombreClientes[clienteId];
}

importarCochesDesdeJSON(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const contenido = e.target?.result as string;
      const coches: Car[] = JSON.parse(contenido);

      for (const coche of coches) {
        await this.carService.add(coche).toPromise(); 
      }

      console.log('Importación completada');
      alert('Coches importados correctamente');
    } catch (error) {
      console.error('Error importando coches:', error);
      alert('Error al importar el archivo');
    }
  };

  reader.readAsText(file);
}

}
