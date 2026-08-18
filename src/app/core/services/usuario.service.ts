import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, CrearUsuarioAdminDto, EstadoCuenta } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearPorAdmin(dto: CrearUsuarioAdminDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, dto);
  }

  validarCuenta(id: number, estadoCuenta: EstadoCuenta): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/validar`, { estadoCuenta });
  }

  actualizar(id: number, dto: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, dto);
  }

  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarPerfil(id: number, dto: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, dto);
  }

  resetearPassword(id: number, password: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/resetear-password`, { password });
  }

  subirFotoPerfil(id: number, archivo: File): Observable<Usuario> {
    const formData = new FormData();
    formData.append('foto', archivo);
    return this.http.post<Usuario>(`${this.apiUrl}/${id}/foto-perfil`, formData);
  }
}
