export enum EstadoReporte {
  ACTIVO = 'activo',
  RECUPERADA = 'recuperada',
  CANCELADO = 'cancelado',
}

export interface ReportePerdida {
  id: number;
  mascotaId: number;
  usuarioId: number;
  telefonoContacto: string;
  descripcion?: string;
  estado: EstadoReporte;
  fechaReporte: string;
  fechaPrimerContacto?: string;
  fechaResolucion?: string;
  notasResolucion?: string;
  mascota?: { id: number; nombre: string };
  usuario?: { id: number; nombre: string; apellido: string };
}

export interface CrearReporteDto {
  mascotaId: number;
  telefonoContacto: string;
  descripcion?: string;
}

export interface ResolverReporteDto {
  estado: EstadoReporte.RECUPERADA | EstadoReporte.CANCELADO;
  notasResolucion?: string;
}