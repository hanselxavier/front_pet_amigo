import { Usuario } from './usuario.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: Pick<Usuario, 'id' | 'nombre' | 'apellido' | 'email' | 'rol'>;
}