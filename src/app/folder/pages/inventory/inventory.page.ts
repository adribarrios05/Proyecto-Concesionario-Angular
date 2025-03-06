import { Component, Directive, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, Platform, RangeCustomEvent, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Car } from 'src/app/core/models/car.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { CarService } from 'src/app/core/services/impl/car.service';
import { InfiniteScrollCustomEvent, RangeValue, toastController } from '@ionic/core';
import { CarModalComponent } from 'src/app/components/car-modal/car-modal.component';
import { SearchParams } from 'src/app/core/repositories/intefaces/base-repository.interface';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { CollectionChange, ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subscription.interface';
import { CAR_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { Customer } from 'src/app/core/models/customer.model';
import jsPDF from 'jspdf';
import { Directory, Encoding } from '@capacitor/filesystem';
import { Filesystem } from '@capacitor/filesystem';
import { FirebaseCustomer } from 'src/app/core/models/firebase/firebase-customer.model';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { FilePicker } from '@capawesome/capacitor-file-picker';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
  standalone: false
})
export class InventoryPage implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  caballos: RangeValue = { lower: 200, upper: 1200 };
  precio: RangeValue = { lower: 50000, upper: 2000000 }
  marcasSeleccionadas: string[] = [];
  _cars: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);
  cars$: Observable<Car[]> = this._cars.asObservable();
  isLoggedIn: boolean = false;
  private loadedIds: Set<string> = new Set(); 

  constructor(
    private modalCtrl: ModalController,
    private carSvc: CarService,
    private authSvc: BaseAuthenticationService,
    private customerSvc: CustomerService,
    private alertController: AlertController,
    @Inject(CAR_COLLECTION_SUBSCRIPTION_TOKEN) private carSubscription: ICollectionSubscription<Car>
  ) { }

  ngOnInit() {
    this.authSvc.me().subscribe({
      next: (user) => {
        this.isLoggedIn = true; 
      },
      error: () => {
        this.isLoggedIn = false; 
      },
    });
    this.loadCars()
    this.carSubscription.subscribe('cars').subscribe((change: CollectionChange<Car>) => {
      const currentCars = [...this._cars.value]

      // Solo procesar cambios de documentos que ya tenemos cargados
      if (!this.loadedIds.has(change.id) && change.type !== 'added') {
        return;
      }

      switch(change.type) {
        case 'added':
        case 'modified':
          const index = currentCars.findIndex(p => p.id === change.id);
          if (index >= 0) {
            currentCars[index] = change.data!;
          }
          break;
        case 'removed':
          const removeIndex = currentCars.findIndex(p => p.id === change.id);
          if (removeIndex >= 0) {
            currentCars.splice(removeIndex, 1);
            this.loadedIds.delete(change.id);
          }
          break;
      }
      this._cars.next(currentCars);

    })
  }

  page:number = 1;
  pageSize:number = 4;
  pages:number = 0;
  isLoading: boolean = true

  loadCars(filters: SearchParams = {}){
    console.log("🔎 Cargando coches con filtros:", filters);

    this.page = 1
    this.carSvc.getAll(this.page, this.pageSize, filters).subscribe({
      next:(response:Paginated<Car>)=>{
        if (response.data.length === 0) {
          console.warn("⚠️ No se encontraron coches con los filtros aplicados.");
        } else {
            console.log("✅ Coches obtenidos:", response.data);
        }

        response.data.forEach(car => this.loadedIds.add(car.id));
        this._cars.next([...response.data]);
        this.page++;
        this.pages = response.pages;
        },
      error: (err) => console.error("Error al cargar los datos del coche", err),
    });
  }

  loadMoreCars(notify: HTMLIonInfiniteScrollElement | null = null, filters: SearchParams = {}){
    if(this.page<=this.pages){
      this.carSvc.getAll(this.page, this.pageSize, filters).subscribe({
        next:(response:Paginated<Car>)=>{
          response.data.forEach(car => this.loadedIds.add(car.id));
          this._cars.next([...this._cars.value, ...response.data])
          this.page++
          notify?.complete()
        }
      })
    } else {
      notify?.complete()
    }
  }

  isRangeValue(value: RangeValue): value is { lower: number; upper: number } {
    return typeof value === 'object' && 'lower' in value && 'upper' in value;
  }
  

  applyFilters() {
    const filters: any = { customer: null};

    console.log("📌 Aplicando filtros...");

    // 📌 Filtrar por rango de caballos
    if (this.isRangeValue(this.caballos)) {
        if (this.caballos.lower !== 200 || this.caballos.upper !== 1200) { // Ajuste de valores por defecto
            filters.horsePower = {
                $gte: this.caballos.lower,
                $lte: this.caballos.upper,
            };
            console.log("✅ Filtro de caballos aplicado:", filters.horsePower);
        }
    } else {
        console.error("❌ Error en el filtro de caballos: valor inesperado.");
    }

    // 📌 Filtrar por rango de precio
    if (this.isRangeValue(this.precio)) {
        if (this.precio.lower !== 50000 || this.precio.upper !== 2000000) { // Ajuste de valores por defecto
            filters.price = {
                $gte: this.precio.lower,
                $lte: this.precio.upper,
            };
            console.log("✅ Filtro de precio aplicado:", filters.price);
        }
    } else {
        console.error("❌ Error en el filtro de precio: valor inesperado.");
    }

    // 📌 Filtrar por marcas seleccionadas
    if (this.marcasSeleccionadas.length > 0) {
        filters.brand = {
            $in: this.marcasSeleccionadas,
        };
        console.log("✅ Filtro de marcas aplicado:", filters.brand);
    }

    console.log("📌 Filtros finales enviados a la consulta:", filters);
    this.loadCars(filters);
}


  resetFilters() {
    this.caballos = { lower: 200, upper: 1200 };
    this.precio = { lower: 50000, upper: 2000000 };
    this.marcasSeleccionadas = [];
    this.applyFilters();
  }

  onCaballosChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent;
    this.caballos = rangeEvent.detail.value;
    console.log('Nuevo rango de caballos:', this.caballos);
    this.applyFilters()
  }

  onPrecioChange(ev: Event) {
    const rangeEvent = ev as RangeCustomEvent; 
    this.precio = rangeEvent.detail.value;
    console.log('Nuevo rango de precios:', this.precio);
    this.applyFilters()
  }

  onMarcaChange(ev: any, marca: string) {
    if (ev.detail.checked) {
      this.marcasSeleccionadas.push(marca);
    } else {
      this.marcasSeleccionadas = this.marcasSeleccionadas.filter(m => m !== marca);
    }
    this.applyFilters();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if(this.page<=this.pages){}
      timer(1000).subscribe({
        next:(value)=>{
          this.loadMoreCars(ev.target)
        }
      })
  }

  async openCarModal() {
    const modal = await this.modalCtrl.create({
      component: CarModalComponent,
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        let { carData } = result.data;
        if (carData.picture) {
          if (typeof carData.picture === 'string') {
            console.log("✅ Imagen en string:", carData.picture);
          } else if (typeof carData.picture === 'object' && carData.picture.url) {
            console.log("✅ Imagen en objeto, extrayendo URL:", carData.picture.url);
            carData.picture = carData.picture.url;
          } else {
            console.warn("⚠️ Imagen en formato desconocido:", carData.picture);
            carData.picture = ''; 
          }
        } else {
          console.warn("⚠️ No se ha asignado imagen al coche antes de enviarlo.");
        }
  
        console.log("✅ Guardando coche con imagen final:", carData.picture);
  
        this.carSvc.add(carData).subscribe(() => {
          console.log("✅ Imagen vinculada correctamente:", carData.picture);
          this.loadCars(); 
        });
      }
    });
  
    await modal.present();
  }
  

  onBuy(car: Car) {
    if (this.isLoggedIn) {
      this.presentConfirmAlert(car);
    } else {
      console.error('El usuario no está autenticado');
    }
  }
  
  async presentConfirmAlert(car: Car) {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: `¿Está seguro de que desea comprar el ${car.brand} ${car.model}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Compra cancelada');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            this.processPurchase(car);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  processPurchase(car: Car) {
    this.authSvc.me().subscribe({
      next: (user) => {
        if (!user || (!user.id && !user.uid)) { 
          console.error('Error: Usuario no encontrado o sin id: ', [user, user.id, user.uid])
          return
        }

        let _userId = user.id || user.uid
        console.log("Usuario autenticado: ", [user, user.id, user.uid, user.email]);
        console.log("🔎 Buscando cliente con userId:", user.id? user.id : user.uid? user.uid : null);


        this.customerSvc.getByUserId(user.id? user.id : user.uid).subscribe({
          next: (customer) => {
            console.log("Customer: ", customer);
            if (!customer || !customer.id) {
              console.error(`❌ No se encontró un cliente asociado al usuario con UID: ${user.uid}`);
              return
            }

            console.log("✅ Cliente encontrado:", [customer, customer.id]);

            console.log("Car antes de updatearlo: ", car)
            const updatedCar = { ...car, customer: customer.id };
            console.log("🚀 Actualizando coche con:", [updatedCar, updatedCar.customer]);  
              
            this.carSvc.update(updatedCar.id, updatedCar).subscribe({
              next: () => {
                console.log(`Coche ${car.brand} ${car.model} comprado con éxito por el cliente ${customer.name}. Id: ${car.customer}`);
                this.generateContract(car, customer);
              },
              error: (err) => {
                console.error('Error al comprar el coche:', err);
              },
            });
          },
          error: (err) => {
            console.error('Error al obtener el cliente:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error al verificar la sesión:', err);
      },
    });
  }

  onDelete(car: Car) {
    this.presentDeleteConfirmAlert(car);
  }
  
  async presentDeleteConfirmAlert(car: Car) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar el coche ${car.brand} ${car.model}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteCar(car);
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  deleteCar(car: Car) {
    this.carSvc.delete(car.id).subscribe({
      next: () => {
        console.log(`Coche ${car.brand} ${car.model} eliminado con éxito.`);
        this.loadCars(); 
      },
      error: (err) => {
        console.error('Error al eliminar el coche:', err);
      },
    });
  }

  async generateContract(car: Car | FirebaseCar, customer: Customer | FirebaseCustomer) {
    const doc = new jsPDF();
  
    let customerEmail = 'No disponible';
  
    if ('userId' in customer && typeof customer.userId === 'string') {
      const currentUser = await this.authSvc.getCurrentUser();
      customerEmail = currentUser ? currentUser.email : 'No disponible';
    } else if ('user' in customer && typeof customer.user === 'string') {
      customerEmail = customer.user;
    }
  
    // Título del contrato
    doc.setFontSize(18);
    doc.text("CONTRATO DE COMPRA DE VEHÍCULO", 20, 20);
  
    // Datos del cliente
    doc.setFontSize(12);
    doc.text(`Datos del Cliente:`, 20, 40);
    doc.text(`Nombre: ${customer.name} ${customer.surname}`, 20, 50);
    doc.text(`DNI: ${customer.dni}`, 20, 60);
    doc.text(`Teléfono: ${customer.phone}`, 20, 70);
    doc.text(`Email: ${customerEmail}`, 20, 80);
  
    // Datos del coche
    doc.text(`Datos del Vehículo:`, 20, 100);
    doc.text(`Marca: ${car.brand}`, 20, 110);
    doc.text(`Modelo: ${car.model}`, 20, 120);
    doc.text(`Precio: ${car.price} €`, 20, 130);
    doc.text(`Matrícula: ${car.plate}`, 20, 140);
    doc.text(`Color: ${car.color}`, 20, 150);
    doc.text(`Caballos de potencia: ${car.horsePower} HP`, 20, 160);
  
    // Firma del cliente
    doc.text("Firma del Cliente:", 20, 180);
    doc.line(20, 185, 100, 185); // Línea para la firma
  
    const pdfBase64 = doc.output('datauristring').split(',')[1];
  
    try {
      // 📌 Guardamos en una ubicación predeterminada del dispositivo
      const filePath = `contrato_${car.plate}.pdf`;
      const directory = Directory.Documents;
  
      const fileUri = await Filesystem.getUri({ directory, path: filePath });
  
      console.log("📌 Ruta de guardado:", fileUri.uri);
  
      await Filesystem.writeFile({
        path: filePath,
        data: pdfBase64,
        directory: Directory.Documents,
      });
  
      console.log(`✅ Contrato guardado correctamente en: ${fileUri.uri}`);
    } catch (error) {
      console.error('❌ Error al guardar el contrato:', error);
    }
  }
  
}
