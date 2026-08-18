import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pago, RegistrarPagoDto } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pagos`;

  registrar(dto: RegistrarPagoDto): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, dto);
  }

  listarTodos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  listarPorUsuario(usuarioId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  totalPorUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/usuario/${usuarioId}/total`);
  }

  totalGeneral(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/resumen/total-general`);
  }
}