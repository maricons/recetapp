import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewRecipeModalComponent } from '../new-recipe-modal/new-recipe-modal.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { RecipeDetailModalComponent } from '../recipe-detail-modal/recipe-detail-modal.component';
import { Auth, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

interface Receta {
  titulo: string;
  descripcion: string;
  imagen: string;
  ingredientes: string;
  instructiones: string;
  minutos: number;
}


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  recetas: any[] = [];
  filteredRecetas: any[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private modalController: ModalController, private auth: Auth, private firestore: Firestore) { }
  ngOnInit() {

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User is logged in:', user);
      } else {
        console.log('User is not logged in');
        this.router.navigateByUrl('/login');
      }
    });

    const recipesCollection = collection(this.firestore, 'recetas');
    collectionData(recipesCollection, { idField: 'id' }).subscribe(data => {
      this.recetas = data;
      this.filteredRecetas = data;  // Inicialmente, muestra todas las recetas
    });
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
