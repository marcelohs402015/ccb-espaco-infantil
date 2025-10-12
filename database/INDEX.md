# 📊 Database - Migração para Supabase

## 📁 Conteúdo desta Pasta

Esta pasta contém todos os arquivos necessários para migrar o sistema do **localStorage** para o **Supabase (PostgreSQL)**.

## 🗂️ Arquivos

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **migration.sql** | Script principal de criação das tabelas | Execute PRIMEIRO no Supabase |
| **README.md** | Documentação completa do banco de dados | Consulta geral sobre estrutura |
| **queries-uteis.sql** | Coleção de queries prontas para uso | Consultas do dia-a-dia |
| **dados-exemplo.sql** | Dados de teste para popular o banco | Testar sistema antes da migração real |
| **GUIA-MIGRACAO-LOCALSTORAGE.md** | Tutorial completo de migração | Migrar dados reais do localStorage |
| **converter-dados.js** | Script automático de conversão JSON→SQL | Converter dados exportados |
| **INDEX.md** | Este arquivo (índice da pasta) | Navegar pelos arquivos |

## 🚀 Guia Rápido de Início

### Passo 1: Criar Estrutura do Banco
```bash
1. Acesse: https://supabase.com
2. Abra o projeto: ccbdadosdb
3. Vá em: SQL Editor
4. Cole e execute: migration.sql
```

### Passo 2: (Opcional) Popular com Dados de Teste
```bash
1. No SQL Editor do Supabase
2. Cole e execute: dados-exemplo.sql
3. Teste o sistema com dados fictícios
```

### Passo 3: Migrar Dados Reais

**Opção A - Automática (Recomendado):**
```bash
1. Abra a aplicação no navegador (onde tem dados)
2. Abra Console (F12)
3. Execute o script de exportação (veja GUIA-MIGRACAO-LOCALSTORAGE.md)
4. Baixe o JSON
5. Execute: node converter-dados.js nome-do-arquivo.json
6. Cole e execute o SQL gerado no Supabase
```

**Opção B - Manual:**
```bash
1. Siga o GUIA-MIGRACAO-LOCALSTORAGE.md
2. Converta os dados manualmente
3. Execute o SQL no Supabase
```

### Passo 4: Verificar Migração
```sql
-- No SQL Editor do Supabase
SELECT 
  'igrejas' AS tabela, COUNT(*) AS total FROM igrejas
UNION ALL
SELECT 'children' AS tabela, COUNT(*) AS total FROM children
UNION ALL
SELECT 'historico_cultos' AS tabela, COUNT(*) AS total FROM historico_cultos;
```

## 📚 Estrutura do Banco de Dados

```
┌─────────────┐
│   igrejas   │ ← Tabela Principal
└──────┬──────┘
       │
       ├──► settings (1:1)
       ├──► children (1:N)
       ├──► culto_observacoes (1:N)
       ├──► historico_cultos (1:N)
       └──► dias_uso (1:N)
```

### Tabelas

1. **igrejas**: Cadastro das igrejas
2. **settings**: Configurações (capacidade máxima)
3. **children**: Crianças presentes
4. **culto_observacoes**: Observações do culto do dia
5. **historico_cultos**: Histórico de cultos realizados
6. **dias_uso**: Dias de uso do espaço infantil

## 🔍 Queries Mais Usadas

### Ver Crianças de Hoje
```sql
SELECT * FROM v_criancas_hoje;
```

### Listar Todas as Igrejas
```sql
SELECT * FROM igrejas ORDER BY nome;
```

### Estatísticas Gerais
```sql
SELECT * FROM v_estatisticas_igreja;
```

### Crianças com Emergência Ativa
```sql
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.celular_responsavel
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.is_chamado_ativo = TRUE;
```

**💡 Veja mais em:** `queries-uteis.sql`

## 🛠️ Troubleshooting

### "Tabela já existe"
```sql
-- Remover tudo e recomeçar
DROP TABLE IF EXISTS dias_uso CASCADE;
DROP TABLE IF EXISTS historico_cultos CASCADE;
DROP TABLE IF EXISTS culto_observacoes CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS igrejas CASCADE;
```

### "Nenhum dado no localStorage"
- Você está no navegador errado
- Use o mesmo dispositivo/navegador onde usava o sistema

### "Foreign key violation"
- Insira na ordem: igrejas → settings → children
- Sempre insira a igreja antes dos dados relacionados

## 📖 Documentação Detalhada

### Para Desenvolvedores
- **README.md**: Estrutura completa, índices, constraints
- **migration.sql**: Comentado linha por linha

### Para Usuários Finais
- **GUIA-MIGRACAO-LOCALSTORAGE.md**: Passo a passo detalhado
- **dados-exemplo.sql**: Exemplos práticos

### Para Consultas
- **queries-uteis.sql**: 28+ queries prontas

## 🔄 Workflow Completo

```
┌─────────────────────────────────────────────────────────┐
│ 1. Criar Tabelas                                        │
│    ↓ migration.sql                                      │
├─────────────────────────────────────────────────────────┤
│ 2. (Opcional) Testar com Dados Fictícios               │
│    ↓ dados-exemplo.sql                                  │
├─────────────────────────────────────────────────────────┤
│ 3. Exportar Dados do localStorage                       │
│    ↓ Console do navegador                               │
├─────────────────────────────────────────────────────────┤
│ 4. Converter JSON para SQL                              │
│    ↓ converter-dados.js                                 │
├─────────────────────────────────────────────────────────┤
│ 5. Importar Dados para Supabase                         │
│    ↓ SQL Editor                                         │
├─────────────────────────────────────────────────────────┤
│ 6. Verificar e Testar                                   │
│    ↓ queries-uteis.sql                                  │
├─────────────────────────────────────────────────────────┤
│ 7. Integrar com Next.js                                 │
│    ↓ Criar client Supabase no código                   │
└─────────────────────────────────────────────────────────┘
```

## 📦 Backup

**SEMPRE faça backup antes de qualquer operação destrutiva!**

```sql
-- Exportar via psql
pg_dump -h db.xxxxx.supabase.co -U postgres \
  -t igrejas -t children -t settings \
  -t culto_observacoes -t historico_cultos -t dias_uso \
  > backup-$(date +%Y%m%d).sql

-- Restaurar
psql -h db.xxxxx.supabase.co -U postgres < backup-YYYYMMDD.sql
```

## 🔐 Segurança

⚠️ **ATENÇÃO**: As políticas RLS estão permissivas temporariamente!

```sql
-- Quando implementar autenticação, remova:
DROP POLICY "Permitir tudo temporariamente em igrejas" ON igrejas;
-- ... e crie políticas baseadas em auth.uid()
```

## 📊 Monitoramento

### Ver Uso do Banco
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Ver Índices
```sql
SELECT * FROM pg_indexes WHERE schemaname = 'public';
```

## 🆘 Suporte

### Recursos Oficiais
- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)

### Problemas Comuns
1. Consulte `GUIA-MIGRACAO-LOCALSTORAGE.md` → Seção "🆘 Problemas Comuns"
2. Verifique os comentários em `migration.sql`
3. Teste com `dados-exemplo.sql` primeiro

## 🎯 Checklist de Migração

- [ ] 1. Criar tabelas (`migration.sql`)
- [ ] 2. Testar com dados exemplo (`dados-exemplo.sql`)
- [ ] 3. Exportar localStorage (Console)
- [ ] 4. Converter para SQL (`converter-dados.js`)
- [ ] 5. Importar dados reais (SQL Editor)
- [ ] 6. Verificar integridade (queries)
- [ ] 7. Testar aplicação
- [ ] 8. Fazer backup
- [ ] 9. Configurar variáveis de ambiente
- [ ] 10. Integrar Supabase no código

## 📈 Próximos Passos Após Migração

1. **Instalar Cliente Supabase**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configurar Variáveis de Ambiente**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```

3. **Criar Cliente** (`lib/supabase.ts`)
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(url, key)
   ```

4. **Refatorar Store** (migrar de localStorage para Supabase)

5. **Implementar Sincronização em Tempo Real**

## 🙏 Conclusão

Este é um sistema completo de migração. Todos os arquivos foram criados pensando em facilitar o processo.

**Ordem recomendada de leitura:**
1. INDEX.md (você está aqui)
2. README.md (visão geral técnica)
3. GUIA-MIGRACAO-LOCALSTORAGE.md (tutorial prático)
4. Executar migration.sql
5. Testar com dados-exemplo.sql
6. Usar converter-dados.js para migração real
7. Consultar queries-uteis.sql conforme necessário

---

<div align="center">

**Que Deus abençoe sua migração! 🙏**

*CCB Espaço Infantil - Sistema de Gestão*

</div>

