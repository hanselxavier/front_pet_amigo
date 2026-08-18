import { Component, Input, Output, EventEmitter, inject, signal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChatService } from '../../../core/services/chat.service';
import { Chat, Mensaje, EmisorTipo, EstadoChat } from '../../../core/models/chat.model';

@Component({
  selector: 'app-chat-conversacion',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './chat-conversacion.html',
})
export class ChatConversacionComponent implements OnChanges {
  private chatService = inject(ChatService);

  @Input({ required: true }) chat!: Chat;
  @Output() mensajeEnviado = new EventEmitter<void>();

  mensajes = signal<Mensaje[]>([]);
  cargando = signal(true);
  nuevoMensaje = '';
  enviando = signal(false);

  EmisorTipo = EmisorTipo;
  EstadoChat = EstadoChat;

  ngOnChanges(): void {
    if (this.chat) {
      this.cargarMensajes();
    }
  }

  private cargarMensajes(): void {
    this.cargando.set(true);
    this.chatService.listarMensajes(this.chat.id).subscribe({
      next: (data) => {
        this.mensajes.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  enviar(): void {
    if (!this.nuevoMensaje.trim() || this.chat.estado === EstadoChat.CERRADO) return;

    const contenido = this.nuevoMensaje;
    this.nuevoMensaje = '';
    this.enviando.set(true);

    this.chatService.enviarMensaje(this.chat.id, contenido).subscribe({
      next: () => {
        this.enviando.set(false);
        this.cargarMensajes();
        this.mensajeEnviado.emit();
      },
      error: () => this.enviando.set(false),
    });
  }

  esDelDuenoReal(msg: Mensaje): boolean {
  const duenoId = this.chat.reportePerdida?.usuario?.id;
  return msg.emisorUsuarioId === duenoId;
}
}