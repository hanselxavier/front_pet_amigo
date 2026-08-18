import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { Rol } from './core/models/usuario.model';

export const routes: Routes = [
  // ============================================
  // PÚBLICO: landing del QR + chat guest (sin login)
  // ============================================
  {
    path: 'm/:codigoQr',
    loadComponent: () =>
      import('./features/public/placa-publica/placa-publica').then((c) => c.PlacaPublica),
  },
  {
    path: 'reportar-encontrado',
    loadComponent: () => import('./features/public/chat-guest/chat-guest').then((c) => c.ChatGuest),
  },
  {
    path: 'chat/:token',
    loadComponent: () => import('./features/public/chat-guest/chat-guest').then((c) => c.ChatGuest),
  },

  // ============================================
  // AUTH: login / registro (viene de Sakai)
  // ============================================
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes'),
  },

  // ============================================
  // APP: todo lo autenticado, con el layout Sakai
  // ============================================
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/component/app.layout').then((c) => c.AppLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'mascotas',
        loadComponent: () =>
          import('./features/mascotas/mascotas-list/mascotas-list').then((c) => c.MascotasList),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'placas',
        loadComponent: () =>
          import('./features/placas/placas-list/placas-list').then((c) => c.PlacasList),
      },
      {
        path: 'chats',
        loadComponent: () =>
          import('./features/chats/chats-list/chats-list').then((c) => c.ChatsList),
      },
      {
        path: 'pagos',
        canActivate: [roleGuard([Rol.ADMIN])],
        loadComponent: () =>
          import('./features/pagos/pagos-list/pagos-list').then((c) => c.PagosList),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard([Rol.ADMIN])],
        loadComponent: () =>
          import('./features/usuarios/usuarios-list/usuarios-list').then((c) => c.UsuariosList),
      },
      {
        path: 'solicitudes-placa',
        canActivate: [roleGuard([Rol.ADMIN])],
        loadComponent: () =>
          import('./features/placas/solicitudes-pendientes/solicitudes-pendientes').then(
            (c) => c.SolicitudesPendientesComponent,
          ),
      },
      {
        path: 'mi-perfil',
        loadComponent: () =>
          import('./features/perfil/mi-perfil/mi-perfil').then((c) => c.MiPerfil),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./features/reportes/reportes-list/reportes-list').then((c) => c.ReportesList),
      },
    ],
  },

  // ============================================
  // Redirects y 404
  // ============================================
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'notfound',
    loadComponent: () => import('./pages/notfound/notfound').then((c) => c.Notfound),
  },

  { path: '**', redirectTo: '/notfound' },
];
