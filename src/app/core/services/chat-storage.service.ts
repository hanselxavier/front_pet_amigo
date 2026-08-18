import { Injectable } from '@angular/core';

const PREFIJO = 'cm_chat_';

@Injectable({ providedIn: 'root' })
export class ChatStorageService {
  guardarToken(codigoQr: string, token: string): void {
    localStorage.setItem(PREFIJO + codigoQr, token);
  }

  obtenerToken(codigoQr: string): string | null {
    return localStorage.getItem(PREFIJO + codigoQr);
  }

  eliminarToken(codigoQr: string): void {
    localStorage.removeItem(PREFIJO + codigoQr);
  }
}