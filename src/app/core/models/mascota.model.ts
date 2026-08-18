export enum Especie {
  PERRO = 'perro',
  GATO = 'gato',
  OTRO = 'otro',
}

export enum Sexo {
  MACHO = 'macho',
  HEMBRA = 'hembra',
  DESCONOCIDO = 'desconocido',
}

export interface MascotaFoto {
  id: number;
  urlFoto: string;
  esPrincipal: boolean;
  orden: number;
}

export interface Mascota {
  id: number;
  usuarioId: number;
  nombre: string;
  especie: Especie;
  raza?: string;
  sexo: Sexo;
  color?: string;
  fechaNacimiento?: string;
  senasParticulares?: string;
  estaPerdida: boolean;
  activo: boolean;
  fechaRegistro: string;
  fotos?: MascotaFoto[];
  usuario?: { id: number; nombre: string; apellido: string };
}

export interface CrearMascotaDto {
  usuarioId: number;
  nombre: string;
  especie: Especie;
  raza?: string;
  sexo?: Sexo;
  color?: string;
  fechaNacimiento?: string;
  senasParticulares?: string;
}

export type ActualizarMascotaDto = Partial<Omit<CrearMascotaDto, 'usuarioId'>>;