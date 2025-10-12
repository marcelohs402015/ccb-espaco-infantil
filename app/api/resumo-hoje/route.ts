/**
 * API Route: Resumo do Dia
 * Endpoint: /api/resumo-hoje
 */

import { NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * GET /api/resumo-hoje
 * Buscar resumo de todas as igrejas hoje (usando View)
 */
export const GET = async () => {
  try {
    // @ts-ignore - v_criancas_hoje é uma VIEW que não está nos tipos gerados
    const { data, error } = await supabase.from('v_criancas_hoje').select('*').order('igreja_nome');

    if (error) {
      throw error;
    }

    // Calcular totais
    const totais = {
      total_igrejas: data?.length || 0,
      // @ts-ignore - VIEW tem estrutura diferente das tabelas
      total_criancas: data?.reduce((sum, item) => sum + (item.total_criancas || 0), 0) || 0,
      // @ts-ignore - VIEW tem estrutura diferente das tabelas
      total_chamados_ativos: data?.reduce((sum, item) => sum + (item.chamados_ativos || 0), 0) || 0,
    };

    return NextResponse.json({
      success: true,
      data,
      totais,
    });
  } catch (error) {
    console.error('Erro ao buscar resumo:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: handleSupabaseError(error),
      },
      { status: 500 }
    );
  }
};

