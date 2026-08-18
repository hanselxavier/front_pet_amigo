import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { PagoService } from '../../../core/services/pago.service';
import { Pago, MetodoPago } from '../../../core/models/pago.model';
import { PagoFormComponent } from '../pago-form/pago-form';

@Component({
  selector: 'app-pagos-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    TableModule,
    ButtonModule,
    ToolbarModule,
    TagModule,
    PagoFormComponent,
  ],
  templateUrl: './pagos-list.html',
})
export class PagosList implements OnInit {
  private pagoService = inject(PagoService);

  pagos = signal<Pago[]>([]);
  totalGeneral = signal(0);
  cargando = signal(false);
  mostrarFormulario = signal(false);

  MetodoPago = MetodoPago;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);

    this.pagoService.listarTodos().subscribe({
      next: (data) => {
        this.pagos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });

    this.pagoService.totalGeneral().subscribe({
      next: (total) => this.totalGeneral.set(total),
    });
  }

  nuevoPago(): void {
    this.mostrarFormulario.set(true);
  }

  alRegistrar(): void {
    this.mostrarFormulario.set(false);
    this.cargar();
  }

  severidadMetodo(metodo: MetodoPago): 'success' | 'info' | 'warn' | 'secondary' {
    switch (metodo) {
      case MetodoPago.EFECTIVO:
        return 'success';
      case MetodoPago.TRANSFERENCIA:
        return 'info';
      case MetodoPago.TARJETA:
        return 'warn';
      default:
        return 'secondary';
    }
  }
}