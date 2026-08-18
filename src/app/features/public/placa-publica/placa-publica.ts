import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';
import { PlacaPublicaService } from '../../../core/services/placa-publica.service';
import { PlacaPublicaResponse } from '../../../core/models/placa-publica.model';
import { ChatStorageService } from '../../../core/services/chat-storage.service';

@Component({
  selector: 'app-placa-publica',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, GalleriaModule],
  templateUrl: './placa-publica.html',
})
export class PlacaPublica implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private placaService = inject(PlacaPublicaService);
  private chatStorage = inject(ChatStorageService);

  info = signal<PlacaPublicaResponse | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  codigoQr = '';
  fotoActivaIndex = signal(0);

  ngOnInit(): void {
    this.codigoQr = this.route.snapshot.paramMap.get('codigoQr') ?? '';
    this.cargarInfo();
  }

  private cargarInfo(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.consultar({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => this.consultar(),
        { timeout: 5000 },
      );
    } else {
      this.consultar();
    }
  }

  private consultar(coords?: { lat: number; lng: number }): void {
    this.placaService.obtenerInfo(this.codigoQr, coords).subscribe({
      next: (data) => {
        // Si no está perdida, ordena las fotos para que la principal aparezca primero
        if (!data.estaPerdida) {
          data.mascota.fotos = [...data.mascota.fotos].sort((a, b) =>
            a.esPrincipal === b.esPrincipal ? 0 : a.esPrincipal ? -1 : 1,
          );
        }
        this.info.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudo cargar la información de esta placa');
        this.cargando.set(false);
      },
    });
  }

  irAChat(): void {
    const data = this.info();
    if (!data?.estaPerdida) return;

    // Si ya existe un chat guardado para este QR, retómalo directo
    const tokenGuardado = this.chatStorage.obtenerToken(this.codigoQr);
    if (tokenGuardado) {
      this.router.navigate(['/chat', tokenGuardado]);
      return;
    }

    this.router.navigate(['/reportar-encontrado'], {
      queryParams: { reportePerdidaId: data.reportePerdidaId, codigoQr: this.codigoQr },
    });
  }

  seleccionarFoto(index: number): void {
    this.fotoActivaIndex.set(index);
  }
}
