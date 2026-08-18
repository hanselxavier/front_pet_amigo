import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Rol } from '../models/usuario.model';

export const roleGuard = (rolesPermitidos: Rol[]): CanActivateFn => {
  return () => {
    const authService = inject(Auth);
    const router = inject(Router);

    const usuario = authService.usuario();
    if (usuario && rolesPermitidos.includes(usuario.rol)) {
      return true;
    }

    router.navigate(['/notfound']);
    return false;
  };
};