import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota, Especie, Sexo } from '../../../core/models/mascota.model';
import { UsuarioAutocomplete } from '../../../shared/usuario-autocomplete/usuario-autocomplete';
import { Usuario } from '../../../core/models/usuario.model';
import { MascotaFotosComponent } from '../mascota-fotos/mascota-fotos';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    InputNumberModule,
    UsuarioAutocomplete,
    MascotaFotosComponent,
  ],
  templateUrl: './mascota-form.html',
})
export class MascotaFormComponent implements OnChanges {
  private mascotaService = inject(MascotaService);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() mascota: Mascota | null = null;
  @Input() esAdmin = false;
  @Output() guardado = new EventEmitter<void>();

  guardando = signal(false);

  form = {
    usuarioId: null as number | null,
    nombre: '',
    especie: Especie.PERRO,
    raza: '',
    sexo: Sexo.DESCONOCIDO,
    color: '',
    senasParticulares: '',
  };

  opcionesEspecie = [
    { label: 'Perro', value: Especie.PERRO },
    { label: 'Gato', value: Especie.GATO },
    { label: 'Otro', value: Especie.OTRO },
  ];

  opcionesSexo = [
    { label: 'Macho', value: Sexo.MACHO },
    { label: 'Hembra', value: Sexo.HEMBRA },
    { label: 'Desconocido', value: Sexo.DESCONOCIDO },
  ];

  usuarioSeleccionado: Usuario | null = null;

  ngOnChanges(): void {
    if (this.mascota) {
      this.form = {
        usuarioId: this.mascota.usuarioId,
        nombre: this.mascota.nombre,
        especie: this.mascota.especie,
        raza: this.mascota.raza ?? '',
        sexo: this.mascota.sexo,
        color: this.mascota.color ?? '',
        senasParticulares: this.mascota.senasParticulares ?? '',
      };
    } else {
      this.form = {
        usuarioId: null,
        nombre: '',
        especie: Especie.PERRO,
        raza: '',
        sexo: Sexo.DESCONOCIDO,
        color: '',
        senasParticulares: '',
      };
      this.usuarioSeleccionado = null;
    }
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  guardar(): void {
    this.guardando.set(true);

    const peticion = this.mascota
      ? this.mascotaService.actualizar(this.mascota.id, {
          nombre: this.form.nombre,
          especie: this.form.especie,
          raza: this.form.raza || undefined,
          sexo: this.form.sexo,
          color: this.form.color || undefined,
          senasParticulares: this.form.senasParticulares || undefined,
        })
      : this.mascotaService.crear({
          usuarioId: this.form.usuarioId!,
          nombre: this.form.nombre,
          especie: this.form.especie,
          raza: this.form.raza || undefined,
          sexo: this.form.sexo,
          color: this.form.color || undefined,
          senasParticulares: this.form.senasParticulares || undefined,
        });

    peticion.subscribe({
      next: () => {
        this.guardando.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.mascota ? 'Mascota actualizada' : 'Mascota creada',
          detail: `${this.form.nombre} se guardó correctamente`,
        });
        this.guardado.emit();
      },
      error: (err) => {
        this.guardando.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message ?? 'No se pudo guardar la mascota',
        });
      },
    });
  }

  alSeleccionarUsuario(usuario: Usuario | null): void {
    this.usuarioSeleccionado = usuario;
    this.form.usuarioId = usuario?.id ?? null;
  }
}
