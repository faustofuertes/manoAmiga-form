import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-succesful-registered',
  imports: [],
  templateUrl: './succesful-registered.component.html',
  styleUrl: './succesful-registered.component.css'
})
export class SuccesfulRegisteredComponent {

  constructor(
    public _auth: AuthService,
    private _router: Router
  ) { }

  logOut() {
    // Cerrar sesión en Auth0
    this._auth.logout();

    // Redirigir manualmente después de cerrar sesión
    window.location.href = window.location.origin; // O la URL que quieras redirigir
  }
}
