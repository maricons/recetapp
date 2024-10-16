import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService(); // Instancia del servicio de autenticación
  const router = new Router();

  if (authService.isAuthenticated()) {
    return true; // Permite el acceso
  } else {
    router.navigate(['/login']); // Redirige a la página de inicio de sesión
    return false; // Bloquea el acceso
  }
};