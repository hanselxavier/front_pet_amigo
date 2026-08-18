import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './usuario-autocomplete.html',
})
export class UsuarioAutocomplete {
  private usuarioService = inject(UsuarioService);

  @Input() label = 'Usuario';
  @Input() placeholder = 'Busca por nombre o email...';
  @Input() usuarioSeleccionado: Usuario | null = null;
  @Output() usuarioSeleccionadoChange = new EventEmitter<Usuario | null>();

  private todosLosUsuarios: Usuario[] = [];
  sugerencias = signal<Usuario[]>([]);
  cargandoLista = false;

  private asegurarListaCargada(): void {
    if (this.todosLosUsuarios.length > 0 || this.cargandoLista) return;
    this.cargandoLista = true;
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.todosLosUsuarios = data;
        this.cargandoLista = false;
      },
      error: () => (this.cargandoLista = false),
    });
  }

  buscar(event: AutoCompleteCompleteEvent): void {
    this.asegurarListaCargada();
    const query = event.query.toLowerCase().trim();

    // Si la lista aún no cargó (primera vez), reintenta el filtro cuando llegue
    const filtrar = () => {
      const resultado = this.todosLosUsuarios.filter((u) =>
        `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(query),
      );
      this.sugerencias.set(resultado);
    };

    if (this.todosLosUsuarios.length === 0 && this.cargandoLista) {
      this.usuarioService.listar().subscribe({
        next: (data) => {
          this.todosLosUsuarios = data;
          this.cargandoLista = false;
          filtrar();
        },
      });
    } else {
      filtrar();
    }
  }

  onSeleccionar(usuario: Usuario): void {
    this.usuarioSeleccionadoChange.emit(usuario);
  }

  onLimpiar(): void {
    this.usuarioSeleccionadoChange.emit(null);
  }
}