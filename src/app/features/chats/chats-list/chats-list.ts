import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ChatService } from '../../../core/services/chat.service';
import { Chat, EstadoChat } from '../../../core/models/chat.model';
import { ChatConversacionComponent } from '../chat-conversacion/chat-conversacion';
import { Auth } from '../../../core/services/auth';
import { Rol } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [CommonModule, TagModule, ButtonModule, TooltipModule, ChatConversacionComponent],
  templateUrl: './chats-list.html',
})
export class ChatsList implements OnInit {
  private chatService = inject(ChatService);
  private auth = inject(Auth);

  chats = signal<Chat[]>([]);
  cargando = signal(false);
  chatSeleccionado = signal<Chat | null>(null);

  EstadoChat = EstadoChat;
  esAdmin = computed(() => this.auth.usuario()?.rol === Rol.ADMIN);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const peticion = this.esAdmin()
      ? this.chatService.listarTodos()
      : this.chatService.misChats();

    peticion.subscribe({
      next: (data) => {
        this.chats.set(data);
        this.cargando.set(false);
        const actual = this.chatSeleccionado();
        if (actual) {
          const actualizado = data.find((c) => c.id === actual.id);
          if (actualizado) this.chatSeleccionado.set(actualizado);
        }
      },
      error: () => this.cargando.set(false),
    });
  }
  
  abrir(chat: Chat): void {
    this.chatSeleccionado.set(chat);
  }

  archivar(chat: Chat, event: Event): void {
    event.stopPropagation();
    this.chatService.archivar(chat.id).subscribe(() => {
      this.cargar();
      if (this.chatSeleccionado()?.id === chat.id) {
        this.chatSeleccionado.set(null);
      }
    });
  }

  duenoDe(chat: Chat): { nombre: string; apellido: string } | null {
  return chat.reportePerdida?.usuario ?? null;
}
}