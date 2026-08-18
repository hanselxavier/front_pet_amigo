import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { MascotaService } from '../../core/services/mascota.service';
import { Mascota } from '../../core/models/mascota.model';

@Component({
  selector: 'app-mascota-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './mascota-autocomplete.html',
})
export class MascotaAutocomplete implements OnChanges {
  private mascotaService = inject(MascotaService);

  @Input() label = 'Mascota';
  @Input() placeholder = 'Busca por nombre...';
  @Input() usuarioId: number | null = null;
  @Input() mascotaSeleccionada: Mascota | null = null;
  @Output() mascotaSeleccionadaChange = new EventEmitter<Mascota | null>();

  private todasLasMascotas: Mascota[] = [];
  sugerencias = signal<Mascota[]>([]);
  cargandoLista = false;

  ngOnChanges(): void {
    // Si cambia el usuario, la mascota que tenías seleccionada ya no aplica
    if (this.mascotaSeleccionada && this.mascotaSeleccionada.usuarioId !== this.usuarioId) {
      this.mascotaSeleccionadaChange.emit(null);
    }
  }

  private cargarSiHaceFalta(callback: () => void): void {
    if (this.todasLasMascotas.length > 0) {
      callback();
      return;
    }
    this.cargandoLista = true;
    this.mascotaService.listarTodas().subscribe({
      next: (data) => {
        this.todasLasMascotas = data;
        this.cargandoLista = false;
        callback();
      },
      error: () => (this.cargandoLista = false),
    });
  }

  buscar(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase().trim();
    this.cargarSiHaceFalta(() => {
      const resultado = this.todasLasMascotas.filter(
        (m) => m.usuarioId === this.usuarioId && m.nombre.toLowerCase().includes(query),
      );
      this.sugerencias.set(resultado);
    });
  }

  onSeleccionar(mascota: Mascota): void {
    this.mascotaSeleccionadaChange.emit(mascota);
  }

  onLimpiar(): void {
    this.mascotaSeleccionadaChange.emit(null);
  }
}