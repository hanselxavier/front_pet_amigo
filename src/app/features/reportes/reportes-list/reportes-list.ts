import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ReportePerdidaService } from '../../../core/services/reporte-perdida.service';
import { Auth } from '../../../core/services/auth';
import { ReportePerdida, EstadoReporte } from '../../../core/models/reporte-perdida.model';
import { Rol } from '../../../core/models/usuario.model';
import { ReporteDetalleDialogComponent } from '../reporte-detalle-dialog/reporte-detalle-dialog';

@Component({
  selector: 'app-reportes-list',
  standalone: true,
  imports: [CommonModule, DatePipe, TableModule, TagModule, ButtonModule, ToolbarModule, ReporteDetalleDialogComponent],
  templateUrl: './reportes-list.html',
})
export class ReportesList implements OnInit {
  private reporteService = inject(ReportePerdidaService);
  private auth = inject(Auth);

  reportes = signal<ReportePerdida[]>([]);
  cargando = signal(false);

  esAdmin = computed(() => this.auth.usuario()?.rol === Rol.ADMIN);
  EstadoReporte = EstadoReporte;

  mostrarDetalle = signal(false);
  reporteSeleccionado = signal<ReportePerdida | null>(null);

  // Métricas calculadas
  totalActivos = computed(() => this.reportes().filter((r) => r.estado === EstadoReporte.ACTIVO).length);
  totalRecuperados = computed(() => this.reportes().filter((r) => r.estado === EstadoReporte.RECUPERADA).length);
  totalCancelados = computed(() => this.reportes().filter((r) => r.estado === EstadoReporte.CANCELADO).length);

  tiempoPromedioResolucion = computed(() => {
    const resueltos = this.reportes().filter(
      (r) => r.estado === EstadoReporte.RECUPERADA && r.fechaResolucion,
    );
    if (resueltos.length === 0) return null;

    const totalHoras = resueltos.reduce((acc, r) => {
      const inicio = new Date(r.fechaReporte).getTime();
      const fin = new Date(r.fechaResolucion!).getTime();
      return acc + (fin - inicio) / (1000 * 60 * 60);
    }, 0);

    return Math.round(totalHoras / resueltos.length);
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const peticion = this.esAdmin()
      ? this.reporteService.listarTodos()
      : this.reporteService.misReportes();

    peticion.subscribe({
      next: (data) => {
        this.reportes.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  resolver(reporte: ReportePerdida, estado: EstadoReporte.RECUPERADA | EstadoReporte.CANCELADO): void {
    const accion = estado === EstadoReporte.RECUPERADA ? 'recuperada' : 'cancelado';
    if (!confirm(`¿Marcar este reporte como ${accion}?`)) return;

    this.reporteService.resolver(reporte.id, { estado }).subscribe(() => this.cargar());
  }

  severidadEstado(estado: EstadoReporte): 'danger' | 'success' | 'secondary' {
    switch (estado) {
      case EstadoReporte.ACTIVO:
        return 'danger';
      case EstadoReporte.RECUPERADA:
        return 'success';
      default:
        return 'secondary';
    }
  }

  verDetalle(reporte: ReportePerdida): void {
    this.reporteSeleccionado.set(reporte);
    this.mostrarDetalle.set(true);
  }

  alActualizarDetalle(): void {
    this.mostrarDetalle.set(false);
    this.cargar();
  }
}