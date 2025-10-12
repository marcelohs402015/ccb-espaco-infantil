/**
 * API Route: Gerenciar Igrejas
 * Endpoint: /api/igrejas
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { TablesInsert } from '@/types/database.types';

// Configuração para o runtime do Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type IgrejaInsert = TablesInsert<'igrejas'>;

/**
 * GET /api/igrejas
 * Listar todas as igrejas
 */
export const GET = async () => {
  try {
    const { data, error } = await supabase
      .from('igrejas')
      .select('*')
      .order('nome');

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Erro ao buscar igrejas:', error);
    
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
 * POST /api/igrejas
 * Criar nova igreja
 * 
 * Body: { nome: string }
 */
export const POST = async (request: NextRequest) => {
  try {
    const body: IgrejaInsert = await request.json();

    // Validação básica
    if (!body.nome || body.nome.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nome da igreja é obrigatório',
        },
        { status: 400 }
      );
    }

    // Inserir no banco
    const { data, error } = await supabase
      .from('igrejas')
      .insert({
        nome: body.nome.trim(),
        data_cadastro: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Criar configurações padrão para a igreja
    const { error: settingsError } = await supabase
      .from('settings')
      .insert({
        igreja_id: data.id,
        capacidade_maxima: 30,
      });

    if (settingsError) {
      console.error('Erro ao criar settings:', settingsError);
      // Não falha, apenas loga
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Igreja cadastrada com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar igreja:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: handleSupabaseError(error),
      },
      { status: 500 }
    );
  }
};

