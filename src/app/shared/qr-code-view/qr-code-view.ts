import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code-view',
  standalone: true,
  templateUrl: './qr-code-view.html',
})
export class QrCodeView implements OnChanges, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() valor = '';
  @Input() tamano = 180;

  private vistaLista = false;

  ngAfterViewInit(): void {
    this.vistaLista = true;
    this.dibujar();
  }

  ngOnChanges(): void {
    if (this.vistaLista) {
      this.dibujar();
    }
  }

  private dibujar(): void {
    if (!this.valor || !this.canvasRef) return;
    QRCode.toCanvas(this.canvasRef.nativeElement, this.valor, {
      width: this.tamano,
      margin: 1,
    });
  }
}