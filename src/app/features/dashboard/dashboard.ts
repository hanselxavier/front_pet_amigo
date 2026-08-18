import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { Auth } from '../../core/services/auth';
import { MascotaService } from '../../core/services/mascota.service';
import { PlacaService } from '../../core/services/placa.service';
import { PagoService } from '../../core/services/pago.service';
import { ReportePerdidaService } from '../../core/services/reporte-perdida.service';
import { Mascota } from '../../core/models/mascota.model';
import { Placa, Plan } from '../../core/models/placa.model';
import { ReportePerdida, EstadoReporte } from '../../core/models/reporte-perdida.model';
import { Rol } from '../../core/models/usuario.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, CardModule, TagModule, ButtonModule, ChartModule],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private auth = inject(Auth);
  private mascotaService = inject(MascotaService);
  private placaService = inject(PlacaService);
  private pagoService = inject(PagoService);
  private reporteService = inject(ReportePerdidaService);

  esAdmin = computed(() => this.auth.usuario()?.rol === Rol.ADMIN);
  nombreUsuario = computed(() => this.auth.usuario()?.nombre ?? '');

  mascotas = signal<Mascota[]>([]);
  placas = signal<Placa[]>([]);
  reportes = signal<ReportePerdida[]>([]);
  totalIngresos = signal(0);
  cargando = signal(true);

  // Métricas derivadas
  totalMascotas = computed(() => this.mascotas().length);
  mascotasPerdidas = computed(() => this.mascotas().filter((m) => m.estaPerdida).length);
  totalPlacas = computed(() => this.placas().length);
  placasPro = computed(() => this.placas().filter((p) => p.plan === Plan.PRO).length);
  placasBasico = computed(() => this.placas().filter((p) => p.plan === Plan.BASICO).length);
  placasSinAsignar = computed(() => this.placas().filter((p) => !p.mascotaId).length);
  reportesActivos = computed(() => this.reportes().filter((r) => r.estado === EstadoReporte.ACTIVO));

  chartData = computed(() => ({
    labels: ['Básico', 'Pro'],
    datasets: [
      {
        data: [this.placasBasico(), this.placasPro()],
        backgroundColor: ['#94a3b8', '#22c55e'],
      },
    ],
  }));

  chartOptions = {
    plugins: { legend: { position: 'bottom' } },
  };

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);

    const peticionMascotas = this.esAdmin()
      ? this.mascotaService.listarTodas()
      : this.mascotaService.misMascotas();

    const peticionPlacas = this.esAdmin()
      ? this.placaService.listarTodas()
      : this.placaService.misPlacas();

    const peticionReportes = this.esAdmin()
      ? this.reporteService.listarTodos()
      : this.reporteService.misReportes();

    peticionMascotas.subscribe({ next: (data) => this.mascotas.set(data) });
    peticionPlacas.subscribe({ next: (data) => this.placas.set(data) });
    peticionReportes.subscribe({ next: (data) => this.reportes.set(data) });

    if (this.esAdmin()) {
      this.pagoService.totalGeneral().subscribe({ next: (total) => this.totalIngresos.set(total) });
    }

    this.cargando.set(false);
  }
}