import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authMode: string = 'login';
  email: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor(private firestore: Firestore, private auth: Auth, private router: Router) { }

  ngOnInit() {
    // Aquí puedes verificar si el usuario ya está autenticado, etc.
  }

  async login() {
    try {
      const user = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Login correcto', user);
      this.router.navigateByUrl('/tabs/tab1'); // Redirige al usuario a la página principal
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Email o contraseña incorrectos');
    }
  }

  async register(email: string, password: string, firstname: string, lastname: string) {

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }
  
    if (!password || password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
  
    if (!firstname) {
      alert('Por favor, ingresa tu nombre.');
      return;
    }
  
    if (!lastname) {
      alert('Por favor, ingresa tu apellido.');
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      firstName: firstname,
      lastName: lastname,
      profilePictureUrl: '' // Puedes actualizar esto después de que el usuario suba una foto
    });

    this.router.navigateByUrl('/tabs/tab1');
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log('Sesión cerrada');
      this.router.navigateByUrl('/login'); // Redirige al usuario a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
    }
  }

  async recoverPassword() {
    if (!this.email) {
      alert('Por favor, ingresa tu correo electrónico.');
      return;
    }
  
    try {
      await sendPasswordResetEmail(this.auth, this.email);
      alert('Se ha enviado un correo electrónico para recuperar tu contraseña.');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      alert('Error al enviar el correo de recuperación. Por favor, verifica tu dirección de correo electrónico.');
    }
  }
}