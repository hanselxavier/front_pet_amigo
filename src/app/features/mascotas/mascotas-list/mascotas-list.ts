import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { MascotaService } from '../../../core/services/mascota.service';
import { ReportePerdidaService } from '../../../core/services/reporte-perdida.service';
import { SolicitudPlacaService } from '../../../core/services/solicitud-placa.service';
import { PlacaService } from '../../../core/services/placa.service';
import { Auth } from '../../../core/services/auth';
import { Mascota } from '../../../core/models/mascota.model';
import { ReportePerdida, EstadoReporte } from '../../../core/models/reporte-perdida.model';
import { SolicitudPlaca, EstadoSolicitud } from '../../../core/models/solicitud-placa.model';
import { Placa } from '../../../core/models/placa.model';
import { Rol } from '../../../core/models/usuario.model';
import { MascotaFormComponent } from '../mascota-form/mascota-form';
import { ReportarPerdidaFormComponent } from '../reportar-perdida-form/reportar-perdida-form';
import { SolicitarPlacaDialogComponent } from '../solicitar-placa-dialog/solicitar-placa-dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-mascotas-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    MascotaFormComponent,
    ReportarPerdidaFormComponent,
    SolicitarPlacaDialogComponent,
  ],
  templateUrl: './mascotas-list.html',
})
export class MascotasList implements OnInit {
  private mascotaService = inject(MascotaService);
  private reporteService = inject(ReportePerdidaService);
  private solicitudService = inject(SolicitudPlacaService);
  private placaService = inject(PlacaService);
  private auth = inject(Auth);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  mascotas = signal<Mascota[]>([]);
  reportesActivos = signal<ReportePerdida[]>([]);
  misSolicitudes = signal<SolicitudPlaca[]>([]);
  misPlacas = signal<Placa[]>([]);
  cargando = signal(false);

  mostrarFormulario = signal(false);
  mascotaSeleccionada = signal<Mascota | null>(null);

  mostrarFormReporte = signal(false);
  mascotaParaReportar = signal<Mascota | null>(null);

  mostrarSolicitarPlaca = signal(false);
  mascotaParaSolicitar = signal<Mascota | null>(null);

  esAdmin = computed(() => this.auth.usuario()?.rol === Rol.ADMIN);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);

    const peticionMascotas = this.esAdmin()
      ? this.mascotaService.listarTodas()
      : this.mascotaService.misMascotas();

    const peticionReportes = this.esAdmin()
      ? this.reporteService.listarActivos()
      : this.reporteService.misReportes();

    peticionMascotas.subscribe({
      next: (data) => {
        this.mascotas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });

    peticionReportes.subscribe({
      next: (data) =>
        this.reportesActivos.set(data.filter((r) => r.estado === EstadoReporte.ACTIVO)),
    });

    // Solo el cliente necesita este cruce (para saber qué botón mostrar en "solicitar placa")
    if (!this.esAdmin()) {
      this.solicitudService.misSolicitudes().subscribe({
        next: (data) => this.misSolicitudes.set(data),
      });
      this.placaService.misPlacas().subscribe({
        next: (data) => this.misPlacas.set(data),
      });
    }
  }

  reporteDe(mascota: Mascota): ReportePerdida | undefined {
    return this.reportesActivos().find((r) => r.mascotaId === mascota.id);
  }

  /** Solicitud pendiente para esta mascota, si existe */
  solicitudPendienteDe(mascota: Mascota): SolicitudPlaca | undefined {
    return this.misSolicitudes().find(
      (s) => s.mascotaId === mascota.id && s.estado === EstadoSolicitud.PENDIENTE,
    );
  }

  /** Placa ya asignada a esta mascota, si existe */
  placaDe(mascota: Mascota): Placa | undefined {
    return this.misPlacas().find((p) => p.mascotaId === mascota.id);
  }

  nuevaMascota(): void {
    this.mascotaSeleccionada.set(null);
    this.mostrarFormulario.set(true);
  }

  editar(mascota: Mascota): void {
    this.mascotaSeleccionada.set(mascota);
    this.mostrarFormulario.set(true);
  }

  alGuardar(): void {
    this.mostrarFormulario.set(false);
    this.cargar();
  }

  reportarPerdida(mascota: Mascota): void {
    this.mascotaParaReportar.set(mascota);
    this.mostrarFormReporte.set(true);
  }

  alReportar(): void {
    this.mostrarFormReporte.set(false);
    this.cargar();
  }

  marcarRecuperada(mascota: Mascota): void {
    const reporte = this.reporteDe(mascota);
    if (!reporte) return;

    this.confirmationService.confirm({
      message: `¿Marcar a ${mascota.nombre} como recuperada?`,
      header: 'Confirmar recuperación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Marcar como recuperada',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.reporteService.resolver(reporte.id, { estado: EstadoReporte.RECUPERADA }).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Mascota recuperada',
              detail: `${mascota.nombre} fue marcada como recuperada`,
            });
            this.cargar();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message ?? 'No se pudo marcar como recuperada',
            });
          },
        });
      },
    });
  }

  solicitarPlaca(mascota: Mascota): void {
    this.mascotaParaSolicitar.set(mascota);
    this.mostrarSolicitarPlaca.set(true);
  }

  alSolicitar(): void {
    this.mostrarSolicitarPlaca.set(false);
    this.cargar();
  }

  desactivar(mascota: Mascota): void {
    this.confirmationService.confirm({
      message: `¿Desactivar a ${mascota.nombre}? Esta acción no se puede deshacer.`,
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.mascotaService.desactivar(mascota.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Mascota desactivada',
              detail: `${mascota.nombre} fue desactivada correctamente`,
            });
            this.cargar();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message ?? 'No se pudo desactivar la mascota',
            });
          },
        });
      },
    });
  }
}
