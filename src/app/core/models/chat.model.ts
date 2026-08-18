export enum EmisorTipo {
  PROPIETARIO = 'propietario',
  CONTACTO = 'contacto',
  SISTEMA = 'sistema',
}

export enum EstadoChat {
  ACTIVO = 'activo',
  CERRADO = 'cerrado',
}

export interface Mensaje {
  id: number;
  chatId: number;
  emisorTipo: EmisorTipo;
  emisorUsuarioId: number | null;
  emisorUsuario?: { id: number; nombre: string; apellido: string }; // ← nuevo
  contenido: string;
  leido: boolean;
  fechaEnvio: string;
}


export interface Chat {
  id: number;
  reportePerdidaId: number;
  tokenAcceso: string;
  contactoNombre: string;
  contactoTelefono: string;
  estado: EstadoChat;
  fechaCreacion: string;
  fechaCierre: string | null;
  reportePerdida?: {
    id: number;
    mascota?: { nombre: string };
    usuario?: { id: number; nombre: string; apellido: string }; // ← nuevo
  };
}

export interface IniciarChatDto {
  reportePerdidaId: number;
  contactoNombre: string;
  contactoTelefono: string;
  primerMensaje: string;
}