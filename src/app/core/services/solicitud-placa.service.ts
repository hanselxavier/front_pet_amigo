import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SolicitudPlaca, CrearSolicitudDto, ResolverSolicitudDto } from '../models/solicitud-placa.model';

@Injectable({ providedIn: 'root' })
export class SolicitudPlacaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/solicitudes-placa`;

  crear(dto: CrearSolicitudDto): Observable<SolicitudPlaca> {
    return this.http.post<SolicitudPlaca>(this.apiUrl, dto);
  }

  listarPendientes(): Observable<SolicitudPlaca[]> {
    return this.http.get<SolicitudPlaca[]>(`${this.apiUrl}/pendientes`);
  }

  misSolicitudes(): Observable<SolicitudPlaca[]> {
    return this.http.get<SolicitudPlaca[]>(`${this.apiUrl}/mis-solicitudes`);
  }

  resolver(id: number, dto: ResolverSolicitudDto): Observable<SolicitudPlaca> {
    return this.http.patch<SolicitudPlaca>(`${this.apiUrl}/${id}/resolver`, dto);
  }
}