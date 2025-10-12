# 🚀 Deploy no Vercel - Passo a Passo

## 📋 Pré-requisitos

- ✅ Conta no Vercel (https://vercel.com)
- ✅ Repositório no GitHub: https://github.com/marcelohs402015/ccb-espaco-infantil
- ✅ Supabase configurado

## 🎯 Suas Credenciais (Já Configuradas)

```env
NEXT_PUBLIC_SUPABASE_URL=https://gppkhqsutgnnawbwsgji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM
```

---

## 📦 PASSO 1: Instalar Dependências

```bash
# Na pasta deploy-vercel
cd deploy-vercel

# Instalar deps da API
npm install

# Instalar deps do frontend
cd frontend
npm install
cd ..
```

---

## 📤 PASSO 2: Commit e Push para GitHub

```bash
# Voltar para a raiz do projeto
cd ..

# Adicionar arquivos
git add deploy-vercel/

# Commit
git commit -m "feat: Add Vercel deployment structure"

# Push
git push origin developing
```

---

## 🌐 PASSO 3: Deploy no Vercel Dashboard

### 3.1 Conectar Projeto

1. Acesse: https://vercel.com
2. Faça login
3. Clique em **"Add New Project"**
4. Selecione: **ccb-espaco-infantil** (seu repositório)

### 3.2 Configurar Root Directory

⚠️ **MUITO IMPORTANTE!**

Na tela de configuração:

1. Clique em **"Edit"** ao lado de "Root Directory"
2. Digite: **`deploy-vercel`**
3. Framework Preset: **Next.js** (auto-detectado)

### 3.3 Configurar Build Settings

Verifique se está assim:

```
Framework Preset: Next.js
Root Directory: deploy-vercel
Build Command: cd frontend && npm run build
Output Directory: frontend/.next
Install Command: cd frontend && npm install
```

Se não estiver, edite clicando em **"Override"**.

### 3.4 Configurar Environment Variables

Clique em **"Environment Variables"**:

**Variável 1:**
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://gppkhqsutgnnawbwsgji.supabase.co

☑️ Production
☑️ Preview
☑️ Development
```

**Variável 2:**
```
Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM

☑️ Production
☑️ Preview
☑️ Development
```

### 3.5 Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. 🎉 **Deploy concluído!**

---

## 🔧 PASSO 4: Configurar Supabase

1. Acesse: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/settings/auth

2. Em **Site URL**, coloque a URL do Vercel:
   ```
   https://ccb-espaco-infantil.vercel.app
   ```

3. Em **Additional Redirect URLs**, adicione:
   ```
   https://ccb-espaco-infantil.vercel.app/**
   https://*.vercel.app/**
   ```

4. Clique em **"Save"**

---

## ✅ PASSO 5: Testar em Produção

### 5.1 Acessar a aplicação

```
https://ccb-espaco-infantil.vercel.app
```

### 5.2 Testar APIs

```bash
# Listar igrejas
curl https://ccb-espaco-infantil.vercel.app/api/igrejas

# Resumo de hoje
curl https://ccb-espaco-infantil.vercel.app/api/resumo-hoje
```

### 5.3 Testar funcionalidades

- [ ] Criar igreja
- [ ] Cadastrar criança
- [ ] Editar dados
- [ ] Emergência
- [ ] Observações de culto

---

## 📊 Monitoramento

### Ver Logs

1. Vercel Dashboard → Seu Projeto
2. **Deployments** → Último deploy
3. **View Function Logs**

### Ver Métricas

1. **Analytics** → Ver acessos
2. **Speed Insights** → Performance
3. **Functions** → Logs das APIs

---

## 🔄 Atualizações Automáticas

Depois do primeiro deploy:

```bash
# Qualquer alteração
git add .
git commit -m "Update"
git push origin developing

# → Vercel faz deploy automático!
```

---

## 🎯 Checklist Completo

### Antes do Deploy
- [x] Estrutura deploy-vercel criada
- [x] API Serverless Functions criadas
- [x] Frontend copiado
- [x] vercel.json configurado
- [x] Variáveis de ambiente definidas
- [ ] Dependências instaladas (`npm install`)
- [ ] Commit e push para GitHub

### No Vercel
- [ ] Projeto importado
- [ ] Root Directory: `deploy-vercel`
- [ ] Variáveis de ambiente configuradas
- [ ] Build Settings verificadas
- [ ] Deploy realizado

### Pós-Deploy
- [ ] URLs configuradas no Supabase
- [ ] Aplicação acessível
- [ ] APIs funcionando
- [ ] Testes realizados

---

## 🆘 Problemas Comuns

### "Build Failed - Cannot find module"

**Solução**: Instale as dependências localmente primeiro:
```bash
cd deploy-vercel/frontend
npm install
```

### "API returns 500"

**Solução**: Verifique variáveis de ambiente no Vercel

### "Cannot connect to Supabase"

**Solução**: Verifique as chaves no Vercel Environment Variables

---

<div align="center">

## 🎊 Estrutura Pronta para Deploy!

Siga os passos acima e sua aplicação estará no ar!

**Que Deus abençoe! 🙏**

</div>

