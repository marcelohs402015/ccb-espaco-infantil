/**
 * Supabase Client Configuration
 * CCB Espaço Infantil
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Validar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Erro: Variáveis de ambiente do Supabase não configuradas!\n' +
    'Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local'
  );
}

if (supabaseUrl === 'sua-url-aqui' || supabaseAnonKey === 'sua-chave-anon-aqui') {
  console.warn(
    '⚠️  Aviso: Variáveis de ambiente do Supabase ainda não foram preenchidas!\n' +
    'Edite o arquivo .env.local com suas credenciais reais do Supabase.'
  );
}

/**
 * Cliente Supabase configurado com tipos TypeScript
 * 
 * @example
 * ```typescript
 * import { supabase } from '@/lib/supabase';
 * 
 * // Buscar todas as igrejas
 * const { data, error } = await supabase
 *   .from('igrejas')
 *   .select('*');
 * ```
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'ccb-espaco-infantil',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper: Verificar se o cliente Supabase está configurado
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    supabaseUrl !== 'sua-url-aqui' && 
    supabaseAnonKey !== 'sua-chave-anon-aqui' &&
    supabaseUrl !== undefined &&
    supabaseAnonKey !== undefined
  );
};

/**
 * Helper: Tratamento de erros do Supabase
 */
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'Erro desconhecido';
  
  // Erros comuns do PostgreSQL
  const errorMessages: Record<string, string> = {
    '23505': 'Este registro já existe no banco de dados',
    '23503': 'Não é possível excluir este registro pois ele está sendo usado',
    '23502': 'Campo obrigatório não preenchido',
    '42P01': 'Tabela não encontrada. Execute o migration.sql no Supabase',
    '42703': 'Coluna não encontrada no banco de dados',
  };

  // Verificar código de erro do PostgreSQL
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  // Retornar mensagem do erro
  return error.message || error.hint || 'Erro ao comunicar com o banco de dados';
};

/**
 * Helper: Log de queries para desenvolvimento
 */
export const logQuery = (table: string, action: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Supabase Query: ${action.toUpperCase()} on ${table}`, data || '');
  }
};

// Exportar tipos úteis
export type SupabaseClient = typeof supabase;
export type SupabaseError = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
};

