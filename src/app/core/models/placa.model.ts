export enum Plan {
  BASICO = 'basico',
  PRO = 'pro',
}

export enum EstadoPlaca {
  GENERADA = 'generada',
  ASIGNADA = 'asignada',
  ENVIADA_GRABADO = 'enviada_grabado',
  ENTREGADA = 'entregada',
  INACTIVA = 'inactiva',
}

export interface Placa {
  id: number;
  usuarioId: number;
  mascotaId: number | null;
  codigoQr: string;
  plan: Plan;
  estado: EstadoPlaca;
  fechaGeneracion: string;
  fechaAsignacion?: string;
  fechaUpgradePro?: string;
  usuario?: { id: number; nombre: string; apellido: string };
  mascota?: { id: number; nombre: string };
}

export interface GenerarPlacaDto {
  usuarioId: number;
  mascotaId?: number;
  plan?: Plan;
}

export interface AsignarMascotaDto {
  mascotaId: number;
}