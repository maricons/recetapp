import { Component, OnInit } from '@angular/core';
import { CategoriaService } from 'src/app/services/category.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  categorias: any[] = []; // Asegúrate de que el tipo sea el adecuado según tu JSON

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data.categorias; // Asegúrate de que esto coincida con la estructura del JSON
      console.log(this.categorias); // Aquí puedes trabajar con los datos
    }, error => {
      console.error('Error al obtener las categorías:', error);
    });
  }
}