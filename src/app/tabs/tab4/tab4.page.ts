import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Firestore, collection, getDocs, query, where, doc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { RecipeDetailModalComponent } from '../../components/recipe-detail-modal/recipe-detail-modal.component';
import { NewRecipeModalComponent } from '../../components/new-recipe-modal/new-recipe-modal.component';
import { Auth, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

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
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {

  recetas: Receta[] = [];
  filteredRecetas: Receta[] = [];
  searchTerm: string = '';
  seleccionando: boolean = false;
  userId: string = ''; // Almacena el ID del usuario logueado

  // Mapa para almacenar nombres de autores
  authorNames = new Map<string, Observable<string>>();

  constructor(
    private router: Router,
    private modalController: ModalController,
    private auth: Auth,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid; // Obtener el ID del usuario logueado
        this.loadUserRecipes(); // Cargar solo las recetas del usuario
      } else {
        // Manejar el caso donde no haya un usuario logueado
        this.router.navigate(['/login']);
      }
    });
  }

  async loadUserRecipes() {
    try {
      const recipesCollection = collection(this.firestore, 'recetas');
      const q = query(recipesCollection, where('autorId', '==', this.userId)); // Filtrar por usuario logueado
      const querySnapshot = await getDocs(q);

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
      console.error('Error loading user recipes:', error);
    }
  }

  toggleSeleccionar(): void {
    this.seleccionando = !this.seleccionando;
    if (!this.seleccionando) {
      this.recetas.forEach(receta => receta.selected = false);
    }
  }

  toggleSelection(receta: Receta): void {
    receta.selected = !receta.selected;
  }

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

    // Actualizar el listado de recetas local
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
    this.loadUserRecipes(); // Recargar solo las recetas del usuario
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
