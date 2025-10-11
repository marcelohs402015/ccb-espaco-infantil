export type ResponsavelType = 'pai' | 'mae' | 'outro';

export interface Child {
  id: string;
  nome: string;
  nomeResponsavel: string;
  tipoResponsavel: ResponsavelType;
  celularResponsavel: string;
  observacoes: string;
  horaEntrada: string;
}

export interface Settings {
  capacidadeMaxima: number;
}

export interface CultoObservacoes {
  data: string;
  palavraLida: string;
  hinosCantados: string;
  aprendizado: string;
}

