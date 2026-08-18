import { Plan } from './placa.model';

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

export interface SolicitudPlaca {
  id: number;
  mascotaId: number;
  usuarioId: number;
  estado: EstadoSolicitud;
  notas?: string;
  motivoRechazo?: string;
  placaId: number | null;
  fechaSolicitud: string;
  fechaResolucion?: string;
  mascota?: { id: number; nombre: string };
  usuario?: { id: number; nombre: string; apellido: string };
}

export interface CrearSolicitudDto {
  mascotaId: number;
  notas?: string;
}

export interface ResolverSolicitudDto {
  estado: EstadoSolicitud.APROBADA | EstadoSolicitud.RECHAZADA;
  motivoRechazo?: string;
  plan?: Plan;
}