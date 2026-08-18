import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chat, IniciarChatDto, Mensaje } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatGuestService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  iniciar(dto: IniciarChatDto): Observable<{ chat: Chat; tokenAcceso: string }> {
    return this.http.post<{ chat: Chat; tokenAcceso: string }>(`${this.apiUrl}/chats/iniciar`, dto);
  }

  obtenerPorToken(token: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/token/${token}`);
  }

  listarMensajes(token: string): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/mensajes/token/${token}`);
  }

  enviarMensaje(token: string, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/mensajes/token/${token}`, { contenido });
  }
}
