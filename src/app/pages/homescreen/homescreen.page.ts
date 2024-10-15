import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.page.html',
  styleUrls: ['./homescreen.page.scss'],
})
export class HomescreenPage implements OnInit {
  showButton = false;
  isAnimating = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Después de 3 segundos, mostrar el botón
    setTimeout(() => {
      this.showButton = true;
    }, 3000); // Ajusta el tiempo de la animación si es necesario
  }

  animateButton() {
    this.isAnimating = true;

    // Redirigir a la página principal después de la animación
    setTimeout(() => {
      this.isAnimating = false;
      this.goToMainPage(); // Redirige a la página principal después de la animación
    }, 3000); // Duración de la animación en milisegundos (ajusta según sea necesario)
  }

  goToMainPage() {
    this.router.navigateByUrl('/login'); // Ajusta la ruta de la página principal
  }
}
