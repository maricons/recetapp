import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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
    instructiones: '',
    imagenUrl: ''
  };

  selectedFile: File | null = null;

  constructor(private modalController: ModalController, private firestore: Firestore) { }

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

    if (this.selectedFile) {
      try {
        console.log('Selected file:', this.selectedFile);

        this.recipe.imagenUrl = await this.uploadImage(this.selectedFile);
        console.log('Image uploaded successfully:', this.recipe.imagenUrl);

        const recipesCollection = collection(this.firestore, 'recetas');
        await addDoc(recipesCollection, {
          titulo: this.recipe.titulo,
          descripcion: this.recipe.descripcion,
          ingredientes: this.recipe.ingredientes,
          instrucciones: this.recipe.instructiones,
          imagen: this.recipe.imagenUrl
        });
        console.log('Receta agregada exitosamente');

        // this.dismiss(); // Comentar temporalmente para pruebas
      } catch (error) {
        console.error('Error al agregar receta:', error);
      }
    } else {
      console.error('No se seleccionó ninguna imagen');
    }
  }
}