# 📊 Migração para Supabase - Banco de Dados

## 🎯 Objetivo

Este diretório contém os scripts SQL necessários para migrar os dados do **localStorage** para o **Supabase (PostgreSQL)**.

## 📁 Arquivos

- **`migration.sql`** - Script completo de criação das tabelas e estrutura do banco
- **`README.md`** - Este arquivo com instruções de uso
- **`queries.sql`** - Queries úteis para consultas e manutenção (abaixo)

## 🚀 Como Executar a Migração

### Passo 1: Acessar o Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **ccbdadosdb**

### Passo 2: Executar o Script SQL

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query**
3. Abra o arquivo `migration.sql`
4. Copie TODO o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **Run** (ou pressione Ctrl+Enter)

### Passo 3: Verificar a Criação

Execute esta query para verificar se as tabelas foram criadas:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

Você deve ver:
- ✅ `children`
- ✅ `culto_observacoes`
- ✅ `dias_uso`
- ✅ `historico_cultos`
- ✅ `igrejas`
- ✅ `settings`

## 📊 Estrutura do Banco de Dados

```
┌─────────────┐
│   igrejas   │ (Tabela Principal)
└──────┬──────┘
       │
       ├──────► settings (1:1) - Configurações da igreja
       │
       ├──────► children (1:N) - Crianças cadastradas
       │
       ├──────► culto_observacoes (1:N) - Observações dos cultos
       │
       ├──────► historico_cultos (1:N) - Histórico de cultos
       │
       └──────► dias_uso (1:N) - Dias de uso do espaço
```

## 💾 Estrutura das Tabelas

### `igrejas`
```sql
id UUID PRIMARY KEY
nome VARCHAR(255)
data_cadastro TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `settings`
```sql
id UUID PRIMARY KEY
igreja_id UUID (FK → igrejas)
capacidade_maxima INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `children`
```sql
id UUID PRIMARY KEY
igreja_id UUID (FK → igrejas)
nome VARCHAR(255)
nome_responsavel VARCHAR(255)
tipo_responsavel VARCHAR(10) -- 'pai', 'mae', 'outro'
celular_responsavel VARCHAR(20)
observacoes TEXT
hora_entrada TIME
is_chamado_ativo BOOLEAN
data_cadastro DATE
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `culto_observacoes`
```sql
id UUID PRIMARY KEY
igreja_id UUID (FK → igrejas)
data DATE
palavra_lida TEXT
hinos_cantados TEXT
aprendizado TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `historico_cultos`
```sql
id UUID PRIMARY KEY
igreja_id UUID (FK → igrejas)
data DATE
palavra_lida TEXT
hinos_cantados TEXT
aprendizado TEXT
total_criancas INTEGER
created_at TIMESTAMP
updated_at TIMESTAMP
```

### `dias_uso`
```sql
id UUID PRIMARY KEY
igreja_id UUID (FK → igrejas)
data DATE
total_criancas INTEGER
culto_realizado BOOLEAN
created_at TIMESTAMP
updated_at TIMESTAMP
```

## 🔍 Queries Úteis

### Inserir uma Nova Igreja

```sql
-- Inserir igreja
INSERT INTO igrejas (nome, data_cadastro) 
VALUES ('Igreja CCB - Central', NOW())
RETURNING id;

-- Inserir configurações (use o ID retornado acima)
INSERT INTO settings (igreja_id, capacidade_maxima) 
VALUES ('UUID-DA-IGREJA', 30);
```

### Cadastrar uma Criança

```sql
INSERT INTO children (
  igreja_id,
  nome,
  nome_responsavel,
  tipo_responsavel,
  celular_responsavel,
  observacoes,
  hora_entrada,
  data_cadastro
) VALUES (
  'UUID-DA-IGREJA',
  'João Silva',
  'Maria Silva',
  'mae',
  '(11) 98765-4321',
  'Primeira vez no espaço infantil',
  '19:00:00',
  CURRENT_DATE
);
```

### Listar Crianças Presentes Hoje

```sql
SELECT 
  c.nome AS crianca,
  c.nome_responsavel AS responsavel,
  c.celular_responsavel AS telefone,
  c.hora_entrada,
  c.is_chamado_ativo AS emergencia,
  i.nome AS igreja
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.data_cadastro = CURRENT_DATE
ORDER BY c.hora_entrada;
```

### Ver Resumo do Dia Atual

```sql
SELECT * FROM v_criancas_hoje;
```

### Registrar Observações do Culto

```sql
INSERT INTO culto_observacoes (
  igreja_id,
  data,
  palavra_lida,
  hinos_cantados,
  aprendizado
) VALUES (
  'UUID-DA-IGREJA',
  CURRENT_DATE,
  'João 3:16',
  '15, 234, 456',
  'O amor de Deus pela humanidade'
)
ON CONFLICT (igreja_id, data) 
DO UPDATE SET
  palavra_lida = EXCLUDED.palavra_lida,
  hinos_cantados = EXCLUDED.hinos_cantados,
  aprendizado = EXCLUDED.aprendizado,
  updated_at = NOW();
```

### Salvar Culto no Histórico

```sql
INSERT INTO historico_cultos (
  igreja_id,
  data,
  palavra_lida,
  hinos_cantados,
  aprendizado,
  total_criancas
)
SELECT 
  co.igreja_id,
  co.data,
  co.palavra_lida,
  co.hinos_cantados,
  co.aprendizado,
  (SELECT COUNT(*) FROM children WHERE igreja_id = co.igreja_id AND data_cadastro = co.data)
FROM culto_observacoes co
WHERE co.igreja_id = 'UUID-DA-IGREJA' 
  AND co.data = CURRENT_DATE
ON CONFLICT (igreja_id, data) 
DO UPDATE SET
  palavra_lida = EXCLUDED.palavra_lida,
  hinos_cantados = EXCLUDED.hinos_cantados,
  aprendizado = EXCLUDED.aprendizado,
  total_criancas = EXCLUDED.total_criancas,
  updated_at = NOW();
```

### Estatísticas da Igreja

```sql
SELECT * FROM v_estatisticas_igreja 
WHERE igreja_id = 'UUID-DA-IGREJA';
```

### Histórico de Cultos (Últimos 30 dias)

```sql
SELECT 
  data,
  palavra_lida,
  hinos_cantados,
  total_criancas
FROM historico_cultos
WHERE igreja_id = 'UUID-DA-IGREJA'
  AND data >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY data DESC;
```

### Limpar Dados de um Dia Específico

```sql
-- Remover crianças de uma data específica
DELETE FROM children 
WHERE igreja_id = 'UUID-DA-IGREJA' 
  AND data_cadastro = '2025-10-11';

-- Remover observações de culto
DELETE FROM culto_observacoes 
WHERE igreja_id = 'UUID-DA-IGREJA' 
  AND data = '2025-10-11';
```

### Ativar/Desativar Chamado de Emergência

```sql
-- Ativar chamado
UPDATE children 
SET is_chamado_ativo = TRUE
WHERE id = 'UUID-DA-CRIANCA';

-- Desativar chamado
UPDATE children 
SET is_chamado_ativo = FALSE
WHERE id = 'UUID-DA-CRIANCA';
```

## 🔐 Configuração de Segurança (RLS)

O Row Level Security (RLS) está habilitado com políticas permissivas temporárias.

### ⚠️ IMPORTANTE: Remover Políticas Permissivas em Produção

Quando implementar autenticação, execute:

```sql
-- Remover políticas temporárias
DROP POLICY IF EXISTS "Permitir tudo temporariamente em igrejas" ON igrejas;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em settings" ON settings;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em children" ON children;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em culto_observacoes" ON culto_observacoes;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em historico_cultos" ON historico_cultos;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em dias_uso" ON dias_uso;

-- Criar políticas baseadas em autenticação
-- Exemplo: apenas usuários autenticados da igreja podem acessar seus dados
CREATE POLICY "Usuários veem apenas dados de sua igreja" 
  ON children FOR SELECT 
  USING (igreja_id = auth.jwt() ->> 'igreja_id');
```

## 🔄 Próximos Passos

Após executar a migração:

1. ✅ **Criar variáveis de ambiente** no Vercel/Next.js:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
   ```

2. ✅ **Instalar cliente Supabase**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. ✅ **Criar cliente Supabase** (`lib/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

4. ✅ **Migrar funções do Zustand** para usar Supabase em vez de localStorage

5. ✅ **Testar funcionalidades** uma por uma

6. ✅ **Implementar sincronização em tempo real** (opcional):
   ```typescript
   supabase
     .channel('children_changes')
     .on('postgres_changes', 
       { event: '*', schema: 'public', table: 'children' },
       (payload) => console.log(payload)
     )
     .subscribe()
   ```

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🆘 Troubleshooting

### Erro: "relation already exists"
```sql
-- Remover todas as tabelas e recomeçar
DROP TABLE IF EXISTS dias_uso CASCADE;
DROP TABLE IF EXISTS historico_cultos CASCADE;
DROP TABLE IF EXISTS culto_observacoes CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS igrejas CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP VIEW IF EXISTS v_criancas_hoje CASCADE;
DROP VIEW IF EXISTS v_estatisticas_igreja CASCADE;
```

### Erro: "permission denied"
Certifique-se de que você tem permissões de administrador no projeto Supabase.

### Views não aparecem
As views são criadas no schema `public`. Verifique se você está olhando no schema correto.

---

## 💡 Dicas

- Use UUIDs em vez de strings para IDs no código TypeScript
- Sempre use `ON CONFLICT` para evitar duplicatas
- Aproveite as views para consultas complexas
- Monitore o uso no dashboard do Supabase
- Configure backups automáticos no Supabase (já está ativo por padrão)

---

<div align="center">

**Que Deus abençoe a migração! 🙏**

</div>

