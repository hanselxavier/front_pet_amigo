export interface FotoPublica {
  id: number;
  urlFoto: string;
  esPrincipal: boolean;
}

export interface PlacaPublicaNoPerdida {
  estaPerdida: false;
  mascota: {
    nombre: string;
    especie: string;
    raza: string | null;
    sexo: string;
    color: string | null;
    senasParticulares: string | null;
    fotos: FotoPublica[];
  };
}

export interface PlacaPublicaPerdida {
  estaPerdida: true;
  mascota: {
    nombre: string;
    fotoPrincipal: string | null;
  };
  reportePerdidaId: number;
}

export type PlacaPublicaResponse = PlacaPublicaNoPerdida | PlacaPublicaPerdida;