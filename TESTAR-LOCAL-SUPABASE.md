# 🧪 Testar Localmente com Supabase

## 🎯 Objetivo

Rodar a aplicação localmente e ver os dados sendo salvos no Supabase em tempo real.

---

## ✅ Pré-requisitos

- [x] `.env.local` configurado com credenciais
- [x] `database/migration.sql` executada no Supabase
- [x] `npm install` executado

---

## 🚀 Passo a Passo

### 1️⃣ Criar uma Igreja de Teste no Supabase

Primeiro, vamos criar uma igreja manualmente no Supabase para testar:

1. Acesse: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor
2. Clique na tabela `igrejas`
3. Clique em **"Insert row"**
4. Preencha:
   - `nome`: **Igreja CCB - Teste Local**
   - Deixe os outros campos automáticos
5. Clique em **"Save"**
6. **Copie o ID** gerado (é um UUID tipo: `123e4567-e89b-12d3...`)

### 2️⃣ Iniciar o Servidor Local

```bash
npm run dev
```

Aguarde até aparecer:
```
✓ Ready in 2.3s
○ Local: http://localhost:3000
```

### 3️⃣ Abrir a Aplicação

1. Abra: http://localhost:3000
2. Abra o **Console do Navegador** (F12)
3. Você verá logs mostrando a conexão com o Supabase

### 4️⃣ Usar a Aplicação Normalmente

Agora use a aplicação como faria normalmente:

#### A. Cadastrar uma Criança

1. Clique em **"+ Adicionar Criança"**
2. Preencha os dados:
   - Nome: **João Pedro**
   - Responsável: **Maria Silva**
   - Tipo: **Mãe**
   - Celular: **(11) 98765-4321**
   - Hora de Entrada: **19:00**
3. Clique em **"Cadastrar"**

#### B. Ver no Supabase (EM TEMPO REAL)

1. Vá para: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor
2. Clique na tabela **`children`**
3. **Você verá a criança que acabou de cadastrar!** 🎉

#### C. Atualizar uma Criança

1. Na aplicação, clique nos **3 pontinhos** da criança
2. Edite algum dado
3. Salve
4. **Recarregue a tabela `children` no Supabase** - verá a atualização!

#### D. Ativar Emergência

1. Clique no botão **"EMERGÊNCIA"** de uma criança
2. No Supabase, veja a coluna `is_chamado_ativo` mudar para `true`

#### E. Remover uma Criança

1. Remova uma criança na aplicação
2. No Supabase, **recarregue** - a linha foi deletada!

---

## 👀 Monitorar em Tempo Real

### Opção 1: Supabase Table Editor

```
https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor
```

- Clique em **Refresh** (🔄) após cada ação na app
- Veja as mudanças na tabela

### Opção 2: SQL Editor (Mais Avançado)

```
https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/sql/new
```

Execute esta query para ver tudo:

```sql
-- Ver todas as crianças cadastradas hoje
SELECT 
  i.nome AS igreja,
  c.nome AS crianca,
  c.nome_responsavel AS responsavel,
  c.celular_responsavel AS telefone,
  c.hora_entrada,
  c.is_chamado_ativo AS emergencia,
  c.created_at AS cadastrado_em
FROM children c
INNER JOIN igrejas i ON c.igreja_id = i.id
WHERE c.data_cadastro = CURRENT_DATE
ORDER BY c.hora_entrada;
```

### Opção 3: Console do Navegador

No console (F12), você verá logs tipo:

```
✅ Criança cadastrada no Supabase: { id: "...", nome: "João Pedro", ... }
✅ Criança atualizada no Supabase: { ... }
✅ Criança removida do Supabase
```

---

## 🔍 Verificar o que Está Sendo Salvo

### Ver Todas as Tabelas

```sql
-- Igrejas
SELECT * FROM igrejas ORDER BY created_at DESC;

-- Crianças de hoje
SELECT * FROM children WHERE data_cadastro = CURRENT_DATE;

-- Settings
SELECT i.nome, s.capacidade_maxima 
FROM settings s
JOIN igrejas i ON s.igreja_id = i.id;

-- Observações do culto de hoje
SELECT * FROM culto_observacoes WHERE data = CURRENT_DATE;

-- Resumo (usando a view)
SELECT * FROM v_criancas_hoje;
```

---

## 🎬 Passo a Passo Completo

```
1. Supabase Dashboard (Abra em uma aba)
   └─> Tabela `children` aberta
   
2. Sua App (http://localhost:3000)
   └─> Cadastre uma criança
   
3. Volte ao Supabase Dashboard
   └─> Clique em Refresh (🔄)
   └─> 🎉 VÊ A CRIANÇA!
   
4. Na App, edite a criança
   
5. No Supabase, clique Refresh
   └─> 🎉 VÊ A ATUALIZAÇÃO!
```

---

## ⚡ Dicas

### Atualizar Automaticamente no Supabase

Ao invés de clicar em Refresh manualmente, use o **Auto-refresh**:

1. No Table Editor
2. Clique no ícone de **clock** (⏱️)
3. Selecione: **10 seconds**
4. Agora atualiza automaticamente!

### Ver IDs Gerados

Quando cadastrar algo na app, veja no Console:

```javascript
✅ Criança cadastrada no Supabase: 
{
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  nome: "João Pedro",
  igreja_id: "...",
  ...
}
```

O `id` é gerado automaticamente pelo Supabase (UUID v4).

---

## 🐛 Troubleshooting

### "Cannot read properties of undefined"

**Problema**: Store não está carregando dados

**Solução**: 
1. Verifique se criou uma igreja no Supabase
2. Recarregue a página (F5)

### "Network error"

**Problema**: Não conecta ao Supabase

**Solução**:
1. Verifique `.env.local`
2. Reinicie: `npm run dev`

### "Nada aparece no Supabase"

**Problema**: Dados não estão sendo salvos

**Solução**:
1. Veja o Console (F12) - deve ter logs
2. Se tiver erro, me avise
3. Execute: `npm run test:supabase`

---

## 📊 Exemplo de Teste Completo

### 1. Estado Inicial (Vazio)

```sql
-- No Supabase SQL Editor
SELECT COUNT(*) as total FROM children;
-- Resultado: total = 0
```

### 2. Cadastrar 3 Crianças na App

Via interface:
- João (19:00)
- Maria (19:05)  
- Pedro (19:10)

### 3. Verificar no Supabase

```sql
SELECT nome, hora_entrada FROM children 
ORDER BY hora_entrada;

-- Resultado:
-- João   | 19:00:00
-- Maria  | 19:05:00
-- Pedro  | 19:10:00
```

### 4. Ativar Emergência do João

Na app: Clique EMERGÊNCIA → João

### 5. Ver no Supabase

```sql
SELECT nome, is_chamado_ativo FROM children
WHERE is_chamado_ativo = true;

-- Resultado:
-- João | true
```

### 6. Remover Pedro

Na app: Remover → Pedro

### 7. Confirmar no Supabase

```sql
SELECT COUNT(*) FROM children;
-- Resultado: 2 (João e Maria)
```

---

## 🎉 Sucesso!

Se você conseguiu:
- ✅ Cadastrar criança na app
- ✅ Ver ela no Supabase
- ✅ Editar e ver atualização
- ✅ Remover e sumir do banco

**Parabéns! Está tudo funcionando! 🎊**

---

## 📝 Próximos Passos

Depois de testar localmente:

1. Commit suas alterações
2. Push para o GitHub
3. Deploy no Vercel (siga: GUIA-RAPIDO-VERCEL.md)

---

<div align="center">

**Pronto para testar! 🚀**

Abra duas abas:
1. http://localhost:3000 (sua app)
2. Supabase Dashboard (tabela children)

E veja a mágica acontecer em tempo real! ✨

**Que Deus abençoe! 🙏**

</div>

