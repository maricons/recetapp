import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { RecipeDetailModalComponent } from '../../components/recipe-detail-modal/recipe-detail-modal.component';
import { NewRecipeModalComponent } from '../../components/new-recipe-modal/new-recipe-modal.component';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


interface Receta {
  titulo: string;
  descripcion: string;
  imagen: string;
  ingredientes: string;
  instrucciones: string;
  minutos: number;
  autorId: string;
  id?: string;
  selected: boolean;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  recetas: Receta[] = [];
  filteredRecetas: Receta[] = [];
  searchTerm: string = '';
  seleccionando: boolean = false;
  
  // Mapa para almacenar nombres de autores
  authorNames = new Map<string, Observable<string>>();

  constructor(
    private router: Router,
    private modalController: ModalController,
    private auth: Auth,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    this.loadRecipes();
  }

  

  async loadRecipes() {
    try {
      const recipesCollection = collection(this.firestore, 'recetas');
      const querySnapshot = await getDocs(recipesCollection);

      this.recetas = querySnapshot.docs.map(doc => {
        const data = doc.data() as Receta; // Asegúrate de que el tipo es Receta
        return {
          ...data,
          id: doc.id,
          selected: false
        };
      });
      this.filteredRecetas = this.recetas;

      // Cargar nombres de autores
      this.loadAuthorNames();
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  }

  // funcion para alternar el modo de selección
  toggleSeleccionar(): void{
    this.seleccionando = !this.seleccionando
    console.log('Modo selección:', this.seleccionando); // Agrega esta línea

    // cancelar seleccion, desmarca todas las marcas
    if (!this.seleccionando){
      this.recetas.forEach(receta => receta.selected = false);
    }
  }

  toggleSelection(receta: Receta): void {
    receta.selected = !receta.selected; // Cambia el estado de la receta seleccionada
  }

  toggleRecetaSeleccionada(receta: Receta): void {
    if (this.seleccionando) { // Solo permite seleccionar si el modo de selección está activado
      receta.selected = !receta.selected; // Alterna el estado de selección
    }
  }

  // funcion para verificar si hay almenos una receta seleccionada
  hayRecetasSeleccionadas(): boolean {
    return this.recetas.some(receta => receta.selected);
  }

  async eliminarRecetasSeleccionadas(): Promise<void> {
    const recetasAEliminar = this.recetas.filter(receta => receta.selected);

    if (recetasAEliminar.length === 0) {
      console.log('No hay recetas seleccionadas para eliminar');
      return;
    }

    for (const receta of recetasAEliminar) {

      if (!receta.id) {
        console.error('La receta no tiene un ID válido: ', receta);
        continue;
      }

      try {
        const recetaRef = doc(this.firestore, 'recetas', receta.id);
        await deleteDoc(recetaRef);
        console.log(`Receta ${receta.titulo} eliminada exitosamente`);
      } catch (error) {
        console.error('Error al eliminar la receta: ', error);
      }
    }

    //actualizar listado de recetas local
    this.recetas = this.recetas.filter(receta => !receta.selected);
    this.filteredRecetas = this.filteredRecetas.filter(receta => !receta.selected);
  }

  async loadAuthorNames() {
    for (const receta of this.recetas) {
      const authorId = receta.autorId;
      if (authorId && !this.authorNames.has(authorId)) {
        const authorDocRef = doc(this.firestore, `users/${authorId}`);
        const authorDoc = await getDoc(authorDocRef);
        const authorData = authorDoc.data();
        const authorName = `${authorData?.['firstName'] || 'Desconocido'} ${authorData?.['lastName'] || ''}`;
        this.authorNames.set(authorId, new BehaviorSubject(authorName).asObservable());
      }
    }
  }

  getAuthorName(authorId: string): Observable<string> {
    return this.authorNames.get(authorId) || new BehaviorSubject('Desconocido').asObservable();
  }

  getAuthorPhotoUrl(authorId: string): string {
    // Implementa esta función si deseas cargar una foto del autor desde una URL o Firestore
    return 'ruta/a/la/foto-del-autor.jpg'; // Puedes reemplazar esto con la URL real
  }

  filterRecipes() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredRecetas = this.recetas.filter(recipe => {
      return recipe.titulo.toLowerCase().includes(searchTermLower) ||
        recipe.descripcion.toLowerCase().includes(searchTermLower);
    });
  }

  async openNewRecipeModal() {
    const modal = await this.modalController.create({
      component: NewRecipeModalComponent
    });

    await modal.present();

    // Esperar a que el modal se cierre
    await modal.onDidDismiss();

    // Recargar las recetas después de que el modal se cierre
    this.loadRecipes();
  }

  async openRecipeDetail(receta: Receta) {
    const modal = await this.modalController.create({
      component: RecipeDetailModalComponent,
      componentProps: {
        receta: receta
      }
    });
    return await modal.present();
  }

  formatTiempo(tiempo: number): string {
    if (tiempo >= 60) {
      const horas = Math.floor(tiempo / 60);
      const minutos = tiempo % 60;
      return `${horas}h ${minutos}m`;
    } else {
      return `${tiempo}m`;
    }
  }
}
