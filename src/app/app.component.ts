import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProfilePopoverComponent } from './components/profile-popover/profile-popover.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  showNavbar: boolean = true;
  isLoggedIn: boolean = false; 
  profileImageUrl: string = ''; 
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Inventory', url: '/inventory', icon: 'file-tray-full' },
    { title: 'Sales history', url: '/sales', icon: 'cash' },
    { title: 'Rent history', url: '/rents', icon: 'calendar' },
    { title: 'Customers', url: '/customers', icon: 'people' },
  ];
  
  constructor(
    private router: Router,
    private reute: ActivatedRoute,
    private popoverController: PopoverController
  ) {}

  ngOnInit(){
    this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      const currentRoute = this.router.url;
      if (currentRoute.includes('/login') || currentRoute.includes('/register')) {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    }
  });
  }

  async presentPopover(event: Event) {
    console.log("Llamada al popover")
    const popover = await this.popoverController.create({
      component: ProfilePopoverComponent,
      event: event,
      translucent: true
    });
    return await popover.present()
  }
}
