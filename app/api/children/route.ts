/**
 * API Route: Gerenciar Crianças
 * Endpoint: /api/children
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { ChildInsert } from '@/types/database.types';

/**
 * GET /api/children
 * Listar crianças
 * Query params: igreja_id, data (opcional)
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const igrejaId = searchParams.get('igreja_id');
    const data = searchParams.get('data') || new Date().toISOString().split('T')[0];

    if (!igrejaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'igreja_id é obrigatório',
        },
        { status: 400 }
      );
    }

    const { data: children, error } = await supabase
      .from('children')
      .select('*')
      .eq('igreja_id', igrejaId)
      .eq('data_cadastro', data)
      .order('hora_entrada');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: children,
      total: children?.length || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar crianças:', error);
    
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
 * POST /api/children
 * Cadastrar nova criança
 */
export const POST = async (request: NextRequest) => {
  try {
    const body: ChildInsert = await request.json();

    // Validações
    const requiredFields = ['igreja_id', 'nome', 'nome_responsavel', 'tipo_responsavel', 'celular_responsavel', 'hora_entrada'];
    const missingFields = requiredFields.filter(field => !body[field as keyof ChildInsert]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validar tipo_responsavel
    if (!['pai', 'mae', 'outro'].includes(body.tipo_responsavel)) {
      return NextResponse.json(
        {
          success: false,
          error: 'tipo_responsavel deve ser: pai, mae ou outro',
        },
        { status: 400 }
      );
    }

    // Inserir criança
    const { data, error } = await supabase
      .from('children')
      .insert({
        ...body,
        data_cadastro: body.data_cadastro || new Date().toISOString().split('T')[0],
        is_chamado_ativo: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Criança cadastrada com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao cadastrar criança:', error);
    
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
 * DELETE /api/children?id=xxx
 * Remover criança
 */
export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'id é obrigatório',
        },
        { status: 400 }
      );
    }

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

