/**
 * API Route: Gerenciar Emergência de Criança
 * Endpoint: /api/children/[id]/emergencia
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';

// Configuração para o runtime do Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    // Verificação robusta dos parâmetros
    if (!params || !params.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID da criança é obrigatório',
        },
        { status: 400 }
      );
    }

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

    // @ts-ignore - Tipos do Supabase não reconhecem update corretamente
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

