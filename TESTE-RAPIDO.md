# ⚡ Teste Rápido - 2 Minutos

## 🚀 INICIAR

```bash
npm run dev
```

Aguarde aparecer: `✓ Ready in ...s`

## 🌐 ABRIR

**Aplicação:**
```
http://localhost:3004
```

**Supabase (deixe aberto):**
```
https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/editor
```
- Clique na tabela `children`
- Configure **Auto-refresh: 10 seconds**

## ✅ TESTAR

### 1. Cadastrar Criança

Na aplicação:
1. Clique **"+ Adicionar Criança"**
2. Preencha:
   - Nome: **João Pedro**
   - Responsável: **Maria Silva**
   - Tipo: **Mãe**
   - Celular: **11987654321** (auto-formata)
3. Clique **"Cadastrar"**

**Resultado esperado:**
- ✅ Modal fecha
- ✅ Criança aparece na lista
- ✅ No console: `"✅ Criança cadastrada no Supabase: {...}"`
- ✅ **No Supabase: linha nova aparece!** 🎉

### 2. Ver no Supabase

No Supabase Dashboard:
- Veja a nova linha na tabela `children`
- Veja os dados que você preencheu
- Veja o `id` (UUID) gerado automaticamente

### 3. Editar Criança

Na aplicação:
1. Clique nos **3 pontinhos** da criança
2. Clique **"Editar"**
3. Mude o nome para: **João Pedro Silva**
4. Clique **"Salvar"**

**No Supabase:**
- Aguarde 10 segundos (auto-refresh)
- Veja o nome atualizado!

### 4. Emergência

Na aplicação:
1. Clique **"EMERGÊNCIA"** da criança
2. Veja o modal com dados do responsável

**No Supabase:**
- Veja a coluna `is_chamado_ativo` = `true`

### 5. Remover

Na aplicação:
1. Clique **"Retirar"** da criança
2. Confirme

**No Supabase:**
- A linha sumiu!

## 🐛 Se der erro

### Erro no Console

Se aparecer erro no console do navegador:
1. Pressione `Ctrl+Shift+R` (hard refresh)
2. Ou feche e abra o navegador

### Dados não aparecem

1. Veja o Console (F12)
2. Se tiver erro, copie e me mande
3. Execute: `npm run test:supabase`

### Servidor não inicia

```bash
# Matar processos
pkill -f "next dev"

# Limpar cache
rm -rf .next

# Tentar novamente
npm run dev
```

## ✅ Checklist Rápido

Antes de testar:
- [ ] `.env.local` existe e tem as credenciais
- [ ] `npm install` foi executado
- [ ] RLS está aberta (já configurei)
- [ ] Servidor rodando (`npm run dev`)

Durante o teste:
- [ ] Cadastrou criança
- [ ] Viu no Supabase
- [ ] Editou e viu mudança
- [ ] Testou emergência
- [ ] Removeu

## 🎉 Sucesso!

Se você:
- ✅ Cadastrou pela UI
- ✅ Viu no Supabase
- ✅ Editou e atualizou
- ✅ Removeu e sumiu

**Parabéns! Está 100% funcionando!**

Agora pode fazer deploy no Vercel! 🚀

---

**Dúvidas?** Olhe o console (F12) - todos os logs aparecem lá!

