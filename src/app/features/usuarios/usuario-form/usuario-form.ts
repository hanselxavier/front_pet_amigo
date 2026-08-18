import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, PasswordModule, SelectModule, ButtonModule, MessageModule],
  templateUrl: './usuario-form.html',
})
export class UsuarioFormComponent {
  private usuarioService = inject(UsuarioService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() creado = new EventEmitter<void>();

  guardando = signal(false);
  error = signal<string | null>(null);

  form = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    rol: Rol.CLIENTE,
  };

  opcionesRol = [
    { label: 'Cliente', value: Rol.CLIENTE },
    { label: 'Admin', value: Rol.ADMIN },
  ];

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form = { nombre: '', apellido: '', email: '', password: '', telefono: '', rol: Rol.CLIENTE };
    this.error.set(null);
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.apellido || !this.form.email || !this.form.password) {
      this.error.set('Completa todos los campos obligatorios');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.usuarioService.crearPorAdmin(this.form).subscribe({
      next: () => {
        this.guardando.set(false);
        this.creado.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo crear el usuario');
      },
    });
  }
}