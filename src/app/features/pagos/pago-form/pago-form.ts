import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PagoService } from '../../../core/services/pago.service';
import { MetodoPago } from '../../../core/models/pago.model';
import { UsuarioAutocomplete } from '../../../shared/usuario-autocomplete/usuario-autocomplete';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
    UsuarioAutocomplete,
  ],
  templateUrl: './pago-form.html',
})
export class PagoFormComponent {
  private pagoService = inject(PagoService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() registrado = new EventEmitter<void>();

  guardando = signal(false);
  error = signal<string | null>(null);

  usuarioSeleccionado: Usuario | null = null;

  form = {
    concepto: '',
    monto: null as number | null,
    metodoPago: MetodoPago.EFECTIVO,
    notas: '',
  };

  opcionesMetodo = [
    { label: 'Efectivo', value: MetodoPago.EFECTIVO },
    { label: 'Transferencia', value: MetodoPago.TRANSFERENCIA },
    { label: 'Tarjeta', value: MetodoPago.TARJETA },
    { label: 'Otro', value: MetodoPago.OTRO },
  ];

  alSeleccionarUsuario(usuario: Usuario | null): void {
    this.usuarioSeleccionado = usuario;
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.usuarioSeleccionado = null;
    this.form = { concepto: '', monto: null, metodoPago: MetodoPago.EFECTIVO, notas: '' };
    this.error.set(null);
  }

  guardar(): void {
    if (!this.usuarioSeleccionado || !this.form.concepto || !this.form.monto) {
      this.error.set('Completa usuario, concepto y monto');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.pagoService
      .registrar({
        usuarioId: this.usuarioSeleccionado.id,
        concepto: this.form.concepto,
        monto: this.form.monto,
        metodoPago: this.form.metodoPago,
        notas: this.form.notas || undefined,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.registrado.emit();
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err.error?.message ?? 'No se pudo registrar el pago');
        },
      });
  }
}