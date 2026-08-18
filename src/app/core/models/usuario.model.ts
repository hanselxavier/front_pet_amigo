export enum Rol {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
}

export enum EstadoCuenta {
  PENDIENTE = 'pendiente',
  VALIDADO = 'validado',
  RECHAZADO = 'rechazado',
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  rol: Rol;
  estadoCuenta: EstadoCuenta;
  activo: boolean;
  fechaRegistro: string;
}

export interface CrearUsuarioAdminDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  rol?: Rol;
}

export interface ValidarUsuarioDto {
  estadoCuenta: EstadoCuenta;
}