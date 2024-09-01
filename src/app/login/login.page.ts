import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authMode: string = 'login';
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {
    // Aquí puedes verificar si el usuario ya está autenticado, etc.
  }

  async login() {
    try {
      const user = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Login successful', user);
      this.router.navigateByUrl('/tabs/tab1'); // Redirige al usuario a la página principal
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Email o contraseña incorrectos');
    }
  }

  async register() {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Registration successful', user);
      this.router.navigateByUrl('/tabs/tab1'); // Redirige al usuario a la página principal después de registrarse
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Error al crear la cuenta. Por favor, intenta nuevamente.');
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log('Logout successful');
      this.router.navigateByUrl('/login'); // Redirige al usuario a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
    }
  }
}