import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlacaPublicaResponse } from '../models/placa-publica.model';

@Injectable({ providedIn: 'root' })
export class PlacaPublicaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/placas`;

  obtenerInfo(
    codigoQr: string,
    coords?: { lat: number; lng: number },
  ): Observable<PlacaPublicaResponse> {
    let url = `${this.apiUrl}/publico/${codigoQr}`;
    if (coords) {
      url += `?lat=${coords.lat}&lng=${coords.lng}`;
    }
    return this.http.get<PlacaPublicaResponse>(url);
  }
}