import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inventory', url: '/folder/Inventory', icon: 'file-tray-full' },
    { title: 'Sales history', url: '/folder/Sales', icon: 'cash' },
    { title: 'Rent history', url: '/folder/Rents', icon: 'calendar' },
    { title: 'Employees', url: '/folder/Employees', icon: 'people' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  constructor() {}
}
