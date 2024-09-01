import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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
}