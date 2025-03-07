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
  showFilters: boolean = false;

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
        if (user) {
          console.log("✅ Usuario logueado:", user);
          this.isLoggedIn = true;
        } else {
          console.log("🚨 No hay usuario logueado.");
          this.isLoggedIn = false;
        }
      },
      error: (e) => {
        console.log("❌ Error al obtener usuario:", e);
        this.isLoggedIn = false;
      },
    });


    this.loadCars()
    this.applyFilters()
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

  loadCars(filters: SearchParams = { }){
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
    const filters: any = { customer: null };

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
          this.applyFilters()
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
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-cancel-btn', 
          handler: () => {
            console.log('Compra cancelada');
          },
        },
        {
          text: 'Sí',
          cssClass: 'alert-confirm-btn',
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
                this.generateContract(updatedCar, customer);
                this.loadCars()
                this.applyFilters()
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
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-cancel-btn',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Sí',
          cssClass: 'alert-confirm-btn',
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
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al eliminar el coche:', err);
      },
    });
  }

  async generateContract(car: Car | FirebaseCar, customer: Customer | FirebaseCustomer) {

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 📌 Logo de la empresa
    const logoUrl = "../../../../assets/icon/favicon.png"; // 🔹 Cambia por la URL de tu logo
    const logoWidth = 40;
    const logoHeight = 40;
    doc.addImage(logoUrl, "PNG", pageWidth - 60, 10, logoWidth, logoHeight);

    // 📌 Encabezado del contrato
    doc.setFontSize(18);
    doc.text("CONTRATO DE COMPRA DE VEHÍCULO", 20, 30);
    doc.setFontSize(12);
    doc.text("Concesionarios BaCa S.A.", 20, 40);
    doc.text("Dirección: Calle Frederic Therman 3, Campanillas, Málaga", 20, 50);
    doc.text("Teléfono: +34 900 123 456 | Email: contacto@concesionariosbaca.com", 20, 60);
    doc.line(20, 65, pageWidth - 20, 65);

    // 📌 Datos del Cliente
    doc.setFontSize(14);
    doc.text("Datos del Cliente:", 20, 75);
    doc.setFontSize(12);
    doc.text(`Nombre: ${customer.name} ${customer.surname}`, 20, 85);
    doc.text(`DNI: ${customer.dni}`, 20, 95);
    doc.text(`Teléfono: ${customer.phone}`, 20, 105);
    doc.line(20, 120, pageWidth - 20, 120);

    // 📌 Datos del Vehículo
    doc.setFontSize(14);
    doc.text("Datos del Vehículo:", 20, 130);
    doc.setFontSize(12);
    doc.text(`Marca: ${car.brand}`, 20, 140);
    doc.text(`Modelo: ${car.model}`, 20, 150);
    doc.text(`Matrícula: ${car.plate}`, 20, 160);
    doc.text(`Precio: ${car.price} €`, 20, 170);
    doc.text(`Color: ${car.color}`, 20, 180);
    doc.text(`Caballos de potencia: ${car.horsePower} HP`, 20, 190);
    doc.line(20, 195, pageWidth - 20, 195);

    // 📌 Términos y Condiciones
    doc.setFontSize(14);
    doc.text("Términos y Condiciones:", 20, 205);
    doc.setFontSize(10);
    const termsText = `Este contrato de compra establece los términos y condiciones bajo los cuales el cliente 
    adquiere el vehículo mencionado anteriormente. El vehículo cuenta con una garantía de 2 años cubriendo 
    defectos de fabricación. La empresa no se hace responsable de daños por uso indebido.`;
    doc.text(termsText, 20, 215, { maxWidth: pageWidth - 40, align: "justify" });

    doc.setFontSize(10);
    const extraConditions = `El cliente acepta las condiciones de compra, incluyendo el pago completo antes de la 
    entrega del vehículo y la obligación de cumplir con los requisitos legales para su uso en la vía pública.`;
    doc.text(extraConditions, 20, 230, { maxWidth: pageWidth - 40, align: "justify" });

    doc.line(20, 245, pageWidth - 20, 245);

    // 📌 Firma del Cliente y Empresa
    doc.setFontSize(12);
    doc.text("Firma del Cliente:", 20, 255);
    doc.line(20, 260, 100, 260);

    doc.text("Firma de la Empresa:", pageWidth - 80, 255);
    doc.line(pageWidth - 80, 260, pageWidth - 20, 260);

    // 📌 Descargar PDF
    const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `contrato_${car.plate}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log(`✅ Contrato generado y listo para descargar.`);
}

toggleFilters() {
  this.showFilters = !this.showFilters;
}
}
