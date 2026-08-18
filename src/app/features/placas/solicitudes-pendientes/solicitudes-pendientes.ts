import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { SolicitudPlacaService } from '../../../core/services/solicitud-placa.service';
import { SolicitudPlaca, EstadoSolicitud } from '../../../core/models/solicitud-placa.model';
import { Plan } from '../../../core/models/placa.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-solicitudes-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    FormsModule,
    TextareaModule,
  ],
  templateUrl: './solicitudes-pendientes.html',
})
export class SolicitudesPendientesComponent implements OnInit {
  private solicitudService = inject(SolicitudPlacaService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  solicitudes = signal<SolicitudPlaca[]>([]);
  cargando = signal(false);

  mostrarRechazo = signal(false);
  solicitudSeleccionada = signal<SolicitudPlaca | null>(null);
  motivoRechazo = '';
  planElegido = Plan.BASICO;

  opcionesPlan = [
    { label: 'Básico', value: Plan.BASICO },
    { label: 'Pro', value: Plan.PRO },
  ];

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.solicitudService.listarPendientes().subscribe({
      next: (data) => {
        this.solicitudes.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  aprobar(solicitud: SolicitudPlaca, plan: Plan): void {
    this.confirmationService.confirm({
      message: `¿Aprobar la placa para ${solicitud.mascota?.nombre} con plan ${plan}?`,
      header: 'Confirmar aprobación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, aprobar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.solicitudService
          .resolver(solicitud.id, { estado: EstadoSolicitud.APROBADA, plan })
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Solicitud aprobada',
                detail: `${solicitud.mascota?.nombre} fue aprobada correctamente`,
              });
              this.cargar();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err.error?.message ?? 'No se pudo aprobar la placa',
              });
            },
          });
      },
    });
  }

  abrirRechazo(solicitud: SolicitudPlaca): void {
    this.solicitudSeleccionada.set(solicitud);
    this.motivoRechazo = '';
    this.mostrarRechazo.set(true);
  }

  confirmarRechazo(): void {
    const solicitud = this.solicitudSeleccionada();
    if (!solicitud) return;

    this.solicitudService
      .resolver(solicitud.id, {
        estado: EstadoSolicitud.RECHAZADA,
        motivoRechazo: this.motivoRechazo,
      })
      .subscribe(() => {
        this.mostrarRechazo.set(false);
        this.cargar();
      });
  }
}