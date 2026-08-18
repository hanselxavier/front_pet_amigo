import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ReportePerdida,
  CrearReporteDto,
  ResolverReporteDto,
} from '../models/reporte-perdida.model';

@Injectable({ providedIn: 'root' })
export class ReportePerdidaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reportes-perdida`;

  crear(dto: CrearReporteDto): Observable<ReportePerdida> {
    return this.http.post<ReportePerdida>(this.apiUrl, dto);
  }

  listarActivos(): Observable<ReportePerdida[]> {
    return this.http.get<ReportePerdida[]>(`${this.apiUrl}/activos`);
  }

  misReportes(): Observable<ReportePerdida[]> {
    return this.http.get<ReportePerdida[]>(`${this.apiUrl}/mis-reportes`);
  }

  obtenerPorId(id: number): Observable<ReportePerdida> {
    return this.http.get<ReportePerdida>(`${this.apiUrl}/${id}`);
  }

  resolver(id: number, dto: ResolverReporteDto): Observable<ReportePerdida> {
    return this.http.patch<ReportePerdida>(`${this.apiUrl}/${id}/resolver`, dto);
  }
  listarTodos(): Observable<ReportePerdida[]> {
    return this.http.get<ReportePerdida[]>(this.apiUrl);
  }
}
