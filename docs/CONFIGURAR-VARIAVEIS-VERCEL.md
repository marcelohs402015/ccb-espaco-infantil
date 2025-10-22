# 🔧 Configurar Variáveis de Ambiente no Vercel

## 📋 Variáveis que você precisa adicionar:

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://jxmolsmgpibhdpdgmpuf.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6MjA3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9wSFgF8lQ
```

---

## 🚀 Como Adicionar no Vercel:

### **IMPORTANTE: O arquivo vercel.json foi corrigido!**
✅ **Problema resolvido:** Removemos as referências incorretas aos secrets do vercel.json

### **Opção A: Durante o Deploy (Primeira vez)**

1. Na tela de deploy, clique em **"Environment Variables"**
2. Adicione as duas variáveis:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://jxmolsmgpibhdpdgmpuf.supabase.co`
   - **Environments:** Selecione Production, Preview e Development
   - Clique em **"Add"**
   
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6MjA3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9wSFgF8lQ`
   - **Environments:** Selecione Production, Preview e Development
   - Clique em **"Add"**

3. Clique em **"Deploy"**

---

### **Opção B: Depois do Deploy (Se já deployou)**

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Clique em **"Add New"**
4. Adicione cada variável:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://jxmolsmgpibhdpdgmpuf.supabase.co`
   - **Environment:** Selecione **Production, Preview, e Development**
   - Clique **"Save"**
   
5. Repita para a segunda variável:
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6MjA3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9wSFgF8lQ`
   - Clique **"Save"**

6. Vá em **Deployments** e clique em **"Redeploy"**

---

## ⚠️ IMPORTANTE:

- ✅ Não compartilhe essas credenciais publicamente
- ✅ Essas são suas chaves reais do Supabase
- ✅ Elas já estão no `.env.local` localmente (não sobe para o Git)
- ✅ No Vercel, você precisa adicionar manualmente

---

## 📸 Passo a Passo Visual:

1. **No Vercel Dashboard:**
   ```
   Seu Projeto → Settings → Environment Variables → Add New
   ```

2. **Preencha:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://jxmolsmgpibhdpdgmpuf.supabase.co
   Environments: ✓ Production ✓ Preview ✓ Development
   ```

3. **Clique "Save"**

4. **Repita para NEXT_PUBLIC_SUPABASE_ANON_KEY**

5. **Redeploy do projeto**

---

## 🎯 Depois de Adicionar:

O deploy vai funcionar perfeitamente! O Vercel vai usar essas variáveis para conectar ao seu banco de dados Supabase.

---

## 🔧 Troubleshooting - Erro Resolvido:

### ❌ **Erro que você estava enfrentando:**
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "next_public_supabase_url", which does not exist
```

### ✅ **Solução aplicada:**
1. **Removemos a seção `env` do vercel.json** que estava causando o problema
2. **As variáveis agora devem ser configuradas diretamente no painel do Vercel**
3. **Não use mais referências a secrets no vercel.json**

### 🚨 **Se ainda tiver problemas:**
1. Vá em **Settings** → **Environment Variables** no Vercel
2. **Delete** qualquer variável que tenha o símbolo `@` (referência a secret)
3. **Adicione novamente** as variáveis com os valores diretos
4. **Redeploy** o projeto

---

## 🔗 Links Rápidos:

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard/project/jxmolsmgpibhdpdgmpuf
- **GitHub Repo:** https://github.com/marcelohs402015/ccb-espaco-infantil

