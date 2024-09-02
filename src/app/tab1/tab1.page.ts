import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { RecipeDetailModalComponent } from '../recipe-detail-modal/recipe-detail-modal.component';
import { NewRecipeModalComponent } from '../new-recipe-modal/new-recipe-modal.component';
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
          id: doc.id
        };
      });
      this.filteredRecetas = this.recetas;

      // Cargar nombres de autores
      this.loadAuthorNames();
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
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
    return await modal.present();
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
