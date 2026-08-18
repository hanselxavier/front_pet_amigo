import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MascotaFotoService } from '../../../core/services/mascota-foto.service';
import { MascotaFoto } from '../../../core/models/mascota.model';

const MAX_FOTOS = 5;

@Component({
  selector: 'app-mascota-fotos',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './mascota-fotos.html',
})
export class MascotaFotosComponent implements OnChanges {
  private fotoService = inject(MascotaFotoService);

  @Input({ required: true }) mascotaId!: number;

  fotos = signal<MascotaFoto[]>([]);
  cargando = signal(false);
  subiendo = signal(false);
  error = signal<string | null>(null);

  get puedeAgregarMas(): boolean {
    return this.fotos().length < MAX_FOTOS;
  }

  ngOnChanges(): void {
    if (this.mascotaId) {
      this.cargar();
    }
  }

  cargar(): void {
    this.cargando.set(true);
    this.fotoService.listarPorMascota(this.mascotaId).subscribe({
      next: (data) => {
        this.fotos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.subiendo.set(true);
    this.error.set(null);

    this.fotoService.subir(this.mascotaId, archivo).subscribe({
      next: () => {
        this.subiendo.set(false);
        this.cargar();
        input.value = ''; // permite volver a seleccionar el mismo archivo si hace falta
      },
      error: (err) => {
        this.subiendo.set(false);
        this.error.set(err.error?.message ?? 'No se pudo subir la foto');
        input.value = '';
      },
    });
  }

  marcarPrincipal(foto: MascotaFoto): void {
    this.fotoService.marcarPrincipal(foto.id).subscribe(() => this.cargar());
  }

  eliminar(foto: MascotaFoto): void {
    if (!confirm('¿Eliminar esta foto?')) return;
    this.fotoService.eliminar(foto.id).subscribe(() => this.cargar());
  }
}