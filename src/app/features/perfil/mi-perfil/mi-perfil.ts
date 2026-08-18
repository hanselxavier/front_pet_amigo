import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Auth } from '../../../core/services/auth';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './mi-perfil.html',
})
export class MiPerfil implements OnInit {
  private auth = inject(Auth);
  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);

  guardando = signal(false);
  subiendoFoto = signal(false);
  fotoPerfil = signal<string | null>(null);
  usuarioId = signal<number | null>(null);

  form = {
    nombre: '',
    apellido: '',
    telefono: '',
  };

  ngOnInit(): void {
    const usuario = this.auth.usuario();
    if (usuario) {
      this.usuarioId.set(usuario.id);
      this.usuarioService.obtenerPorId(usuario.id).subscribe((data) => {
        this.form = {
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono ?? '',
        };
        this.fotoPerfil.set(data.fotoPerfil ?? null);
      });
    }
  }

  get iniciales(): string {
    return (this.form.nombre[0] ?? '') + (this.form.apellido[0] ?? '');
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    const id = this.usuarioId();
    if (!archivo || !id) return;

    this.subiendoFoto.set(true);
    this.usuarioService.subirFotoPerfil(id, archivo).subscribe({
      next: (data) => {
        this.subiendoFoto.set(false);
        this.fotoPerfil.set(data.fotoPerfil ?? null);
        this.messageService.add({
          severity: 'success',
          summary: 'Foto actualizada',
          detail: 'Tu foto de perfil se guardó correctamente',
        });
        input.value = '';
      },
      error: (err) => {
        this.subiendoFoto.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message ?? 'No se pudo subir la foto',
        });
      },
    });
  }

  guardar(): void {
    const id = this.usuarioId();
    if (!id) return;

    this.guardando.set(true);

    this.usuarioService.actualizarPerfil(id, this.form).subscribe({
      next: () => {
        this.guardando.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil actualizado',
          detail: 'Tus datos se guardaron correctamente',
        });
      },
      error: (err) => {
        this.guardando.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message ?? 'No se pudo actualizar el perfil',
        });
      },
    });
  }
}