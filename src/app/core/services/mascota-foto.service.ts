import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MascotaFoto } from '../models/mascota.model';

@Injectable({ providedIn: 'root' })
export class MascotaFotoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/mascota-fotos`;

  listarPorMascota(mascotaId: number): Observable<MascotaFoto[]> {
    return this.http.get<MascotaFoto[]>(`${this.apiUrl}/mascota/${mascotaId}`);
  }

  subir(mascotaId: number, archivo: File): Observable<MascotaFoto> {
    const formData = new FormData();
    formData.append('foto', archivo);
    return this.http.post<MascotaFoto>(`${this.apiUrl}/upload/${mascotaId}`, formData);
  }

  marcarPrincipal(id: number): Observable<MascotaFoto> {
    return this.http.patch<MascotaFoto>(`${this.apiUrl}/${id}/marcar-principal`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}