import { Component, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';


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

  constructor(private firestore: Firestore, private storage: Storage, private auth: Auth, private router: Router) { }

  ngOnInit() {
    /*onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        console.log('User is logged in:', user);
        this.loadUserProfile(); // Carga el perfil solo si el usuario está autenticado
      } else {
        this.currentUser = null;
        console.log('User is not logged in');
        this.router.navigateByUrl('/login');
        // Aquí podrías redirigir al usuario a la página de login si no está autenticado
      }
    });*/
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
        this.profilePictureUrl = userData?.['profilePictureUrl'] || '';
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

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigateByUrl('/login');  // Redirige al usuario a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}