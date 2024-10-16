import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private router: Router;

  private authenticated = false;

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {

    console.log("login 1");

    return this.authenticated;
  }

  // Método para iniciar sesión
  login() {
    this.authenticated = true;
    this.router.navigateByUrl('../tabs/tab1'); // Redirige al usuario a la página principal
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false;
  }
}