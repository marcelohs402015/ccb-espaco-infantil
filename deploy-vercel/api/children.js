/**
 * Vercel Serverless Function: Children
 * Endpoint: /api/children
 */

const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Listar crianças
    if (req.method === 'GET') {
      const { igreja_id, data: dataParam, id } = req.query;

      // GET por ID específico
      if (id) {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return res.status(404).json({
              success: false,
              error: 'Criança não encontrada',
            });
          }
          throw error;
        }

        return res.status(200).json({
          success: true,
          data,
        });
      }

      // GET lista
      if (!igreja_id) {
        return res.status(400).json({
          success: false,
          error: 'igreja_id é obrigatório',
        });
      }

      const dataFiltro = dataParam || new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('igreja_id', igreja_id)
        .eq('data_cadastro', dataFiltro)
        .order('hora_entrada');

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        total: data?.length || 0,
      });
    }

    // POST - Criar criança
    if (req.method === 'POST') {
      const { igreja_id, nome, nome_responsavel, tipo_responsavel, celular_responsavel, observacoes, hora_entrada } = req.body;

      // Validações
      if (!igreja_id || !nome || !nome_responsavel || !tipo_responsavel || !celular_responsavel || !hora_entrada) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios faltando',
        });
      }

      const { data, error } = await supabase
        .from('children')
        .insert({
          igreja_id,
          nome,
          nome_responsavel,
          tipo_responsavel,
          celular_responsavel,
          observacoes: observacoes || '',
          hora_entrada,
          is_chamado_ativo: false,
          data_cadastro: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data,
        message: 'Criança cadastrada com sucesso',
      });
    }

    // PATCH - Atualizar criança
    if (req.method === 'PATCH') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID é obrigatório',
        });
      }

      const { data, error } = await supabase
        .from('children')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
        message: 'Criança atualizada com sucesso',
      });
    }

    // DELETE - Remover criança
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID é obrigatório',
        });
      }

      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Criança removida com sucesso',
      });
    }

    // Método não permitido
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });

  } catch (error) {
    console.error('Erro na API children:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor',
    });
  }
};

