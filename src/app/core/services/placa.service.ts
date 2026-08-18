import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Placa,
  GenerarPlacaDto,
  EstadoPlaca,
} from '../models/placa.model';

@Injectable({ providedIn: 'root' })
export class PlacaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/placas`;

  generar(dto: GenerarPlacaDto): Observable<Placa> {
    return this.http.post<Placa>(this.apiUrl, dto);
  }

  listarTodas(): Observable<Placa[]> {
    return this.http.get<Placa[]>(this.apiUrl);
  }

  misPlacas(): Observable<Placa[]> {
    return this.http.get<Placa[]>(`${this.apiUrl}/mis-placas`);
  }

  obtenerPorId(id: number): Observable<Placa> {
    return this.http.get<Placa>(`${this.apiUrl}/${id}`);
  }

  actualizarEstado(id: number, estado: EstadoPlaca): Observable<Placa> {
    return this.http.patch<Placa>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  upgradeAPro(id: number): Observable<Placa> {
    return this.http.patch<Placa>(`${this.apiUrl}/${id}/upgrade-pro`, {});
  }

  reasignar(id: number, mascotaId: number): Observable<Placa> {
    return this.http.patch<Placa>(`${this.apiUrl}/${id}/reasignar`, { mascotaId });
  }
}