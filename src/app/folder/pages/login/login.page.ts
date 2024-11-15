import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email: string = ''
  password: string = ''
  isLoginPage: boolean = false;

  constructor(private router: Router) { }

  login() {
      this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.isLoginPage = this.router.url === '/login';
  }

}
