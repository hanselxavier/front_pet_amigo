import { Component, Input, Output, EventEmitter, ViewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Placa } from '../../../core/models/placa.model';
import { QrCodeView } from '../../../shared/qr-code-view/qr-code-view';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../../core/services/auth';
import { Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-placa-qr-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, QrCodeView],
  templateUrl: './placa-qr-dialog.html',
})
export class PlacaQrDialogComponent {
  @ViewChild(QrCodeView) qrCodeView!: QrCodeView;

  private auth = inject(Auth);

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() placa: Placa | null = null;

  esAdmin = computed(() => this.auth.usuario()?.rol === Rol.ADMIN);

  get urlPublica(): string {
    if (!this.placa) return '';
    return `${environment.frontendUrl}/m/${this.placa.codigoQr}`;
  }

  cerrar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  imprimir(): void {
    window.print();
  }

  async descargarSvg(): Promise<void> {
    const svg = await this.qrCodeView.obtenerSvg();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    this.descargarBlob(blob, `placa-${this.placa?.codigoQr}.svg`);
  }

  async descargarPng(): Promise<void> {
    const dataUrl = await this.qrCodeView.obtenerPngAltaResolucion(1000);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `placa-${this.placa?.codigoQr}.png`;
    link.click();
  }

  private descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    URL.revokeObjectURL(url);
  }
}