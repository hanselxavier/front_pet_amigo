import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Rol } from '../models/usuario.model';

const TOKEN_KEY = 'cm_token';
const USUARIO_KEY = 'cm_usuario';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private usuarioSignal = signal<LoginResponse['usuario'] | null>(
    this.leerUsuarioGuardado(),
  );

  usuario = this.usuarioSignal.asReadonly();
  estaAutenticado = computed(() => !!this.usuarioSignal());
  esAdmin = computed(() => this.usuarioSignal()?.rol === Rol.ADMIN);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap((respuesta) => {
        localStorage.setItem(TOKEN_KEY, respuesta.access_token);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.usuario));
        this.usuarioSignal.set(respuesta.usuario);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuarioSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private leerUsuarioGuardado(): LoginResponse['usuario'] | null {
    const data = localStorage.getItem(USUARIO_KEY);
    return data ? JSON.parse(data) : null;
  }
}