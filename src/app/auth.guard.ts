import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service'; // Asegúrate de que AuthService esté en la ubicación correcta
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el AuthService
  const router = inject(Router);           // Inyecta el Router

  // Verifica si el usuario está autenticado
  return authService.isAuthenticated().pipe(
    map((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        return true; // Si está autenticado, permite el acceso a la ruta
      } else {
        router.navigate(['/login']); // Redirige al login si no está autenticado
        return false; // Bloquea el acceso si no está autenticado
      }
    })
  );
};