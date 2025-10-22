-- ============================================================
-- 🗄️ CCB ESPAÇO INFANTIL - RECRIAÇÃO COMPLETA DA BASE
-- ============================================================
-- Projeto: ljtcthbjhuyibzazxvic.supabase.co
-- Este script recria COMPLETAMENTE a base de dados
-- ⚠️ ATENÇÃO: Este script APAGA TODOS os dados existentes!
-- ============================================================

-- ============================================================
-- 🧹 LIMPEZA COMPLETA DA BASE
-- ============================================================

-- Desabilitar triggers temporariamente
SET session_replication_role = replica;

-- Remover todas as tabelas (em ordem de dependência)
DROP TABLE IF EXISTS dias_uso CASCADE;
DROP TABLE IF EXISTS historico_cultos CASCADE;
DROP TABLE IF EXISTS culto_observacoes CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS igrejas CASCADE;

-- Remover views
DROP VIEW IF EXISTS v_criancas_hoje CASCADE;
DROP VIEW IF EXISTS v_estatisticas_igreja CASCADE;

-- Remover função de trigger
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Reabilitar triggers
SET session_replication_role = DEFAULT;

-- ============================================================
-- 🔧 CONFIGURAÇÕES INICIAIS
-- ============================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 📋 TABELA: igrejas
-- ============================================================

CREATE TABLE igrejas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT igrejas_nome_not_empty CHECK (LENGTH(TRIM(nome)) > 0)
);

-- Índices para igrejas
CREATE INDEX idx_igrejas_nome ON igrejas(nome);
CREATE INDEX idx_igrejas_data_cadastro ON igrejas(data_cadastro DESC);

-- Comentários
COMMENT ON TABLE igrejas IS 'Cadastro das igrejas que utilizam o sistema';
COMMENT ON COLUMN igrejas.id IS 'Identificador único da igreja';
COMMENT ON COLUMN igrejas.nome IS 'Nome da igreja';
COMMENT ON COLUMN igrejas.data_cadastro IS 'Data de cadastro da igreja no sistema';

-- ============================================================
-- ⚙️ TABELA: settings
-- ============================================================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  igreja_id UUID NOT NULL UNIQUE,
  capacidade_maxima INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_settings_igreja 
    FOREIGN KEY (igreja_id) 
    REFERENCES igrejas(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT settings_capacidade_positiva 
    CHECK (capacidade_maxima > 0)
);

-- Índices para settings
CREATE INDEX idx_settings_igreja_id ON settings(igreja_id);

-- Comentários
COMMENT ON TABLE settings IS 'Configurações do espaço infantil por igreja';
COMMENT ON COLUMN settings.capacidade_maxima IS 'Capacidade máxima de crianças no espaço infantil';

-- ============================================================
-- 👶 TABELA: children
-- ============================================================

CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  igreja_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  nome_responsavel VARCHAR(255) NOT NULL,
  tipo_responsavel VARCHAR(10) NOT NULL,
  celular_responsavel VARCHAR(20) NOT NULL,
  observacoes TEXT,
  hora_entrada TIME NOT NULL,
  is_chamado_ativo BOOLEAN DEFAULT FALSE,
  data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_children_igreja 
    FOREIGN KEY (igreja_id) 
    REFERENCES igrejas(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT children_tipo_responsavel_check 
    CHECK (tipo_responsavel IN ('pai', 'mae', 'outro')),
  
  CONSTRAINT children_nome_not_empty 
    CHECK (LENGTH(TRIM(nome)) > 0),
    
  CONSTRAINT children_nome_responsavel_not_empty 
    CHECK (LENGTH(TRIM(nome_responsavel)) > 0),
    
  CONSTRAINT children_celular_not_empty 
    CHECK (LENGTH(TRIM(celular_responsavel)) > 0)
);

-- Índices para children
CREATE INDEX idx_children_igreja_id ON children(igreja_id);
CREATE INDEX idx_children_data_cadastro ON children(data_cadastro DESC);
CREATE INDEX idx_children_nome ON children(nome);
CREATE INDEX idx_children_is_chamado_ativo ON children(is_chamado_ativo) WHERE is_chamado_ativo = TRUE;

-- Comentários
COMMENT ON TABLE children IS 'Cadastro de crianças presentes no espaço infantil';
COMMENT ON COLUMN children.tipo_responsavel IS 'Tipo do responsável: pai, mae ou outro';
COMMENT ON COLUMN children.is_chamado_ativo IS 'Indica se há um chamado de emergência ativo para esta criança';
COMMENT ON COLUMN children.data_cadastro IS 'Data em que a criança foi cadastrada (útil para histórico)';

-- ============================================================
-- 📝 TABELA: culto_observacoes
-- ============================================================

CREATE TABLE culto_observacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  igreja_id UUID NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  palavra_lida TEXT,
  hinos_cantados TEXT,
  aprendizado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_culto_observacoes_igreja 
    FOREIGN KEY (igreja_id) 
    REFERENCES igrejas(id) 
    ON DELETE CASCADE,
  
  -- Uma igreja só pode ter uma observação por data
  CONSTRAINT unique_culto_observacoes_igreja_data 
    UNIQUE (igreja_id, data)
);

-- Índices para culto_observacoes
CREATE INDEX idx_culto_observacoes_igreja_id ON culto_observacoes(igreja_id);
CREATE INDEX idx_culto_observacoes_data ON culto_observacoes(data DESC);

-- Comentários
COMMENT ON TABLE culto_observacoes IS 'Observações do culto infantil do dia';
COMMENT ON COLUMN culto_observacoes.palavra_lida IS 'Passagem bíblica ou palavra lida no culto';
COMMENT ON COLUMN culto_observacoes.hinos_cantados IS 'Hinos cantados durante o culto';
COMMENT ON COLUMN culto_observacoes.aprendizado IS 'Aprendizado ou mensagem do culto';

-- ============================================================
-- 📚 TABELA: historico_cultos
-- ============================================================

CREATE TABLE historico_cultos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  igreja_id UUID NOT NULL,
  data DATE NOT NULL,
  palavra_lida TEXT,
  hinos_cantados TEXT,
  aprendizado TEXT,
  total_criancas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_historico_cultos_igreja 
    FOREIGN KEY (igreja_id) 
    REFERENCES igrejas(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT historico_cultos_total_criancas_positivo 
    CHECK (total_criancas >= 0),
  
  -- Uma igreja só pode ter um histórico por data
  CONSTRAINT unique_historico_cultos_igreja_data 
    UNIQUE (igreja_id, data)
);

-- Índices para historico_cultos
CREATE INDEX idx_historico_cultos_igreja_id ON historico_cultos(igreja_id);
CREATE INDEX idx_historico_cultos_data ON historico_cultos(data DESC);

-- Comentários
COMMENT ON TABLE historico_cultos IS 'Histórico completo de cultos realizados';
COMMENT ON COLUMN historico_cultos.total_criancas IS 'Número total de crianças presentes no culto';

-- ============================================================
-- 📅 TABELA: dias_uso
-- ============================================================

CREATE TABLE dias_uso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  igreja_id UUID NOT NULL,
  data DATE NOT NULL,
  total_criancas INTEGER NOT NULL DEFAULT 0,
  culto_realizado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_dias_uso_igreja 
    FOREIGN KEY (igreja_id) 
    REFERENCES igrejas(id) 
    ON DELETE CASCADE,
  
  CONSTRAINT dias_uso_total_criancas_positivo 
    CHECK (total_criancas >= 0),
  
  -- Uma igreja só pode ter um registro por data
  CONSTRAINT unique_dias_uso_igreja_data 
    UNIQUE (igreja_id, data)
);

-- Índices para dias_uso
CREATE INDEX idx_dias_uso_igreja_id ON dias_uso(igreja_id);
CREATE INDEX idx_dias_uso_data ON dias_uso(data DESC);
CREATE INDEX idx_dias_uso_culto_realizado ON dias_uso(culto_realizado);

-- Comentários
COMMENT ON TABLE dias_uso IS 'Registro de dias de uso do espaço infantil';
COMMENT ON COLUMN dias_uso.culto_realizado IS 'Indica se um culto foi realizado neste dia';

-- ============================================================
-- 🔄 FUNCTION: Atualizar updated_at automaticamente
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_igrejas_updated_at
  BEFORE UPDATE ON igrejas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_culto_observacoes_updated_at
  BEFORE UPDATE ON culto_observacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_historico_cultos_updated_at
  BEFORE UPDATE ON historico_cultos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dias_uso_updated_at
  BEFORE UPDATE ON dias_uso
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 👁️ VIEWS ÚTEIS
-- ============================================================

-- View: Resumo de crianças por igreja no dia atual
CREATE OR REPLACE VIEW v_criancas_hoje AS
SELECT 
  i.id AS igreja_id,
  i.nome AS igreja_nome,
  COUNT(c.id) AS total_criancas,
  s.capacidade_maxima,
  ROUND((COUNT(c.id)::NUMERIC / s.capacidade_maxima) * 100, 2) AS percentual_ocupacao,
  COUNT(c.id) FILTER (WHERE c.is_chamado_ativo = TRUE) AS chamados_ativos
FROM igrejas i
LEFT JOIN children c ON i.id = c.igreja_id AND c.data_cadastro = CURRENT_DATE
LEFT JOIN settings s ON i.id = s.igreja_id
GROUP BY i.id, i.nome, s.capacidade_maxima
ORDER BY i.nome;

COMMENT ON VIEW v_criancas_hoje IS 'Resumo de crianças presentes hoje por igreja';

-- View: Estatísticas gerais por igreja
CREATE OR REPLACE VIEW v_estatisticas_igreja AS
SELECT 
  i.id AS igreja_id,
  i.nome AS igreja_nome,
  COUNT(DISTINCT hc.data) AS total_cultos_realizados,
  COUNT(DISTINCT du.data) AS total_dias_uso,
  COALESCE(AVG(hc.total_criancas), 0) AS media_criancas_por_culto,
  COALESCE(MAX(hc.total_criancas), 0) AS max_criancas_culto
FROM igrejas i
LEFT JOIN historico_cultos hc ON i.id = hc.igreja_id
LEFT JOIN dias_uso du ON i.id = du.igreja_id
GROUP BY i.id, i.nome
ORDER BY i.nome;

COMMENT ON VIEW v_estatisticas_igreja IS 'Estatísticas gerais de uso por igreja';

-- ============================================================
-- 🔒 ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS nas tabelas
ALTER TABLE igrejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE culto_observacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_cultos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dias_uso ENABLE ROW LEVEL SECURITY;

-- Política temporária: permitir tudo (enquanto não há autenticação)
-- ATENÇÃO: Remover estas políticas quando implementar autenticação!
CREATE POLICY "Permitir tudo temporariamente em igrejas" 
  ON igrejas FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir tudo temporariamente em settings" 
  ON settings FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir tudo temporariamente em children" 
  ON children FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir tudo temporariamente em culto_observacoes" 
  ON culto_observacoes FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir tudo temporariamente em historico_cultos" 
  ON historico_cultos FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Permitir tudo temporariamente em dias_uso" 
  ON dias_uso FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- ============================================================
-- ✅ VERIFICAÇÃO FINAL
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
-- 🎉 SCRIPT FINALIZADO COM SUCESSO!
-- ============================================================

/*
✅ BASE RECRIADA COM SUCESSO:
- 6 tabelas principais criadas
- Índices para performance
- Constraints e validações
- Triggers para updated_at automático
- Views para consultas úteis
- RLS habilitado (preparado para autenticação futura)

📊 DADOS:
- Base limpa, sem dados de exemplo
- Pronta para receber as igrejas que já estão cadastradas
- Estrutura completa e funcional

🔧 PRÓXIMOS PASSOS:
1. Execute este script no Supabase SQL Editor
2. Acesse a aplicação em http://localhost:3000
3. Cadastre as igrejas que já existiam
4. Teste a funcionalidade de limpeza automática LGPD
5. Sistema pronto para uso!
*/
