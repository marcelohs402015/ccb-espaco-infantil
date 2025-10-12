/**
 * API Route: Gerenciar Criança Individual
 * Endpoint: /api/children/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { ChildUpdate } from '@/types/database.types';

/**
 * GET /api/children/[id]
 * Buscar criança por ID
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Criança não encontrada',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Erro ao buscar criança:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: handleSupabaseError(error),
      },
      { status: 500 }
    );
  }
};

/**
 * PATCH /api/children/[id]
 * Atualizar criança
 */
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body: ChildUpdate = await request.json();

    // Validar tipo_responsavel se fornecido
    if (body.tipo_responsavel && !['pai', 'mae', 'outro'].includes(body.tipo_responsavel)) {
      return NextResponse.json(
        {
          success: false,
          error: 'tipo_responsavel deve ser: pai, mae ou outro',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('children')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Criança atualizada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar criança:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: handleSupabaseError(error),
      },
      { status: 500 }
    );
  }
};

/**
 * DELETE /api/children/[id]
 * Remover criança
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Criança removida com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover criança:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: handleSupabaseError(error),
      },
      { status: 500 }
    );
  }
};

