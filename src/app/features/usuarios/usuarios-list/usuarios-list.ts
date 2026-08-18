import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, EstadoCuenta, Rol } from '../../../core/models/usuario.model';
import { UsuarioFormComponent } from '../usuario-form/usuario-form';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    UsuarioFormComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
    FormsModule
  ],
  templateUrl: './usuarios-list.html',
})
export class UsuariosList implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(false);
  mostrarFormulario = signal(false);

  mostrarResetPassword = signal(false);
  usuarioParaReset = signal<Usuario | null>(null);
  nuevaPassword = '';

  EstadoCuenta = EstadoCuenta;
  Rol = Rol;

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  nuevoUsuario(): void {
    this.mostrarFormulario.set(true);
  }

  alCrear(): void {
    this.mostrarFormulario.set(false);
    this.cargar();
  }

  validar(usuario: Usuario, estado: EstadoCuenta): void {
    const accion = estado === EstadoCuenta.VALIDADO ? 'validar' : 'rechazar';

    this.confirmationService.confirm({
      message: `¿Deseas ${accion} la cuenta de ${usuario.nombre}?`,
      header: `Confirmar ${accion}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: `Sí, ${accion}`,
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usuarioService.validarCuenta(usuario.id, estado).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: `${accion}`,
              detail: `Realizado correctamente`,
            });
            this.cargar();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message ?? `No se pudo ${accion}`,
            });
          },
        });
      },
    });
  }

  desactivar(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `¿Desactivar a ${usuario.nombre} ${usuario.apellido}? Esta acción no se puede deshacer.`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.usuarioService.desactivar(usuario.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario desactivado',
              detail: `${usuario.nombre} ${usuario.apellido} fue desactivado correctamente`,
            });
            this.cargar();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message ?? 'No se pudo desactivar el usuario',
            });
          },
        });
      },
    });
  }

  severidadEstado(estado: EstadoCuenta): 'success' | 'warn' | 'danger' {
    switch (estado) {
      case EstadoCuenta.VALIDADO:
        return 'success';
      case EstadoCuenta.RECHAZADO:
        return 'danger';
      default:
        return 'warn';
    }
  }

  abrirResetPassword(usuario: Usuario): void {
    this.usuarioParaReset.set(usuario);
    this.nuevaPassword = '';
    this.mostrarResetPassword.set(true);
  }

  confirmarReset(): void {
    const usuario = this.usuarioParaReset();
    if (!usuario || this.nuevaPassword.length < 8) return;

    this.usuarioService.resetearPassword(usuario.id, this.nuevaPassword).subscribe({
      next: () => {
        this.mostrarResetPassword.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Contraseña restablecida',
          detail: `Comunica la nueva contraseña a ${usuario.nombre} por un canal seguro`,
        });
      },
    });
  }
}
