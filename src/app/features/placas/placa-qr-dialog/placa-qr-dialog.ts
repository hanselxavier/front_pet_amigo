import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Placa } from '../../../core/models/placa.model';
import { QrCodeView } from '../../../shared/qr-code-view/qr-code-view';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-placa-qr-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, QrCodeView],
  templateUrl: './placa-qr-dialog.html',
})
export class PlacaQrDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() placa: Placa | null = null;

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
}