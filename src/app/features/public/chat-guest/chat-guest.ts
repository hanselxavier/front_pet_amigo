import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { ChatGuestService } from '../../../core/services/chat-guest.service';
import { ChatStorageService } from '../../../core/services/chat-storage.service';
import { Chat, Mensaje, EmisorTipo, EstadoChat } from '../../../core/models/chat.model';

@Component({
  selector: 'app-chat-guest',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    TagModule,
  ],
  templateUrl: './chat-guest.html',
})
export class ChatGuest implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatGuestService);
  private chatStorage = inject(ChatStorageService);

  reportePerdidaId: number | null = null;
  codigoQr: string | null = null;
  nombreForm = '';
  telefonoForm = '';
  mensajeForm = '';
  enviando = signal(false);
  errorInicio = signal<string | null>(null);

  chat = signal<Chat | null>(null);
  mensajes = signal<Mensaje[]>([]);
  cargando = signal(true);
  nuevoMensaje = '';
  token = '';

  copiado = signal(false);

  EmisorTipo = EmisorTipo;
  chatCerrado = computed(() => this.chat()?.estado === EstadoChat.CERRADO);

  get urlChat(): string {
    return `${window.location.origin}/chat/${this.token}`;
  }

  ngOnInit(): void {
    const tokenRuta = this.route.snapshot.paramMap.get('token');
    const reporteId = this.route.snapshot.queryParamMap.get('reportePerdidaId');
    const codigoQr = this.route.snapshot.queryParamMap.get('codigoQr');

    if (tokenRuta) {
      this.token = tokenRuta;
      this.cargarChatExistente();
    } else if (reporteId) {
      this.reportePerdidaId = Number(reporteId);
      this.codigoQr = codigoQr;
      this.cargando.set(false);
    } else {
      this.cargando.set(false);
    }
  }

  private cargarChatExistente(): void {
    this.chatService.obtenerPorToken(this.token).subscribe({
      next: (chat) => {
        this.chat.set(chat);
        this.cargarMensajes(); // ← ya no necesita el chatId, usa this.token
      },
      error: () => this.cargando.set(false),
    });
  }

  private cargarMensajes(): void {
    this.chatService.listarMensajes(this.token).subscribe({
      next: (data) => {
        this.mensajes.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  iniciarChat(): void {
    if (!this.nombreForm || !this.telefonoForm || !this.mensajeForm) {
      this.errorInicio.set('Completa todos los campos');
      return;
    }
    if (!this.reportePerdidaId) return;

    this.enviando.set(true);
    this.errorInicio.set(null);

    this.chatService
      .iniciar({
        reportePerdidaId: this.reportePerdidaId,
        contactoNombre: this.nombreForm,
        contactoTelefono: this.telefonoForm,
        primerMensaje: this.mensajeForm,
      })
      .subscribe({
        next: (respuesta) => {
          this.enviando.set(false);

          // Persistimos el token asociado al QR, para poder retomarlo después
          if (this.codigoQr) {
            this.chatStorage.guardarToken(this.codigoQr, respuesta.tokenAcceso);
          }

          this.router.navigate(['/chat', respuesta.tokenAcceso]);
        },
        error: (err) => {
          this.enviando.set(false);
          this.errorInicio.set(err.error?.message ?? 'No se pudo iniciar el chat');
        },
      });
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim()) return;

    const contenido = this.nuevoMensaje;
    this.nuevoMensaje = '';

    this.chatService.enviarMensaje(this.token, contenido).subscribe({
      next: () => this.cargarMensajes(),
    });
  }

  copiarLink(): void {
    navigator.clipboard.writeText(this.urlChat).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    });
  }
}
