import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/core/services/impl/car.service';
import { Car } from 'src/app/core/models/car.model';
import { FirebaseCar } from 'src/app/core/models/firebase/firebase-car.model';
import { BehaviorSubject, forkJoin, lastValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { CustomerService } from 'src/app/core/services/impl/customer.service';
import { DocumentReference, getDoc } from 'firebase/firestore';
import { Customer } from 'src/app/core/models/customer.model';
import { FirebaseCustomer } from 'src/app/core/models/firebase/firebase-customer.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.page.html',
  styleUrls: ['./sales-history.page.scss'],
})
export class SalesHistoryPage implements OnInit {
  _soldCars: BehaviorSubject<Car[]> = new BehaviorSubject<Car[]>([]);
  soldCars$: Observable<Car[]> = this._soldCars.asObservable();

  _customers: BehaviorSubject<{ [carId: string]: any }> = new BehaviorSubject<{ [carId: string]: any }>({});
  customers$: Observable<{ [carId: string]: any }> = this._customers.asObservable();

  private customerMap = new Map<string, Observable<Customer | null>>(); 

  constructor(
    private carSvc: CarService,
    private customerSvc: CustomerService
  ) {}

  ngOnInit() {
    this.loadSoldCars();
  }

  loadSoldCars() {
    console.log("📌 Iniciando búsqueda de coches vendidos...");

    this.carSvc.getAll(1, 100, {}).pipe(
      tap(response => {
        const soldCars = response.data.filter(car => car.customer && car.customer !== null);
        console.log("✅ Coches filtrados con cliente asignado:", soldCars);
        this._soldCars.next(soldCars);
      })
    ).subscribe();
  }

  getCustomerData(car: Car | FirebaseCar): Observable<Customer | null> {
    if (typeof car.customer === 'string') {
      if (!this.customerMap.has(car.customer)) { 
        console.log(`🔍 Buscando cliente en Firestore para coche ${car.plate} con ID: ${car.customer}`);
        const customerObs = this.customerSvc.getById(car.customer).pipe(
          tap(customer => {
            if (customer) {
              console.log(`✅ Cliente encontrado para ${car.plate}:`, customer);
            } else {
              console.warn(`⚠️ Cliente no encontrado para ${car.plate}`);
            }
          })
        );
        this.customerMap.set(car.customer, customerObs); 
      }
      return this.customerMap.get(car.customer)!; 
    } else {
      console.warn(`⚠️ El campo customer de ${car.plate} no es un string (ID de Firestore).`);
      return new BehaviorSubject<Customer | null>(null).asObservable();
    }
  }
  

  // 🔹 Verifica si `customer` es un DocumentReference de Firebase
  isDocumentReference(value: any): value is DocumentReference {
    return value && typeof value === 'object' && 'id' in value && 'path' in value;
  }

  async generateContract(car: Car | FirebaseCar, customer: Customer | FirebaseCustomer) {
    console.log('🔄 Generando contrato para:', car.brand, car.model);
    console.log('👤 Datos del cliente recibido:', customer);
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // 📌 Logo de la empresa
      const logoUrl = "../../../../assets/icon/favicon.png";
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

  onIonInfinite(event: any) {
    event.target.complete();
  }
  
}
