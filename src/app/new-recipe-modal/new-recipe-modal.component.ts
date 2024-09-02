import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-new-recipe-modal',
  templateUrl: './new-recipe-modal.component.html',
  styleUrls: ['./new-recipe-modal.component.scss'],
})
export class NewRecipeModalComponent {
  recipe = {
    titulo: '',
    descripcion: '',
    ingredientes: '',
    instrucciones: '',
    minutos: '',
    imagenUrl: ''
  };

  selectedFile: File | null = null;
  currentUser: any;

  constructor(
    private modalController: ModalController,
    private firestore: Firestore,
    private auth: Auth  // Agregado para manejar la autenticación
  ) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async uploadImage(file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `recipe-images/${file.name}`);

    // Subir la imagen a Firebase Storage
    await uploadBytes(storageRef, file);

    // Obtener la URL de descarga de la imagen subida
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  }

  async saveRecipe() {
    console.log('Save Recipe button clicked');

    if (this.selectedFile && this.currentUser) {
      try {
        console.log('Selected file:', this.selectedFile);

        this.recipe.imagenUrl = await this.uploadImage(this.selectedFile);
        console.log('Image uploaded successfully:', this.recipe.imagenUrl);

        // Obtener la información del usuario actual
        const userRef = doc(this.firestore, `users/${this.currentUser.uid}`);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        // Acceder a las propiedades usando la notación de corchetes
        const authorName = `${userData?.['firstName']} ${userData?.['lastName']}`;

        // Guardar la receta con la información del autor
        const recipesCollection = collection(this.firestore, 'recetas');
        await addDoc(recipesCollection, {
          titulo: this.recipe.titulo,
          descripcion: this.recipe.descripcion,
          ingredientes: this.recipe.ingredientes,
          instrucciones: this.recipe.instrucciones,
          minutos: Number(this.recipe.minutos),
          imagen: this.recipe.imagenUrl,
          autorId: this.currentUser.uid,  // UID del autor para futuras referencias
        });
        console.log('Receta agregada exitosamente');

        this.dismiss();  // Cierra el modal después de guardar la receta
      } catch (error) {
        console.error('Error al agregar receta:', error);
      }
    } else {
      console.error('No se seleccionó ninguna imagen o no se ha autenticado el usuario');
    }
  }
}