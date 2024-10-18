import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que estás importando AuthService correctamente

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firstName: string = '';
  lastName: string = '';
  profilePictureUrl: string = '';
  selectedFile: File | null = null;

  currentUser: User | null = null;

  constructor(
    private firestore: Firestore, 
    private storage: Storage, 
    private auth: Auth, 
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Obtiene el usuario autenticado cuando la página se inicializa
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.loadUserProfile();  // Cargar el perfil del usuario autenticado
      }
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async loadUserProfile() {
    if (this.currentUser?.uid) {
      const userRef = doc(this.firestore, `users/${this.currentUser.uid}`);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.firstName = userData?.['firstName'] || '';
        this.lastName = userData?.['lastName'] || '';
        this.profilePictureUrl = userData?.['profilePictureUrl'] || ''; // Cargar la URL de la imagen
      }
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async saveProfile() {
    if (this.currentUser?.uid) {
      const uid = this.currentUser.uid;

      if (this.selectedFile) {
        this.profilePictureUrl = await this.uploadProfilePicture(this.selectedFile, uid);
      }

      await this.updateProfile(uid, this.firstName, this.lastName, this.profilePictureUrl);
    }
  }

  async uploadProfilePicture(file: File, uid: string): Promise<string> {
    const filePath = `profile-pictures/${uid}/${file.name}`;
    const fileRef = ref(this.storage, filePath);

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  }

  async updateProfile(uid: string, firstName: string, lastName: string, profilePictureUrl: string) {
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      firstName: firstName,
      lastName: lastName,
      profilePictureUrl: profilePictureUrl
    }, { merge: true });
  }

  logout() {
    this.authService.logout(); // Llama al servicio AuthService para cerrar sesión
  }
}
