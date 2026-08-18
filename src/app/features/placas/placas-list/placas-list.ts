import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { PlacaService } from '../../../core/services/placa.service';
import { Auth } from '../../../core/services/auth';
import { Placa, EstadoPlaca, Plan } from '../../../core/models/placa.model';
import { Rol } from '../../../core/models/usuario.model';
import { PlacaFormComponent } from '../placa-form/placa-form';
import { PlacaQrDialogComponent } from '../placa-qr-dialog/placa-qr-dialog';
import { AsignarMascotaDialogComponent } from '../asignar-mascota-dialog/asignar-mascota-dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-placas-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    PlacaFormComponent,
    PlacaQrDialogComponent,
    AsignarMascotaDialogComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './placas-list.html',
})
export class PlacasList implements OnInit {
  private placaService = inject(PlacaService);
  private auth = inject(Auth);

  placas = signal<Placa[]>([]);
  cargando = signal(false);

  mostrarFormulario = signal(false);
  mostrarQr = signal(false);
  placaSeleccionada = signal<Placa | null>(null);

  mostrarAsignar = signal(false);
  placaParaAsignar = signal<Placa | null>(null);

  esAdmin = computed(() => this.auth.usuario()?.rol === Rol.ADMIN);
  EstadoPlaca = EstadoPlaca;
  Plan = Plan;

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const peticion = this.esAdmin()
      ? this.placaService.listarTodas()
      : this.placaService.misPlacas();

    peticion.subscribe({
      next: (data) => {
        this.placas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  nuevaPlaca(): void {
    this.mostrarFormulario.set(true);
  }

  alGenerar(): void {
    this.mostrarFormulario.set(false);
    this.cargar();
  }

  verQr(placa: Placa): void {
    this.placaSeleccionada.set(placa);
    this.mostrarQr.set(true);
  }

  upgradeAPro(placa: Placa): void {
    this.confirmationService.confirm({
      message: `¿Hacer upgrade a plan PRO para esta placa? Esta acción es permanente.`,
      header: 'Confirmar plan',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Actualizar a PRO',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.placaService.upgradeAPro(placa.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Mascota desactivada',
              detail: `Actualización a PRO se realizó correctamente`,
            });
            this.cargar();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message ?? 'No se pudo actualizar a plan PRO',
            });
          },
        });
      },
    });
  }

  cambiarEstado(placa: Placa, estado: EstadoPlaca): void {
    this.placaService.actualizarEstado(placa.id, estado).subscribe(() => this.cargar());
  }

  severidadEstado(estado: EstadoPlaca): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (estado) {
      case EstadoPlaca.ENTREGADA:
        return 'success';
      case EstadoPlaca.ASIGNADA:
        return 'info';
      case EstadoPlaca.ENVIADA_GRABADO:
        return 'warn';
      case EstadoPlaca.INACTIVA:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  asignarMascota(placa: Placa): void {
    this.placaParaAsignar.set(placa);
    this.mostrarAsignar.set(true);
  }

  alAsignar(): void {
    this.mostrarAsignar.set(false);
    this.cargar();
  }
}
