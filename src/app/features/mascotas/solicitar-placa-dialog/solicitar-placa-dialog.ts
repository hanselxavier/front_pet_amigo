import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SolicitudPlacaService } from '../../../core/services/solicitud-placa.service';
import { Mascota } from '../../../core/models/mascota.model';
import { Plan } from '../../../core/models/placa.model';

@Component({
  selector: 'app-solicitar-placa-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, SelectModule, ButtonModule, MessageModule],
  templateUrl: './solicitar-placa-dialog.html',
})
export class SolicitarPlacaDialogComponent implements OnChanges {
  private solicitudService = inject(SolicitudPlacaService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() mascota: Mascota | null = null;
  @Output() solicitado = new EventEmitter<void>();

  planElegido: Plan = Plan.BASICO;
  guardando = signal(false);
  error = signal<string | null>(null);

  opcionesPlan = [
    { label: 'Básico', value: Plan.BASICO },
    { label: 'Pro', value: Plan.PRO },
  ];

  ngOnChanges(): void {
    this.planElegido = Plan.BASICO;
    this.error.set(null);
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  solicitar(): void {
    if (!this.mascota) return;

    this.guardando.set(true);
    this.error.set(null);

    // El plan elegido se manda como "notas" legible para el admin,
    // ya que el backend decide el plan real al momento de aprobar.
    this.solicitudService
      .crear({
        mascotaId: this.mascota.id,
        notas: `Plan solicitado: ${this.planElegido === Plan.PRO ? 'PRO' : 'Básico'}`,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.solicitado.emit();
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err.error?.message ?? 'No se pudo enviar la solicitud');
        },
      });
  }
}