import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-already-registered',
  imports: [],
  templateUrl: './already-registered.component.html',
  styleUrl: './already-registered.component.css'
})
export class AlreadyRegisteredComponent {

  constructor(
    public _auth: AuthService,
    private _router: Router
  ) { }

  logOut() {
    this._auth.logout();
    this._router.navigate(['/home']);
  }
}
