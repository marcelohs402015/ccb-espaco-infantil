/**
 * Vercel Serverless Function: Resumo Hoje
 * Endpoint: /api/resumo-hoje
 */

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { data, error } = await supabase
      .from('v_criancas_hoje')
      .select('*')
      .order('igreja_nome');

    if (error) throw error;

    const totais = {
      total_igrejas: data?.length || 0,
      total_criancas: data?.reduce((sum, item) => sum + (item.total_criancas || 0), 0) || 0,
      total_chamados_ativos: data?.reduce((sum, item) => sum + (item.chamados_ativos || 0), 0) || 0,
    };

    return res.status(200).json({
      success: true,
      data,
      totais,
    });

  } catch (error) {
    console.error('Erro na API resumo-hoje:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor',
    });
  }
};

