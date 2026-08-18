import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuModule } from 'primeng/menu';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, MenuModule, AppConfigurator],
  template: ` <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action"
        (click)="layoutService.onMenuToggle()"
      >
        <i class="pi pi-bars"></i>
      </button>
      <a class="layout-topbar-logo" routerLink="/app/dashboard" style="display: flex; align-items: center; gap: 8px;">
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="2" width="24" height="24" rx="7" stroke="#A8791A" stroke-width="2" fill="#1F6D4C"/>
    <circle cx="8" cy="8" r="1.3" fill="#A8791A"/>
    <circle cx="20" cy="20" r="1.3" fill="#A8791A"/>
    <path d="M14 9c-2.5 0-4.5 2-4.5 4.5S11.5 18 14 18s4.5-2 4.5-4.5S16.5 9 14 9z" stroke="#F2F4F3" stroke-width="1.4" fill="none"/>
  </svg>
  <span style="font-family: 'Fraunces', serif; font-weight: 600;">Control Mascotas</span>
</a>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
          <i
            [ngClass]="{
              'pi ': true,
              'pi-moon': layoutService.isDarkTheme(),
              'pi-sun': !layoutService.isDarkTheme(),
            }"
          ></i>
        </button>
        <div class="relative">
          <button
            class="layout-topbar-action layout-topbar-action-highlight"
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="animate-scalein"
            leaveToClass="hidden"
            leaveActiveClass="animate-fadeout"
            [hideOnOutsideClick]="true"
          >
            <i class="pi pi-palette"></i>
          </button>
          <app-configurator />
        </div>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        pStyleClass="@next"
        enterFromClass="hidden"
        enterActiveClass="animate-scalein"
        leaveToClass="hidden"
        leaveActiveClass="animate-fadeout"
        [hideOnOutsideClick]="true"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action" (click)="menuPerfil.toggle($event)">
            <i class="pi pi-user"></i>
            <span>{{ auth.usuario()?.nombre }}</span>
          </button>
          <p-menu #menuPerfil [model]="itemsPerfil" [popup]="true" />
        </div>
      </div>
    </div>
  </div>`,
})
export class AppTopbar {
  auth = inject(Auth);
  private router = inject(Router);

  itemsPerfil: MenuItem[] = [
    {
      label: 'Mi perfil',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/app/mi-perfil']),
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.cerrarSesion(),
    },
  ];

  constructor(public layoutService: LayoutService) {}

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }

  cerrarSesion() {
    this.auth.logout();
  }
}
