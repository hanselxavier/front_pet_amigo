import { Component, EventEmitter, Input, Output, OnChanges, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
import { ReportePerdidaService } from '../../../core/services/reporte-perdida.service';
import { ChatService } from '../../../core/services/chat.service';
import { ReportePerdida, EstadoReporte } from '../../../core/models/reporte-perdida.model';
import { Chat } from '../../../core/models/chat.model';

interface EventoLinea {
  fecha: string | undefined;
  titulo: string;
  icono: string;
  color: string;
  completado: boolean;
}

@Component({
  selector: 'app-reporte-detalle-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, DialogModule, TagModule, ButtonModule, TextareaModule, TimelineModule],
  templateUrl: './reporte-detalle-dialog.html',
})
export class ReporteDetalleDialogComponent implements OnChanges {
  private reporteService = inject(ReportePerdidaService);
  private chatService = inject(ChatService);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() reporte: ReportePerdida | null = null;
  @Output() actualizado = new EventEmitter<void>();

  chats = signal<Chat[]>([]);
  cargandoChats = signal(false);
  notasResolucion = '';
  resolviendo = signal(false);

  EstadoReporte = EstadoReporte;

  ngOnChanges(): void {
    this.notasResolucion = this.reporte?.notasResolucion ?? '';
    if (this.reporte) {
      this.cargarChats();
    }
  }

  private cargarChats(): void {
    if (!this.reporte) return;
    this.cargandoChats.set(true);
    this.chatService.obtenerPorReporte(this.reporte.id).subscribe({
      next: (data) => {
        this.chats.set(data);
        this.cargandoChats.set(false);
      },
      error: () => this.cargandoChats.set(false),
    });
  }

  get lineaTiempo(): EventoLinea[] {
    if (!this.reporte) return [];

    const eventos: EventoLinea[] = [
      {
        fecha: this.reporte.fechaReporte,
        titulo: 'Reporte creado',
        icono: 'pi pi-flag',
        color: '#E4572E',
        completado: true,
      },
      {
        fecha: this.reporte.fechaPrimerContacto,
        titulo: 'Primer contacto recibido',
        icono: 'pi pi-comment',
        color: '#A8791A',
        completado: !!this.reporte.fechaPrimerContacto,
      },
    ];

    if (this.reporte.estado !== EstadoReporte.ACTIVO) {
      eventos.push({
        fecha: this.reporte.fechaResolucion,
        titulo: this.reporte.estado === EstadoReporte.RECUPERADA ? 'Mascota recuperada' : 'Reporte cancelado',
        icono: this.reporte.estado === EstadoReporte.RECUPERADA ? 'pi pi-check-circle' : 'pi pi-times-circle',
        color: this.reporte.estado === EstadoReporte.RECUPERADA ? '#1F6D4C' : '#6B756F',
        completado: true,
      });
    }

    return eventos;
  }

  tiempoTranscurrido(desde?: string, hasta?: string): string | null {
    if (!desde || !hasta) return null;
    const horas = Math.round((new Date(hasta).getTime() - new Date(desde).getTime()) / (1000 * 60 * 60));
    if (horas < 1) return 'menos de una hora';
    if (horas < 24) return `${horas} hora${horas === 1 ? '' : 's'}`;
    return `${Math.round(horas / 24)} día${Math.round(horas / 24) === 1 ? '' : 's'}`;
  }

  resolver(estado: EstadoReporte.RECUPERADA | EstadoReporte.CANCELADO): void {
    if (!this.reporte) return;

    this.resolviendo.set(true);
    this.reporteService
      .resolver(this.reporte.id, { estado, notasResolucion: this.notasResolucion || undefined })
      .subscribe({
        next: () => {
          this.resolviendo.set(false);
          this.actualizado.emit();
          this.cerrar();
        },
        error: () => this.resolviendo.set(false),
      });
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}