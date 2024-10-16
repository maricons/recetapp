import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Método para iniciar sesión
  login() {
    this.authenticated = true;
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false;
  }
}