/**
 * API Route: Gerenciar Emergência de Criança
 * Endpoint: /api/children/[id]/emergencia
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';

/**
 * POST /api/children/[id]/emergencia
 * Ativar chamado de emergência
 * Body: { ativar: boolean }
 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { ativar } = await request.json();

    if (typeof ativar !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Campo "ativar" deve ser boolean',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('children')
      .update({ is_chamado_ativo: ativar })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: ativar 
        ? '🚨 Emergência ativada! Responsável deve ser chamado.' 
        : '✅ Emergência desativada.',
    });
  } catch (error) {
    console.error('Erro ao atualizar emergência:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: handleSupabaseError(error),
      },
      { status: 500 }
    );
  }
};

