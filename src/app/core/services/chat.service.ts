import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Chat, Mensaje } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  misChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/mis-chats`);
  }

  obtenerPorId(id: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/${id}`);
  }

  listarMensajes(chatId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/mensajes/chat/${chatId}`);
  }

  enviarMensaje(chatId: number, contenido: string): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/mensajes/chat/${chatId}/propietario`, {
      contenido,
    });
  }

  archivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/chats/${id}/archivar`, {});
  }

  desarchivar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/chats/${id}/desarchivar`, {});
  }

  listarTodos(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`);
  }

  obtenerPorReporte(reportePerdidaId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.apiUrl}/chats/reporte/${reportePerdidaId}`);
  }
}
