/**
 * Vercel Serverless Function: Igrejas
 * Endpoint: /api/igrejas
 */

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Listar igrejas
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('igrejas')
        .select('*')
        .order('nome');

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        total: data?.length || 0,
      });
    }

    // POST - Criar igreja
    if (req.method === 'POST') {
      const { nome } = req.body;

      if (!nome || nome.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Nome da igreja é obrigatório',
        });
      }

      // Inserir igreja
      const { data: igreja, error } = await supabase
        .from('igrejas')
        .insert({ nome: nome.trim() })
        .select()
        .single();

      if (error) throw error;

      // Criar settings padrão
      await supabase.from('settings').insert({
        igreja_id: igreja.id,
        capacidade_maxima: 30,
      });

      return res.status(201).json({
        success: true,
        data: igreja,
        message: 'Igreja cadastrada com sucesso',
      });
    }

    // Método não permitido
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });

  } catch (error) {
    console.error('Erro na API igrejas:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor',
    });
  }
};

