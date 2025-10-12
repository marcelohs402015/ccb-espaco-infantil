-- ============================================================
-- QUERIES ÚTEIS PARA O CCB ESPAÇO INFANTIL
-- ============================================================

-- ============================================================
-- CONSULTAS BÁSICAS
-- ============================================================

-- 1. Listar todas as igrejas cadastradas
SELECT 
  id,
  nome,
  data_cadastro,
  TO_CHAR(data_cadastro, 'DD/MM/YYYY HH24:MI') AS data_formatada
FROM igrejas
ORDER BY nome;

-- 2. Ver configurações de todas as igrejas
SELECT 
  i.nome AS igreja,
  s.capacidade_maxima
FROM igrejas i
LEFT JOIN settings s ON i.id = s.igreja_id
ORDER BY i.nome;

-- 3. Contar total de crianças cadastradas hoje por igreja
SELECT 
  i.nome AS igreja,
  COUNT(c.id) AS total_criancas_hoje
FROM igrejas i
LEFT JOIN children c ON i.id = c.igreja_id AND c.data_cadastro = CURRENT_DATE
GROUP BY i.id, i.nome
ORDER BY total_criancas_hoje DESC;

-- ============================================================
-- CONSULTAS DE CRIANÇAS
-- ============================================================

-- 4. Listar todas as crianças presentes hoje
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.nome_responsavel AS responsavel,
  c.tipo_responsavel,
  c.celular_responsavel,
  c.hora_entrada,
  c.observacoes,
  CASE 
    WHEN c.is_chamado_ativo THEN '🚨 SIM' 
    ELSE '✅ NÃO' 
  END AS emergencia_ativa
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.data_cadastro = CURRENT_DATE
ORDER BY i.nome, c.hora_entrada;

-- 5. Buscar criança por nome (case insensitive)
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.nome_responsavel,
  c.celular_responsavel,
  c.data_cadastro
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE LOWER(c.nome) LIKE LOWER('%nome_da_crianca%')
ORDER BY c.data_cadastro DESC;

-- 6. Crianças com chamado de emergência ativo
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.nome_responsavel AS responsavel,
  c.celular_responsavel AS telefone,
  c.hora_entrada,
  c.updated_at AS momento_chamado
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.is_chamado_ativo = TRUE
ORDER BY c.updated_at DESC;

-- 7. Histórico de presença de uma criança específica
SELECT 
  data_cadastro,
  hora_entrada,
  observacoes,
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') AS data_hora_cadastro
FROM children
WHERE nome = 'Nome da Criança'
ORDER BY data_cadastro DESC
LIMIT 10;

-- ============================================================
-- CONSULTAS DE CAPACIDADE E OCUPAÇÃO
-- ============================================================

-- 8. Verificar capacidade atual vs máxima
SELECT 
  i.nome AS igreja,
  COUNT(c.id) AS criancas_presentes,
  s.capacidade_maxima,
  (s.capacidade_maxima - COUNT(c.id)) AS vagas_disponiveis,
  ROUND((COUNT(c.id)::NUMERIC / s.capacidade_maxima) * 100, 2) AS percentual_ocupacao,
  CASE 
    WHEN COUNT(c.id) >= s.capacidade_maxima THEN '🔴 LOTADO'
    WHEN COUNT(c.id) >= s.capacidade_maxima * 0.8 THEN '🟡 QUASE CHEIO'
    ELSE '🟢 DISPONÍVEL'
  END AS status
FROM igrejas i
LEFT JOIN children c ON i.id = c.igreja_id AND c.data_cadastro = CURRENT_DATE
LEFT JOIN settings s ON i.id = s.igreja_id
GROUP BY i.id, i.nome, s.capacidade_maxima
ORDER BY percentual_ocupacao DESC;

-- 9. Histórico de ocupação (últimos 30 dias)
SELECT 
  i.nome AS igreja,
  du.data,
  du.total_criancas,
  s.capacidade_maxima,
  ROUND((du.total_criancas::NUMERIC / s.capacidade_maxima) * 100, 2) AS percentual,
  CASE 
    WHEN du.culto_realizado THEN '✅ SIM' 
    ELSE '❌ NÃO' 
  END AS teve_culto
FROM dias_uso du
INNER JOIN igrejas i ON du.igreja_id = i.id
LEFT JOIN settings s ON i.id = s.igreja_id
WHERE du.data >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY du.data DESC, i.nome;

-- ============================================================
-- CONSULTAS DE CULTO
-- ============================================================

-- 10. Observações do culto de hoje
SELECT 
  i.nome AS igreja,
  co.data,
  co.palavra_lida,
  co.hinos_cantados,
  co.aprendizado
FROM culto_observacoes co
INNER JOIN igrejas i ON co.igreja_id = i.id
WHERE co.data = CURRENT_DATE
ORDER BY i.nome;

-- 11. Histórico de cultos (últimos 10)
SELECT 
  i.nome AS igreja,
  hc.data,
  hc.palavra_lida,
  hc.hinos_cantados,
  hc.total_criancas,
  TO_CHAR(hc.data, 'DD/MM/YYYY') AS data_formatada
FROM historico_cultos hc
INNER JOIN igrejas i ON hc.igreja_id = i.id
ORDER BY hc.data DESC, i.nome
LIMIT 10;

-- 12. Cultos por mês
SELECT 
  i.nome AS igreja,
  TO_CHAR(hc.data, 'MM/YYYY') AS mes_ano,
  COUNT(*) AS total_cultos,
  ROUND(AVG(hc.total_criancas), 2) AS media_criancas,
  MAX(hc.total_criancas) AS max_criancas,
  MIN(hc.total_criancas) AS min_criancas
FROM historico_cultos hc
INNER JOIN igrejas i ON hc.igreja_id = i.id
GROUP BY i.id, i.nome, TO_CHAR(hc.data, 'MM/YYYY')
ORDER BY TO_CHAR(hc.data, 'MM/YYYY') DESC, i.nome;

-- ============================================================
-- ESTATÍSTICAS E RELATÓRIOS
-- ============================================================

-- 13. Estatísticas gerais por igreja
SELECT 
  i.nome AS igreja,
  COUNT(DISTINCT hc.data) AS total_cultos,
  COUNT(DISTINCT du.data) AS total_dias_uso,
  COALESCE(ROUND(AVG(hc.total_criancas), 2), 0) AS media_criancas_culto,
  COALESCE(MAX(hc.total_criancas), 0) AS recorde_criancas,
  TO_CHAR(MAX(hc.data), 'DD/MM/YYYY') AS ultimo_culto
FROM igrejas i
LEFT JOIN historico_cultos hc ON i.id = hc.igreja_id
LEFT JOIN dias_uso du ON i.id = du.igreja_id
GROUP BY i.id, i.nome
ORDER BY total_cultos DESC;

-- 14. Ranking de dias com mais crianças
SELECT 
  i.nome AS igreja,
  du.data,
  du.total_criancas,
  TO_CHAR(du.data, 'TMDay, DD/MM/YYYY', 'pt_BR') AS dia_semana_data
FROM dias_uso du
INNER JOIN igrejas i ON du.igreja_id = i.id
ORDER BY du.total_criancas DESC, du.data DESC
LIMIT 10;

-- 15. Responsáveis mais frequentes
SELECT 
  igreja_id,
  nome_responsavel,
  COUNT(*) AS vezes_trouxe_crianca,
  COUNT(DISTINCT nome) AS criancas_diferentes,
  MAX(data_cadastro) AS ultima_visita
FROM children
GROUP BY igreja_id, nome_responsavel
HAVING COUNT(*) > 1
ORDER BY vezes_trouxe_crianca DESC
LIMIT 20;

-- ============================================================
-- MANUTENÇÃO E LIMPEZA
-- ============================================================

-- 16. Remover crianças de datas antigas (exemplo: mais de 90 dias)
-- ⚠️ CUIDADO: Esta query DELETA dados!
-- DELETE FROM children 
-- WHERE data_cadastro < CURRENT_DATE - INTERVAL '90 days';

-- 17. Arquivar dados antigos (criar tabela de arquivo primeiro)
-- CREATE TABLE children_arquivo AS SELECT * FROM children WHERE 1=0;
-- 
-- INSERT INTO children_arquivo 
-- SELECT * FROM children 
-- WHERE data_cadastro < CURRENT_DATE - INTERVAL '180 days';
-- 
-- DELETE FROM children 
-- WHERE data_cadastro < CURRENT_DATE - INTERVAL '180 days';

-- 18. Ver tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================
-- AUDITORIA E MONITORAMENTO
-- ============================================================

-- 19. Últimas alterações em crianças
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.created_at AS criado_em,
  c.updated_at AS atualizado_em,
  CASE 
    WHEN c.created_at = c.updated_at THEN 'Criado'
    ELSE 'Atualizado'
  END AS tipo_operacao
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.data_cadastro = CURRENT_DATE
ORDER BY c.updated_at DESC
LIMIT 20;

-- 20. Verificar integridade referencial
SELECT 
  'children sem igreja' AS problema,
  COUNT(*) AS quantidade
FROM children c
LEFT JOIN igrejas i ON c.igreja_id = i.id
WHERE i.id IS NULL

UNION ALL

SELECT 
  'settings sem igreja' AS problema,
  COUNT(*) AS quantidade
FROM settings s
LEFT JOIN igrejas i ON s.igreja_id = i.id
WHERE i.id IS NULL

UNION ALL

SELECT 
  'culto_observacoes sem igreja' AS problema,
  COUNT(*) AS quantidade
FROM culto_observacoes co
LEFT JOIN igrejas i ON co.igreja_id = i.id
WHERE i.id IS NULL;

-- ============================================================
-- EXPORTAÇÃO DE DADOS
-- ============================================================

-- 21. Exportar lista de crianças de hoje (formato CSV)
-- Use o botão "Download CSV" no Supabase após executar:
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.nome_responsavel AS responsavel,
  c.tipo_responsavel,
  c.celular_responsavel AS telefone,
  TO_CHAR(c.hora_entrada, 'HH24:MI') AS hora_entrada,
  c.observacoes
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.data_cadastro = CURRENT_DATE
ORDER BY i.nome, c.hora_entrada;

-- 22. Relatório mensal completo
SELECT 
  i.nome AS igreja,
  TO_CHAR(du.data, 'DD/MM/YYYY') AS data,
  du.total_criancas,
  CASE WHEN du.culto_realizado THEN 'Sim' ELSE 'Não' END AS teve_culto,
  hc.palavra_lida,
  hc.hinos_cantados
FROM dias_uso du
INNER JOIN igrejas i ON du.igreja_id = i.id
LEFT JOIN historico_cultos hc ON du.igreja_id = hc.igreja_id AND du.data = hc.data
WHERE du.data >= DATE_TRUNC('month', CURRENT_DATE)
  AND du.data < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY du.data DESC, i.nome;

-- ============================================================
-- FUNÇÕES AUXILIARES
-- ============================================================

-- 23. Criar função para buscar crianças de uma igreja em uma data
CREATE OR REPLACE FUNCTION get_criancas_por_data(
  p_igreja_id UUID,
  p_data DATE
)
RETURNS TABLE (
  nome VARCHAR,
  nome_responsavel VARCHAR,
  celular_responsavel VARCHAR,
  hora_entrada TIME,
  is_chamado_ativo BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.nome,
    c.nome_responsavel,
    c.celular_responsavel,
    c.hora_entrada,
    c.is_chamado_ativo
  FROM children c
  WHERE c.igreja_id = p_igreja_id
    AND c.data_cadastro = p_data
  ORDER BY c.hora_entrada;
END;
$$ LANGUAGE plpgsql;

-- Uso: SELECT * FROM get_criancas_por_data('UUID-DA-IGREJA', '2025-10-11');

-- 24. Criar função para calcular estatísticas de uma igreja
CREATE OR REPLACE FUNCTION get_estatisticas_igreja(p_igreja_id UUID)
RETURNS TABLE (
  total_cultos BIGINT,
  total_dias_uso BIGINT,
  media_criancas NUMERIC,
  max_criancas INTEGER,
  ultimo_culto DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT hc.data) AS total_cultos,
    COUNT(DISTINCT du.data) AS total_dias_uso,
    COALESCE(ROUND(AVG(hc.total_criancas), 2), 0) AS media_criancas,
    COALESCE(MAX(hc.total_criancas), 0) AS max_criancas,
    MAX(hc.data) AS ultimo_culto
  FROM igrejas i
  LEFT JOIN historico_cultos hc ON i.id = hc.igreja_id
  LEFT JOIN dias_uso du ON i.id = du.igreja_id
  WHERE i.id = p_igreja_id
  GROUP BY i.id;
END;
$$ LANGUAGE plpgsql;

-- Uso: SELECT * FROM get_estatisticas_igreja('UUID-DA-IGREJA');

-- ============================================================
-- BACKUP E RESTORE
-- ============================================================

-- 25. Para fazer backup via psql (execute no terminal, não no Supabase):
-- pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres -t igrejas -t children -t settings -t culto_observacoes -t historico_cultos -t dias_uso > backup.sql

-- 26. Para restaurar backup via psql:
-- psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql

-- ============================================================
-- QUERIES DE PERFORMANCE
-- ============================================================

-- 27. Analisar queries lentas (requer extensão pg_stat_statements)
-- SELECT 
--   query,
--   calls,
--   total_time,
--   mean_time,
--   max_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- 28. Ver índices utilizados
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan AS total_scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ============================================================
-- FIM DO ARQUIVO
-- ============================================================

