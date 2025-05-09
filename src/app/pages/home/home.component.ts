import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isAuthenticated = false;

  constructor(
    public _auth: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._auth.isAuthenticated$.subscribe(result => {
      this.isAuthenticated = result;
      if (this.isAuthenticated) {
        this._router.navigate(['/ya-registrado']);
      }
    })
  }

  logIn() {
    this._auth.loginWithRedirect();
  }

  logOut() {
    this._auth.logout()
  }
}
