/**
 * Database Types - Gerados a partir do schema do Supabase
 * CCB Espaço Infantil
 * 
 * Estes tipos são sincronizados com o banco de dados PostgreSQL
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      igrejas: {
        Row: {
          id: string;
          nome: string;
          data_cadastro: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          data_cadastro?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          data_cadastro?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          id: string;
          igreja_id: string;
          capacidade_maxima: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          igreja_id: string;
          capacidade_maxima?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          igreja_id?: string;
          capacidade_maxima?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_settings_igreja';
            columns: ['igreja_id'];
            referencedRelation: 'igrejas';
            referencedColumns: ['id'];
          }
        ];
      };
      children: {
        Row: {
          id: string;
          igreja_id: string;
          nome: string;
          nome_responsavel: string;
          tipo_responsavel: 'pai' | 'mae' | 'outro';
          celular_responsavel: string;
          observacoes: string | null;
          hora_entrada: string;
          is_chamado_ativo: boolean;
          data_cadastro: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          igreja_id: string;
          nome: string;
          nome_responsavel: string;
          tipo_responsavel: 'pai' | 'mae' | 'outro';
          celular_responsavel: string;
          observacoes?: string | null;
          hora_entrada: string;
          is_chamado_ativo?: boolean;
          data_cadastro?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          igreja_id?: string;
          nome?: string;
          nome_responsavel?: string;
          tipo_responsavel?: 'pai' | 'mae' | 'outro';
          celular_responsavel?: string;
          observacoes?: string | null;
          hora_entrada?: string;
          is_chamado_ativo?: boolean;
          data_cadastro?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_children_igreja';
            columns: ['igreja_id'];
            referencedRelation: 'igrejas';
            referencedColumns: ['id'];
          }
        ];
      };
      culto_observacoes: {
        Row: {
          id: string;
          igreja_id: string;
          data: string;
          palavra_lida: string | null;
          hinos_cantados: string | null;
          aprendizado: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          igreja_id: string;
          data?: string;
          palavra_lida?: string | null;
          hinos_cantados?: string | null;
          aprendizado?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          igreja_id?: string;
          data?: string;
          palavra_lida?: string | null;
          hinos_cantados?: string | null;
          aprendizado?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_culto_observacoes_igreja';
            columns: ['igreja_id'];
            referencedRelation: 'igrejas';
            referencedColumns: ['id'];
          }
        ];
      };
      historico_cultos: {
        Row: {
          id: string;
          igreja_id: string;
          data: string;
          palavra_lida: string | null;
          hinos_cantados: string | null;
          aprendizado: string | null;
          total_criancas: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          igreja_id: string;
          data: string;
          palavra_lida?: string | null;
          hinos_cantados?: string | null;
          aprendizado?: string | null;
          total_criancas?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          igreja_id?: string;
          data?: string;
          palavra_lida?: string | null;
          hinos_cantados?: string | null;
          aprendizado?: string | null;
          total_criancas?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_historico_cultos_igreja';
            columns: ['igreja_id'];
            referencedRelation: 'igrejas';
            referencedColumns: ['id'];
          }
        ];
      };
      dias_uso: {
        Row: {
          id: string;
          igreja_id: string;
          data: string;
          total_criancas: number;
          culto_realizado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          igreja_id: string;
          data: string;
          total_criancas?: number;
          culto_realizado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          igreja_id?: string;
          data?: string;
          total_criancas?: number;
          culto_realizado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_dias_uso_igreja';
            columns: ['igreja_id'];
            referencedRelation: 'igrejas';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      v_criancas_hoje: {
        Row: {
          igreja_id: string | null;
          igreja_nome: string | null;
          total_criancas: number | null;
          capacidade_maxima: number | null;
          percentual_ocupacao: number | null;
          chamados_ativos: number | null;
        };
      };
      v_estatisticas_igreja: {
        Row: {
          igreja_id: string | null;
          igreja_nome: string | null;
          total_cultos_realizados: number | null;
          total_dias_uso: number | null;
          media_criancas_por_culto: number | null;
          max_criancas_culto: number | null;
        };
      };
    };
    Functions: {
      get_criancas_por_data: {
        Args: {
          p_igreja_id: string;
          p_data: string;
        };
        Returns: {
          nome: string;
          nome_responsavel: string;
          celular_responsavel: string;
          hora_entrada: string;
          is_chamado_ativo: boolean;
        }[];
      };
      get_estatisticas_igreja: {
        Args: {
          p_igreja_id: string;
        };
        Returns: {
          total_cultos: number;
          total_dias_uso: number;
          media_criancas: number;
          max_criancas: number;
          ultimo_culto: string;
        }[];
      };
    };
    Enums: {
      tipo_responsavel_enum: 'pai' | 'mae' | 'outro';
    };
  };
}

// Tipos auxiliares para facilitar o uso
export type Igreja = Database['public']['Tables']['igrejas']['Row'];
export type IgrejaInsert = Database['public']['Tables']['igrejas']['Insert'];
export type IgrejaUpdate = Database['public']['Tables']['igrejas']['Update'];

export type Settings = Database['public']['Tables']['settings']['Row'];
export type SettingsInsert = Database['public']['Tables']['settings']['Insert'];
export type SettingsUpdate = Database['public']['Tables']['settings']['Update'];

export type Child = Database['public']['Tables']['children']['Row'];
export type ChildInsert = Database['public']['Tables']['children']['Insert'];
export type ChildUpdate = Database['public']['Tables']['children']['Update'];

export type CultoObservacoes = Database['public']['Tables']['culto_observacoes']['Row'];
export type CultoObservacoesInsert = Database['public']['Tables']['culto_observacoes']['Insert'];
export type CultoObservacoesUpdate = Database['public']['Tables']['culto_observacoes']['Update'];

export type HistoricoCulto = Database['public']['Tables']['historico_cultos']['Row'];
export type HistoricoCultoInsert = Database['public']['Tables']['historico_cultos']['Insert'];
export type HistoricoCultoUpdate = Database['public']['Tables']['historico_cultos']['Update'];

export type DiaUso = Database['public']['Tables']['dias_uso']['Row'];
export type DiaUsoInsert = Database['public']['Tables']['dias_uso']['Insert'];
export type DiaUsoUpdate = Database['public']['Tables']['dias_uso']['Update'];

// Tipos das Views
export type CriancasHoje = Database['public']['Views']['v_criancas_hoje']['Row'];
export type EstatisticasIgreja = Database['public']['Views']['v_estatisticas_igreja']['Row'];

// Tipo para responsável
export type TipoResponsavel = Database['public']['Enums']['tipo_responsavel_enum'];

