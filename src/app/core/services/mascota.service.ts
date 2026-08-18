import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Mascota,
  CrearMascotaDto,
  ActualizarMascotaDto,
} from '../models/mascota.model';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mascotas`;

  listarTodas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  misMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.apiUrl}/mis-mascotas`);
  }

  obtenerPorId(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`);
  }

  crear(dto: CrearMascotaDto): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: ActualizarMascotaDto): Observable<Mascota> {
    return this.http.patch<Mascota>(`${this.apiUrl}/${id}`, dto);
  }

  marcarPerdida(id: number, estaPerdida: boolean): Observable<Mascota> {
    return this.http.patch<Mascota>(`${this.apiUrl}/${id}/marcar-perdida`, {
      estaPerdida,
    });
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}