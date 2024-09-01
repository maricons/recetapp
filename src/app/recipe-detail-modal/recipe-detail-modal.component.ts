import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-detail-modal',
  templateUrl: './recipe-detail-modal.component.html',
  styleUrls: ['./recipe-detail-modal.component.scss'],
})
export class RecipeDetailModalComponent {
  @Input() receta: any;

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }
}