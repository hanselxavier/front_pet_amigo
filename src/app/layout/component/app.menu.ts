import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { Auth } from '../../core/services/auth';
import { Rol } from '../../core/models/usuario.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu implements OnInit {
  private auth = inject(Auth);

  model: MenuItem[] = [];

  ngOnInit() {
    const esAdmin = this.auth.usuario()?.rol === Rol.ADMIN;

    this.model = [
      {
        label: 'Principal',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/app/dashboard'] },
        ],
      },
      ...(esAdmin ? this.menuAdmin() : this.menuCliente()),
    ];
  }

  private menuAdmin(): MenuItem[] {
    return [
      {
        label: 'Administración',
        items: [
          { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/app/usuarios'] },
          { label: 'Mascotas', icon: 'pi pi-fw pi-heart', routerLink: ['/app/mascotas'] },
          { label: 'Placas (QR)', icon: 'pi pi-fw pi-qrcode', routerLink: ['/app/placas'] },
          { label: 'Solicitudes de placa', icon: 'pi pi-fw pi-inbox', routerLink: ['/app/solicitudes-placa'] },
          { label: 'Pagos', icon: 'pi pi-fw pi-dollar', routerLink: ['/app/pagos'] },
        ],
      },
      {
        label: 'Reportes',
        items: [
          { label: 'Mascotas perdidas', icon: 'pi pi-fw pi-flag', routerLink: ['/app/reportes'] },
          { label: 'Chats', icon: 'pi pi-fw pi-comments', routerLink: ['/app/chats'] },
        ],
      },
    ];
  }

  private menuCliente(): MenuItem[] {
    return [
      {
        label: 'Mis mascotas',
        items: [
          { label: 'Mis mascotas', icon: 'pi pi-fw pi-heart', routerLink: ['/app/mascotas'] },
          { label: 'Mi placa', icon: 'pi pi-fw pi-qrcode', routerLink: ['/app/placas'] },
        ],
      },
      {
        label: 'Actividad',
        items: [
          { label: 'Mis reportes', icon: 'pi pi-fw pi-flag', routerLink: ['/app/reportes'] },
          { label: 'Mis chats', icon: 'pi pi-fw pi-comments', routerLink: ['/app/chats'] },
        ],
      },
    ];
  }
}