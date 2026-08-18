import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PlacaService } from '../../../core/services/placa.service';
import { MascotaAutocomplete } from '../../../shared/mascota-autocomplete/mascota-autocomplete';
import { Placa } from '../../../core/models/placa.model';
import { Mascota } from '../../../core/models/mascota.model';

@Component({
  selector: 'app-asignar-mascota-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, MessageModule, MascotaAutocomplete],
  templateUrl: './asignar-mascota-dialog.html',
})
export class AsignarMascotaDialogComponent implements OnChanges {
  private placaService = inject(PlacaService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() placa: Placa | null = null;
  @Output() asignado = new EventEmitter<void>();

  mascotaSeleccionada: Mascota | null = null;
  guardando = signal(false);
  error = signal<string | null>(null);

  ngOnChanges(): void {
    this.mascotaSeleccionada = null;
    this.error.set(null);
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  asignar(): void {
    if (!this.placa || !this.mascotaSeleccionada) {
      this.error.set('Selecciona una mascota');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.placaService.reasignar(this.placa.id, this.mascotaSeleccionada.id).subscribe({
      next: () => {
        this.guardando.set(false);
        this.asignado.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo asignar la mascota');
      },
    });
  }
}