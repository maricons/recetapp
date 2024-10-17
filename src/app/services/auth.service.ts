import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private auth: Auth) { }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => {
        return !!user;  // Retorna true si el usuario está autenticado, false si no lo está
      })
    );
  }

  authMode: string = 'login'; // Puedes cambiar entre login y registro
  email: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';

  async login(email: string, password: string) {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Login correcto', user);
      this.router.navigate(['/tabs/tab1']);  // Redirige al usuario a la página principal
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;  // Propaga el error para que el componente pueda manejarlo si lo desea
    }
  }

  // Método para cerrar sesión
  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);  // Redirige al usuario a la página de login
  }
}