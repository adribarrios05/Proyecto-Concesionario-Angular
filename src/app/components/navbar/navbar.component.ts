import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavBarComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Inventory', url: '/inventory', icon: 'file-tray-full' },
    { title: 'Sales history', url: '/sales', icon: 'cash' },
    { title: 'Rent history', url: '/rents', icon: 'calendar' },
    { title: 'Customers', url: '/customers', icon: 'people' },
  ];

  showMenu: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
  //  this.router.events.subscribe(() => {
  //    this.checkRoute();
  //  });
  //  this.checkRoute(); 
  }

  //private checkRoute() {
  //  const excludedRoutes = ['/login', '/register'];
  //  this.showMenu = !excludedRoutes.includes(this.router.url);
  //} 
}
