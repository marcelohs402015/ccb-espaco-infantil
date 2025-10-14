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

### **Opção A: Durante o Deploy (Primeira vez)**

1. Na tela de deploy, clique em **"Environment Variables"**
2. Adicione as duas variáveis:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://jxmolsmgpibhdpdgmpuf.supabase.co`
   - Clique em **"Add"**
   
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6MjA3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9wSFgF8lQ`
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

## 🔗 Links Rápidos:

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard/project/jxmolsmgpibhdpdgmpuf
- **GitHub Repo:** https://github.com/marcelohs402015/ccb-espaco-infantil

