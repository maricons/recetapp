import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewRecipeModalComponent } from '../new-recipe-modal/new-recipe-modal.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  recetas: any[] = [];
  filteredRecetas: any[] = [];
  searchTerm: string = '';

  constructor(private modalController: ModalController, private firestore: Firestore) { }
  ngOnInit() {
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

}
