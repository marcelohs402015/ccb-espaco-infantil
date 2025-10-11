export type ResponsavelType = 'pai' | 'mae' | 'outro';

export interface Child {
  id: string;
  nome: string;
  nomeResponsavel: string;
  tipoResponsavel: ResponsavelType;
  celularResponsavel: string;
  observacoes: string;
  horaEntrada: string;
  isChamadoAtivo?: boolean;
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

export interface HistoricoCulto {
  id: string;
  data: string;
  palavraLida: string;
  hinosCantados: string;
  aprendizado: string;
  totalCriancas: number;
}

export interface DiaUso {
  data: string;
  totalCriancas: number;
  cultoRealizado: boolean;
}

export interface Igreja {
  id: string;
  nome: string;
  dataCadastro: string;
}

