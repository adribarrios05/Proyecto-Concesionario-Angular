import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { CarService } from 'src/app/core/services/impl/car.service';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { Car } from 'src/app/core/models/car.model';
import { firstValueFrom } from 'rxjs';

/**
 * Página de gestión de datos.
 * Permite exportar datos en formato JSON, importar coches desde un archivo, y visualizar diferentes conjuntos de datos.
 */
@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.page.html',
  styleUrls: ['./data-management.page.scss'],
})
export class DataManagementPage {
  /** Tipo de archivo seleccionado en el segmento (clientes, coches, etc.) */
  archivoSeleccionado: string = 'clientes';

  /** Datos cargados dinámicamente para mostrar en la tabla */
  datosCargados: any[] = [];

  /** Columnas que se imprimen dinámicamente en la tabla */
  columnas: string[] = [];

  /** Clientes cargados desde JSON */
  clientes: any[] = [];

  /** Diccionario con los nombres cacheados de los clientes */
  private nombreClientes: Record<string, string> = {};

  constructor(
    private http: HttpClient,
    private customerService: CustomerService,
    private carService: CarService
  ) {}

  /**
   * Al iniciar la página, se carga el archivo de clientes por defecto
   */
  ngOnInit() {
    this.http
      .get<any[]>('/assets/resultados/clientes_ordenados_por_fecha.json')
      .subscribe((data) => {
        this.clientes = data;
      });

    this.cargarArchivo(this.archivoSeleccionado);
  }

  /**
   * Exporta todos los datos de clientes y coches desde Firebase en un solo archivo JSON.
   */
  exportarDatos() {
    Promise.all([
      firstValueFrom(this.customerService.getAll(1, 10000, {}, 'name')),
      firstValueFrom(this.carService.getAll(1, 10000, {}, 'brand')),
    ])
      .then(([customersPaginado, carsPaginado]) => {
        const customers = customersPaginado?.data;
        const cars = carsPaginado?.data;

        const customersFiltrados = customers?.map((cliente: any) => ({
          id: cliente.id,
          name: cliente.name,
          surname: cliente.surname,
          role: cliente.role,
          dni: cliente.dni,
          picture: cliente.picture,
          username: cliente.username,
          birthDate: cliente.birthDate,
          phone: cliente.phone,
          user: typeof cliente.user === 'object' && cliente.user?.id
            ? cliente.user.id
            : cliente.user,
        }));

        const carsFiltrados = cars?.map((car: any) => ({
          id: car.id,
          brand: car.brand,
          model: car.model,
          plate: car.plate,
          price: car.price,
          color: car.color,
          description: car.description,
          horsePower: car.horsePower,
          doors: car.doors,
          picture: car.picture,
          type: car.type,
          customer: typeof car.customer === 'object' && car.customer?.id
            ? car.customer.id
            : car.customer,
        }));

        const datos = {
          customers: customersFiltrados,
          cars: carsFiltrados,
        };

        const blob = new Blob([JSON.stringify(datos, null, 2)], {
          type: 'application/json',
        });

        saveAs(blob, 'datos_completos.json');
      })
      .catch((error) => {
        console.error('Error exportando datos:', error);
        alert('Error al exportar los datos');
      });
  }

  /**
   * Carga el archivo de datos JSON según el tipo indicado (clientes, coches, etc.)
   * @param tipo Tipo de archivo a cargar
   */
  cargarArchivo(tipo: string) {
    let archivo = '';
    switch (tipo) {
      case 'clientes':
        archivo = 'customers_sorted_by_birth.json';
        break;
      case 'cochesConCliente':
        archivo = 'cars_with_customer.json';
        break;
      case 'cochesDisponibles':
        archivo = 'cars_available.json';
        break;
      case 'cochesTodos':
        archivo = 'all_cars.json';
        break;
    }

    this.http
      .get<any>(`/assets/data_SGE/resultados/${archivo}`)
      .subscribe((response) => {
        const data = Array.isArray(response) ? response : response.data ?? [];

        // Filtrar campos no deseados
        const datosFiltrados = data.map((item: any) => {
          const copia = { ...item };
          delete copia.id;
          delete copia.picture;
          delete copia.user;  
          delete copia.customer;
          delete copia.description;
          return copia;
        });

        this.datosCargados = datosFiltrados;
        this.columnas = datosFiltrados.length
          ? Object.keys(datosFiltrados[0])
          : [];
      });
  }

  /**
   * Método del ciclo de vida que se puede usar para detectar cambios en el segmento seleccionado.
   */
  ngOnChanges() {
    this.cargarArchivo(this.archivoSeleccionado);
  }

  /**
   * Detecta cambio de segmento en la interfaz y carga el archivo correspondiente.
   * @param event Evento del cambio de segmento
   */
  onSegmentChanged(event: any) {
    const value = event.detail?.value;
    if (typeof value === 'string') {
      this.cargarArchivo(value);
    }
  }

  /**
   * Devuelve el nombre completo de un cliente a partir de su ID.
   * Si no está en caché, realiza la petición a Firebase.
   * @param clienteId ID del cliente
   * @returns Nombre completo o estado de carga
   */
  getName(clienteId: string): string {
    if (!clienteId || clienteId === 'Disponible') {
      return 'Disponible';
    }

    if (!clienteId || typeof clienteId !== 'string') return '';

    if (this.nombreClientes[clienteId]) {
      return this.nombreClientes[clienteId];
    }

    this.nombreClientes[clienteId] = 'Cargando...';

    this.customerService.getById(clienteId).subscribe({
      next: (cliente) => {
        const nombreCompleto = `${cliente?.name} ${cliente?.surname}`;
        this.nombreClientes[clienteId] = nombreCompleto;
      },
      error: () => {
        this.nombreClientes[clienteId] = 'Desconocido';
      },
    });

    return this.nombreClientes[clienteId];
  }

  /**
   * Importa una lista de coches desde un archivo JSON y los añade a Firebase.
   * @param event Evento del input de tipo file
   */
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
