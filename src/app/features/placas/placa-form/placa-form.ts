import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PlacaService } from '../../../core/services/placa.service';
import { Plan } from '../../../core/models/placa.model';
import { UsuarioAutocomplete } from '../../../shared/usuario-autocomplete/usuario-autocomplete';
import { Usuario } from '../../../core/models/usuario.model';
import { MascotaAutocomplete } from '../../../shared/mascota-autocomplete/mascota-autocomplete';
import { Mascota } from '../../../core/models/mascota.model';

@Component({
  selector: 'app-placa-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputNumberModule, SelectModule, ButtonModule, MessageModule, UsuarioAutocomplete, MascotaAutocomplete],
  templateUrl: './placa-form.html',
})
export class PlacaFormComponent {
  private placaService = inject(PlacaService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() generado = new EventEmitter<void>();

  guardando = signal(false);
  error = signal<string | null>(null);

  usuarioSeleccionado: Usuario | null = null;
  mascotaSeleccionada: Mascota | null = null;

  usuarioId: number | null = null;
  mascotaId: number | null = null;
  plan: Plan = Plan.BASICO;

  opcionesPlan = [
    { label: 'Básico', value: Plan.BASICO },
    { label: 'Pro', value: Plan.PRO },
  ];

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.usuarioId = null;
    this.mascotaId = null;
    this.plan = Plan.BASICO;
    this.usuarioSeleccionado = null;
    this.mascotaSeleccionada = null;
    this.error.set(null);
  }

  generar(): void {
    if (!this.usuarioId) {
      this.error.set('El ID del usuario es obligatorio');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.placaService
      .generar({
        usuarioId: this.usuarioId,
        mascotaId: this.mascotaId ?? undefined,
        plan: this.plan,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.generado.emit();
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err.error?.message ?? 'No se pudo generar la placa');
        },
      });
  }

  alSeleccionarUsuario(usuario: Usuario | null): void {
    this.usuarioSeleccionado = usuario;
    this.usuarioId = usuario?.id ?? null;

    this.mascotaSeleccionada = null;
    this.mascotaId = null;
  }

  alSeleccionarMascota(mascota: Mascota | null): void {
    this.mascotaSeleccionada = mascota;
    this.mascotaId = mascota?.id ?? null;
  }
}