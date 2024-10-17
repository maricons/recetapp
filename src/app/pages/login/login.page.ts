import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from '../../services/alert.service';  // Importa el servicio de alertas

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  authMode: string = 'login'; // Puedes cambiar entre login y registro
  email: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor(private firestore: Firestore, private auth: Auth, private router: Router, private authService: AuthService, private alertService: AlertService) { }

  ngOnInit() {
  }

  // Método para iniciar sesión

  async login() {  // Asegúrate de marcar el método como async
    try {
      await this.authService.login(this.email, this.password);  // Llama al método login del AuthService
    } catch (error) {
      this.alertService.presentAlert('Error', 'Email o contraseña incorrectos.');
    }
  }

  // Método para registrar un nuevo usuario
  async register() {
    if (!this.isValidEmail(this.email) || !this.password || this.password.length < 6 || !this.firstname || !this.lastname) {
      this.alertService.presentAlert('Error', 'Llena todos los campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        firstName: this.firstname,
        lastName: this.lastname,
        profilePictureUrl: '' // Puedes actualizar esto después de que el usuario suba una foto
      });

      this.router.navigateByUrl('/tabs/tab1'); // Redirige a la página principal tras el registro
    } catch (error) {
      console.error('Error en el registro:', error);
      this.alertService.presentAlert('Error', 'Error al registrar el usuario. Inténtalo de nuevo.');
    }
  }

  // Método para enviar correo de recuperación de contraseña
  async recoverPassword() {
    if (!this.email) {
      this.alertService.presentAlert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.alertService.presentAlert('Recuperación', 'Se ha enviado un correo electrónico para recuperar tu contraseña.');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      this.alertService.presentAlert('Error', 'No encontramos ninguna cuenta con ese correo.');
    }
  }

  // Método auxiliar para validar el formato del email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}