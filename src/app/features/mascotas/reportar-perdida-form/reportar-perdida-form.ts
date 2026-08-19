import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ReportePerdidaService } from '../../../core/services/reporte-perdida.service';
import { Mascota } from '../../../core/models/mascota.model';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-reportar-perdida-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    CheckboxModule
  ],
  templateUrl: './reportar-perdida-form.html',
})
export class ReportarPerdidaFormComponent implements OnChanges {
  private reporteService = inject(ReportePerdidaService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() mascota: Mascota | null = null;
  @Output() reportado = new EventEmitter<void>();

  guardando = signal(false);
  error = signal<string | null>(null);

  telefonoContacto = '';
  descripcion = '';

  telefonoPublico = false;

  ngOnChanges(): void {
    this.telefonoContacto = '';
    this.descripcion = '';
    this.telefonoPublico = false;
    this.error.set(null);
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  reportar(): void {
    if (!this.mascota) return;

    if (!this.telefonoContacto) {
      this.error.set('El teléfono de contacto es obligatorio');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.reporteService
      .crear({
        mascotaId: this.mascota.id,
        telefonoContacto: this.telefonoContacto,
        descripcion: this.descripcion || undefined,
        telefonoPublico: this.telefonoPublico,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.reportado.emit();
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(
            err.error?.message ?? 'No se pudo crear el reporte',
          );
        },
      });
  }
}