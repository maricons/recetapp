import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-recipe-detail-modal',
  templateUrl: './recipe-detail-modal.component.html',
  styleUrls: ['./recipe-detail-modal.component.scss'],
})
export class RecipeDetailModalComponent {
  @Input() receta: any;
  authorName: string = 'Cargando...'; // Variable para almacenar el nombre del autor

  constructor(
    private modalController: ModalController,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    this.loadAuthorName();
  }

  async loadAuthorName() {

    console.log(this.receta.autorId);
    if (this.receta && this.receta.autorId) {

      const userRef = doc(this.firestore, `users/${this.receta.autorId}`);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.authorName = `${userData?.['firstName']} ${userData?.['lastName']}`;
        console.log(this.authorName);
      } else {
        this.authorName = 'Autor desconocido';
      }
    } else {
      this.authorName = 'Autor desconocido';
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}