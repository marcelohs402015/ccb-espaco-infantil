-- ============================================================
-- DADOS DE EXEMPLO PARA TESTE
-- CCB ESPAÇO INFANTIL
-- ============================================================
-- Este arquivo contém dados de exemplo para popular o banco
-- e testar o sistema antes de migrar dados reais.
-- ============================================================

-- ⚠️ ATENÇÃO: Execute este script apenas em ambiente de TESTE!
-- ⚠️ Não execute em produção com dados reais!

-- ============================================================
-- LIMPAR DADOS EXISTENTES (OPCIONAL - DESCOMENTAR SE NECESSÁRIO)
-- ============================================================
-- TRUNCATE TABLE dias_uso CASCADE;
-- TRUNCATE TABLE historico_cultos CASCADE;
-- TRUNCATE TABLE culto_observacoes CASCADE;
-- TRUNCATE TABLE children CASCADE;
-- TRUNCATE TABLE settings CASCADE;
-- TRUNCATE TABLE igrejas CASCADE;

-- ============================================================
-- INSERIR IGREJAS DE EXEMPLO
-- ============================================================

-- Igreja 1: Central
INSERT INTO igrejas (id, nome, data_cadastro) VALUES
('11111111-1111-1111-1111-111111111111', 'Igreja CCB - Central', '2025-01-15 10:00:00'),
('22222222-2222-2222-2222-222222222222', 'Igreja CCB - Jardim das Flores', '2025-02-20 14:30:00'),
('33333333-3333-3333-3333-333333333333', 'Igreja CCB - Vila Nova', '2025-03-10 09:15:00');

-- ============================================================
-- INSERIR CONFIGURAÇÕES DAS IGREJAS
-- ============================================================

INSERT INTO settings (igreja_id, capacidade_maxima) VALUES
('11111111-1111-1111-1111-111111111111', 30),
('22222222-2222-2222-2222-222222222222', 25),
('33333333-3333-3333-3333-333333333333', 40);

-- ============================================================
-- INSERIR CRIANÇAS DE HOJE
-- ============================================================

-- Crianças da Igreja Central
INSERT INTO children (
  igreja_id, 
  nome, 
  nome_responsavel, 
  tipo_responsavel, 
  celular_responsavel, 
  observacoes, 
  hora_entrada, 
  is_chamado_ativo,
  data_cadastro
) VALUES
-- Igreja Central (5 crianças)
(
  '11111111-1111-1111-1111-111111111111',
  'João Pedro Silva',
  'Maria Silva',
  'mae',
  '(11) 98765-4321',
  'Primeira vez no espaço infantil. Criança tranquila.',
  '19:00:00',
  FALSE,
  CURRENT_DATE
),
(
  '11111111-1111-1111-1111-111111111111',
  'Ana Beatriz Santos',
  'José Santos',
  'pai',
  '(11) 99876-5432',
  'Alérgica a amendoim. Gosta de desenhar.',
  '19:05:00',
  FALSE,
  CURRENT_DATE
),
(
  '11111111-1111-1111-1111-111111111111',
  'Lucas Oliveira',
  'Carla Oliveira',
  'mae',
  '(11) 97654-3210',
  'Muito ativo. Adora histórias bíblicas.',
  '19:10:00',
  FALSE,
  CURRENT_DATE
),
(
  '11111111-1111-1111-1111-111111111111',
  'Sofia Rodrigues',
  'Ana Rodrigues',
  'mae',
  '(11) 96543-2109',
  'Tímida no início. Aprende rápido.',
  '19:15:00',
  FALSE,
  CURRENT_DATE
),
(
  '11111111-1111-1111-1111-111111111111',
  'Gabriel Costa',
  'Carlos Costa',
  'outro',
  '(11) 95432-1098',
  'Avô trouxe. Criança educada.',
  '19:20:00',
  FALSE,
  CURRENT_DATE
),

-- Igreja Jardim das Flores (3 crianças)
(
  '22222222-2222-2222-2222-222222222222',
  'Maria Clara Alves',
  'Juliana Alves',
  'mae',
  '(21) 98765-1234',
  'Segunda vez aqui. Muito participativa.',
  '19:00:00',
  FALSE,
  CURRENT_DATE
),
(
  '22222222-2222-2222-2222-222222222222',
  'Pedro Henrique Lima',
  'Roberto Lima',
  'pai',
  '(21) 97654-2345',
  'Gosta de cantar. Conhece vários hinos.',
  '19:10:00',
  FALSE,
  CURRENT_DATE
),
(
  '22222222-2222-2222-2222-222222222222',
  'Isabella Ferreira',
  'Paula Ferreira',
  'mae',
  '(21) 96543-3456',
  'Muito curiosa. Faz muitas perguntas.',
  '19:15:00',
  FALSE,
  CURRENT_DATE
),

-- Igreja Vila Nova (4 crianças)
(
  '33333333-3333-3333-3333-333333333333',
  'Matheus Souza',
  'Fernanda Souza',
  'mae',
  '(19) 98765-5678',
  'Irmão mais velho da Laura.',
  '19:00:00',
  FALSE,
  CURRENT_DATE
),
(
  '33333333-3333-3333-3333-333333333333',
  'Laura Souza',
  'Fernanda Souza',
  'mae',
  '(19) 98765-5678',
  'Irmã mais nova do Matheus.',
  '19:00:00',
  FALSE,
  CURRENT_DATE
),
(
  '33333333-3333-3333-3333-333333333333',
  'Rafael Martins',
  'Claudio Martins',
  'pai',
  '(19) 97654-6789',
  'Criança calma. Gosta de colorir.',
  '19:05:00',
  FALSE,
  CURRENT_DATE
),
(
  '33333333-3333-3333-3333-333333333333',
  'Beatriz Pereira',
  'Márcia Pereira',
  'mae',
  '(19) 96543-7890',
  'Primeira visita. Um pouco tímida.',
  '19:15:00',
  FALSE,
  CURRENT_DATE
);

-- ============================================================
-- INSERIR OBSERVAÇÕES DO CULTO DE HOJE
-- ============================================================

INSERT INTO culto_observacoes (igreja_id, data, palavra_lida, hinos_cantados, aprendizado) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE,
  'João 3:16 - "Porque Deus amou o mundo de tal maneira..."',
  '15, 234, 456',
  'O amor de Deus pela humanidade. Explicamos às crianças que Deus nos ama incondicionalmente.'
),
(
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE,
  'Salmo 23 - "O Senhor é o meu pastor..."',
  '23, 145, 367',
  'Deus cuida de nós como um pastor cuida de suas ovelhas.'
),
(
  '33333333-3333-3333-3333-333333333333',
  CURRENT_DATE,
  'Mateus 19:14 - "Deixai vir a mim as criancinhas..."',
  '12, 89, 234',
  'Jesus ama as crianças e quer que elas se aproximem Dele.'
);

-- ============================================================
-- INSERIR HISTÓRICO DE CULTOS (ÚLTIMOS 7 DIAS)
-- ============================================================

-- Igreja Central - Histórico
INSERT INTO historico_cultos (igreja_id, data, palavra_lida, hinos_cantados, aprendizado, total_criancas) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE - INTERVAL '7 days',
  'Gênesis 1:1 - No princípio criou Deus...',
  '1, 45, 123',
  'A criação do mundo por Deus',
  8
),
(
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE - INTERVAL '6 days',
  'Êxodo 20:1-17 - Os Dez Mandamentos',
  '56, 78, 234',
  'Obedecer aos mandamentos de Deus',
  10
),
(
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE - INTERVAL '3 days',
  'Provérbios 3:5-6 - Confia no Senhor',
  '89, 145, 267',
  'Confiar em Deus em todas as situações',
  12
),

-- Igreja Jardim das Flores - Histórico
(
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE - INTERVAL '7 days',
  'Daniel 3 - Os três jovens na fornalha',
  '34, 67, 156',
  'Coragem e fidelidade a Deus',
  6
),
(
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE - INTERVAL '4 days',
  'Jonas - O profeta e o grande peixe',
  '23, 89, 234',
  'Obedecer a Deus mesmo quando é difícil',
  7
),

-- Igreja Vila Nova - Histórico
(
  '33333333-3333-3333-3333-333333333333',
  CURRENT_DATE - INTERVAL '7 days',
  'Davi e Golias - 1 Samuel 17',
  '12, 45, 178',
  'Deus dá força aos pequenos',
  9
),
(
  '33333333-3333-3333-3333-333333333333',
  CURRENT_DATE - INTERVAL '5 days',
  'Noé e a Arca - Gênesis 6-9',
  '34, 67, 234',
  'Deus protege os que confiam Nele',
  11
),
(
  '33333333-3333-3333-3333-333333333333',
  CURRENT_DATE - INTERVAL '2 days',
  'A multiplicação dos pães - João 6',
  '56, 123, 289',
  'Jesus pode fazer muito com pouco',
  13
);

-- ============================================================
-- INSERIR DIAS DE USO (ÚLTIMOS 14 DIAS)
-- ============================================================

-- Igreja Central
INSERT INTO dias_uso (igreja_id, data, total_criancas, culto_realizado) VALUES
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '14 days', 7, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '13 days', 9, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '12 days', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '11 days', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '10 days', 8, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '9 days', 10, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '8 days', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '7 days', 8, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '6 days', 10, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '5 days', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '4 days', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '3 days', 12, TRUE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '2 days', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', 0, FALSE),
('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 5, TRUE),

-- Igreja Jardim das Flores
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '14 days', 5, TRUE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '13 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '12 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '11 days', 6, TRUE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '10 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '9 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '8 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '7 days', 6, TRUE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '6 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '5 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '4 days', 7, TRUE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '3 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '2 days', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 day', 0, FALSE),
('22222222-2222-2222-2222-222222222222', CURRENT_DATE, 3, TRUE),

-- Igreja Vila Nova
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '14 days', 8, TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '13 days', 10, TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '12 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '11 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '10 days', 9, TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '9 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '8 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '7 days', 9, TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '6 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '5 days', 11, TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '4 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '3 days', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '2 days', 13, TRUE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '1 day', 0, FALSE),
('33333333-3333-3333-3333-333333333333', CURRENT_DATE, 4, TRUE);

-- ============================================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ============================================================

-- Contar registros inseridos
SELECT 
  'igrejas' AS tabela,
  COUNT(*) AS total_registros
FROM igrejas

UNION ALL

SELECT 
  'settings' AS tabela,
  COUNT(*) AS total_registros
FROM settings

UNION ALL

SELECT 
  'children' AS tabela,
  COUNT(*) AS total_registros
FROM children

UNION ALL

SELECT 
  'culto_observacoes' AS tabela,
  COUNT(*) AS total_registros
FROM culto_observacoes

UNION ALL

SELECT 
  'historico_cultos' AS tabela,
  COUNT(*) AS total_registros
FROM historico_cultos

UNION ALL

SELECT 
  'dias_uso' AS tabela,
  COUNT(*) AS total_registros
FROM dias_uso;

-- ============================================================
-- CONSULTAS DE TESTE
-- ============================================================

-- 1. Ver resumo de hoje
SELECT * FROM v_criancas_hoje;

-- 2. Ver estatísticas gerais
SELECT * FROM v_estatisticas_igreja;

-- 3. Listar crianças presentes hoje
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.hora_entrada
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.data_cadastro = CURRENT_DATE
ORDER BY i.nome, c.hora_entrada;

-- ============================================================
-- OBSERVAÇÕES FINAIS
-- ============================================================

/*
✅ DADOS INSERIDOS:
- 3 igrejas de exemplo
- 12 crianças (5 + 3 + 4 por igreja)
- 3 configurações (uma por igreja)
- 3 observações de culto de hoje
- 8 registros de histórico de cultos
- 45 dias de uso (15 por igreja, últimos 14 dias)

📝 PRÓXIMOS PASSOS:
1. Execute as queries de verificação acima
2. Teste as views criadas
3. Use as queries úteis do arquivo queries-uteis.sql
4. Quando estiver pronto, migre seus dados reais do localStorage
*/

-- ============================================================
-- FIM DOS DADOS DE EXEMPLO
-- ============================================================

