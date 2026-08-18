export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  TARJETA = 'tarjeta',
  OTRO = 'otro',
}

export interface Pago {
  id: number;
  usuarioId: number;
  placaId: number | null;
  adminId: number;
  concepto: string;
  monto: number;
  metodoPago: MetodoPago;
  fechaPago: string;
  notas?: string;
  usuario?: { id: number; nombre: string; apellido: string };
  admin?: { id: number; nombre: string; apellido: string };
  placa?: { id: number; codigoQr: string };
}

export interface RegistrarPagoDto {
  usuarioId: number;
  placaId?: number;
  concepto: string;
  monto: number;
  metodoPago?: MetodoPago;
  notas?: string;
}