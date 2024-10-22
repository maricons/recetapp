import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { CategoryService } from 'src/app/services/category.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-new-recipe-modal',
  templateUrl: './new-recipe-modal.component.html',
  styleUrls: ['./new-recipe-modal.component.scss'],
})


export class NewRecipeModalComponent implements OnInit {

  selectedImage: string | null | undefined = null;
  customOptions: any;

  recipe = {
    titulo: '',
    descripcion: '',
    ingredientes: '',
    instrucciones: '',
    minutos: '',
    imagenUrl: '',
    categoria: ''
  };

  categorias: string[] = [];

  selectedFile: File | null = null;
  currentUser: any;

  constructor(
    private modalController: ModalController,
    private firestore: Firestore,
    private auth: Auth,  // Agregado para manejar la autenticación
    private categoryService: CategoryService
  ) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  ngOnInit() {
    this.getCategories();

    this.customOptions = {
      header: 'Selecciona una Categoría',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Seleccionado Cancelar');
          }
        },
        {
          text: 'Seleccionar',
          handler: (value: string) => {
            console.log('Categoría seleccionada:', value);
          }
        }
      ]
    };
  }

  // Función para enumerar instrucciones
  procesarInstrucciones(): void{
    if (this.recipe.instrucciones){
      let lineas = this.recipe.instrucciones.split('\n');

      let lineasNumeradas = lineas.map((linea, index) => {
        if (linea.trim() !== '') {
          return `${index + 1}. ${linea.trim()}`;
        }
        return '';
      });

      this.recipe.instrucciones = lineasNumeradas.filter(Boolean).join('\n');

    }
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categorias: string[]) => {
      this.categorias = categorias;
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async selectImage() {

    console.log("seleccionando foto...");

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt // Esto muestra opciones para cámara o galería
    });

    this.selectedImage = image.dataUrl;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async uploadImage(file: File): Promise<string> {
    const storage = getStorage();
    const uniqueFileName = `${this.currentUser.uid}-${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `recipe-images/${uniqueFileName}`);

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

        this.procesarInstrucciones();

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
          categoria: this.recipe.categoria,
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