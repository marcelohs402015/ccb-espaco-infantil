# 🔄 Configuração: Banco de Dados Compartilhado

## 📊 Estratégia de Dados

Este projeto usa **UM ÚNICO banco de dados Supabase** compartilhado entre **STAGING** e **PRODUCTION**.

---

## ✅ Por Que Essa Abordagem?

### Regra Principal do Produto
🧹 **Limpeza LGPD Automática**: Dados são deletados diariamente (> 24 horas)

### Vantagens
✅ **Simplicidade** - Uma única fonte de verdade  
✅ **Sem duplicação** - Não há necessidade de sincronizar bancos  
✅ **LGPD automática** - Limpeza funciona em todos ambientes  
✅ **Economia** - Um projeto Supabase (sem custos extras)  
✅ **Dados atualizados** - Testes em staging refletem em production  

---

## 🔗 Configuração Atual

### Banco de Dados Supabase

**Projeto Único:**
```
URL: https://jxmolsmgpibhdpdgmpuf.supabase.co
ID: jxmolsmgpibhdpdgmpuf
```

**Usado por:**
- 🧪 Staging (develop branch)
- 🚀 Production (main branch)

---

## ⚙️ Variáveis de Ambiente

### STAGING (develop)

```env
NEXT_PUBLIC_SUPABASE_URL=https://jxmolsmgpibhdpdgmpuf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6MjA3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9wSFgF8lQ
NEXT_PUBLIC_ENV=staging
```

### PRODUCTION (main)

```env
NEXT_PUBLIC_SUPABASE_URL=https://jxmolsmgpibhdpdgmpuf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6MjA3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9wSFgF8lQ
NEXT_PUBLIC_ENV=production
```

### 🔍 Diferença

**ÚNICA variável diferente:**
- `NEXT_PUBLIC_ENV` - Define apenas o **comportamento visual** (badges)
- **NÃO afeta** conexão com banco de dados
- **NÃO separa** dados

---

## 🎯 Fluxo de Dados

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  👨‍💻 Desenvolvedor testa em STAGING              │
│  (ccb-espaco-infantil-stage.vercel.app)          │
│  🚧 Badges: "STAGING" visíveis                   │
│                    ↓                             │
│           ┌────────────────┐                     │
│           │   SUPABASE     │                     │
│           │  Database      │                     │
│           │ (compartilhado)│                     │
│           └────────────────┘                     │
│                    ↑                             │
│  👥 Usuários acessam PRODUCTION                  │
│  (ccb-espaco-infantil.vercel.app)                │
│  ✨ Interface limpa (sem badges)                │
│                                                  │
│  🧹 LIMPEZA LGPD (automática diária)            │
│     Remove dados > 24h                          │
│     Afeta ambos ambientes                       │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## ⚠️ Implicações Importantes

### ✅ Benefícios

1. **Testes Realistas** - Staging usa dados reais
2. **Sem Sincronização** - Não precisa copiar dados entre ambientes
3. **LGPD Garantida** - Limpeza automática em todos ambientes
4. **Custo Zero** - Apenas um projeto Supabase

### ⚠️ Considerações

1. **Testes em Staging São Visíveis** - Dados de teste aparecem em production
   - ✅ **Solução**: Use nomes identificáveis (ex: "Teste - CCB Brás")
   - ✅ **Limpeza**: Dados são deletados em 24h automaticamente

2. **Sem Rollback de Dados** - Mudanças no banco afetam ambos
   - ✅ **Solução**: Código tem rollback (via Git/Vercel)
   - ✅ **Dados**: São temporários (< 24h) por design

3. **Migrations Afetam Ambos** - Mudanças no schema são globais
   - ✅ **Solução**: Testar migrations cuidadosamente
   - ✅ **Backup**: Supabase tem backups automáticos

---

## 🔒 Segurança

### Proteção de Código

✅ **Branch main protegida** - Apenas via Pull Request  
✅ **Review obrigatório** - Mudanças revisadas antes de production  
✅ **Rollback rápido** - Via Vercel (código) em 30 segundos  

### Proteção de Dados

✅ **Row Level Security** - Supabase RLS ativo  
✅ **LGPD automática** - Limpeza diária de dados antigos  
✅ **Backup Supabase** - Backups automáticos do banco  
✅ **Anon Key** - Apenas operações autorizadas  

---

## 📊 Tabelas do Banco (Compartilhadas)

Todas as tabelas são acessadas por ambos ambientes:

```
├── igrejas (churches)
├── children (crianças)
├── culto_observacoes (observações de culto)
├── historico_cultos (histórico de cultos)
├── dias_uso (dias de uso do sistema)
└── configuracoes (settings)
```

**Isolamento de dados:**
- Por `igreja_id` (cada igreja vê apenas seus dados)
- **NÃO** por ambiente (staging/production)

---

## 🎯 Quando Essa Abordagem É Ideal?

✅ **Dados temporários** (< 24h)  
✅ **LGPD/GDPR compliance** (limpeza automática)  
✅ **Aplicações de uso pontual** (eventos, cultos)  
✅ **Sem dados sensíveis permanentes**  
✅ **Baixo volume de dados** (deletados diariamente)  

---

## 🚫 Quando NÃO Usar Essa Abordagem

❌ **Dados permanentes** (histórico longo)  
❌ **Dados financeiros** (requer auditoria)  
❌ **Dados sensíveis** (PII, saúde, etc)  
❌ **Alto volume** (milhões de registros)  
❌ **Compliance rigoroso** (precisa separação física)  

---

## 🔧 Como Configurar em Novos Projetos

Se for replicar essa estratégia em outros projetos:

### 1. Criar Projeto Supabase Único

```bash
# Um projeto serve para tudo
# URL: https://seu-projeto.supabase.co
```

### 2. Configurar Ambos Ambientes no Vercel

**Staging:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_ENV=staging
```

**Production:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_ENV=production
```

### 3. Implementar Limpeza Automática

```typescript
// Rotina LGPD diária
export const limparDadosAntigosGlobal = async () => {
  const hoje = new Date().toISOString().split('T')[0];
  
  await supabase
    .from('children')
    .delete()
    .lt('data_cadastro', hoje);
    
  // ... outras tabelas
};
```

---

## 📚 Referências

- **Workflow**: `docs/WORKFLOW-DESENVOLVIMENTO.md`
- **Deploy Vercel**: `docs/GUIA-DEPLOY-VERCEL-PASSO-A-PASSO.md`
- **Projeto Overview**: `docs/PROJETO-OVERVIEW.md`

---

## ✅ Conclusão

Esta configuração é **perfeita** para o CCB Espaço Infantil porque:

1. ✅ **Atende LGPD** - Dados deletados automaticamente
2. ✅ **Simples de manter** - Um banco, menos complexidade
3. ✅ **Custo-benefício** - Sem custos extras
4. ✅ **Seguro** - Código tem rollback, dados são temporários

**A única diferença visual entre staging e production são os badges de identificação!**

---

**Desenvolvido com ❤️ para a glória de Deus**

*Última atualização: Outubro 2025*  
*Versão: 1.0.0*  
*Status: CONFIGURAÇÃO VALIDADA ✅*

