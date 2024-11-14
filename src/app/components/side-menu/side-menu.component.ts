import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent  implements OnInit {
  public appPages = [
    { title: 'Inventory', url: '/folder/Inventory', icon: 'file-tray-full' },
    { title: 'Sales history', url: '/folder/Sales', icon: 'cash' },
    { title: 'Rent history', url: '/folder/Rents', icon: 'calendar' },
    { title: 'Employees', url: '/folder/Employees', icon: 'people' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  constructor() { }

  ngOnInit() {

  }

}
