# 🚀 Deploy no Vercel - Guia Completo

## ✅ Pré-requisitos

- [x] Conta no Vercel (https://vercel.com)
- [x] Projeto conectado ao GitHub
- [x] Supabase configurado (migration.sql executada)
- [x] Variáveis de ambiente conhecidas

## 📋 Suas Credenciais Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://gppkhqsutgnnawbwsgji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM
```

> ✅ **Já configuradas no `.env.local`** para desenvolvimento

---

## 🚀 Deploy no Vercel - Passo a Passo

### Método 1: Via Dashboard (Recomendado)

#### 1️⃣ Conectar Projeto ao Vercel

1. Acesse: https://vercel.com
2. Clique em **"Add New Project"**
3. Selecione o repositório: **ccb-espaco-infantil**
4. Clique em **"Import"**

#### 2️⃣ Configurar Variáveis de Ambiente

Na tela de configuração do projeto:

1. Vá em **"Environment Variables"**
2. Adicione as variáveis:

```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://gppkhqsutgnnawbwsgji.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 3️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (1-2 minutos)
3. Acesse a URL gerada: `https://ccb-espaco-infantil.vercel.app`

---

### Método 2: Via CLI (Avançado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole: https://gppkhqsutgnnawbwsgji.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Deploy para produção
vercel --prod
```

---

## ⚙️ Configuração Adicional no Vercel

### Build Settings (Já Configurado Automaticamente)

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x ou superior

### Regiões

Para melhor performance no Brasil, configure:

1. Settings → Functions
2. Function Region: **São Paulo (sao1)** ou **Washington DC (iad1)**

---

## 🔒 Configurar CORS no Supabase

Para que o Vercel acesse o Supabase:

1. Acesse: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji
2. Vá em: **Settings → API**
3. Em **API URL Configuration**, adicione seus domínios:
   - `https://ccb-espaco-infantil.vercel.app`
   - `https://*.vercel.app` (para preview deployments)

---

## ✅ Verificar Deploy

### 1. Testar API Routes

```bash
# Testar endpoint de igrejas
curl https://ccb-espaco-infantil.vercel.app/api/igrejas

# Deve retornar:
# {"success":true,"data":[...],"total":...}
```

### 2. Testar no Navegador

Acesse: `https://ccb-espaco-infantil.vercel.app`

Abra o Console (F12) e verifique:
- ✅ Não deve aparecer erros de Supabase
- ✅ Deve conectar ao banco normalmente

### 3. Testar Funcionalidades

- [ ] Listar igrejas
- [ ] Cadastrar criança
- [ ] Ver resumo do dia
- [ ] Ativar emergência

---

## 🔄 Atualizações Automáticas

### Desenvolvimento

```bash
# Qualquer push para a branch developing
git push origin developing

# → Cria preview deployment automático
# URL: https://ccb-espaco-infantil-git-developing-seu-user.vercel.app
```

### Produção

```bash
# Push para main ou merge para main
git push origin main

# → Deploy automático em produção
# URL: https://ccb-espaco-infantil.vercel.app
```

---

## 📊 Monitoramento

### Logs do Vercel

1. Dashboard → Seu Projeto
2. **Deployments** → Ver logs de build
3. **Functions** → Ver logs de API Routes
4. **Analytics** → Ver métricas de uso

### Logs do Supabase

1. Supabase Dashboard
2. **Logs** → Ver queries do banco
3. **API** → Ver uso da API
4. **Database** → Performance

---

## 🐛 Troubleshooting

### "Build failed"

**Problema**: Erro ao fazer build no Vercel

**Solução**:
```bash
# Testar build localmente
npm run build

# Se funcionar local, verificar:
# 1. Node version no Vercel (Settings → General)
# 2. Variáveis de ambiente configuradas
# 3. Dependencies no package.json
```

### "Cannot connect to Supabase"

**Problema**: Aplicação não conecta ao banco

**Solução**:
1. Verificar variáveis de ambiente no Vercel
2. Verificar CORS no Supabase
3. Verificar RLS (Row Level Security) - deve estar permissivo

### "API Route returns 500"

**Problema**: Endpoints retornam erro

**Solução**:
1. Ver logs no Vercel Functions
2. Verificar se migration.sql foi executada
3. Testar queries manualmente no Supabase SQL Editor

### "Environment variables not found"

**Problema**: Variáveis não são encontradas

**Solução**:
```bash
# Reimportar ambiente
vercel env pull .env.production.local

# Redeployar
vercel --prod --force
```

---

## 🔐 Segurança em Produção

### ⚠️ ANTES DE LANÇAR

- [ ] Configurar RLS (Row Level Security) no Supabase
- [ ] Implementar autenticação de usuários
- [ ] Remover políticas permissivas temporárias
- [ ] Configurar rate limiting
- [ ] Revisar permissões de API
- [ ] Configurar backup automático
- [ ] Implementar logs de auditoria

### RLS - Row Level Security

Execute no Supabase SQL Editor:

```sql
-- Remover políticas temporárias
DROP POLICY IF EXISTS "Permitir tudo temporariamente em igrejas" ON igrejas;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em settings" ON settings;
DROP POLICY IF EXISTS "Permitir tudo temporariamente em children" ON children;

-- Criar políticas baseadas em autenticação
-- (Implementar após ter sistema de auth)
```

---

## 📱 Custom Domain (Opcional)

### Adicionar Domínio Personalizado

1. Vercel Dashboard → Seu Projeto
2. **Settings** → **Domains**
3. Adicionar domínio: `espacoinfantil.ccb.org.br`
4. Configurar DNS conforme instruções

### Configurar SSL

✅ Vercel configura SSL automaticamente (Let's Encrypt)

---

## 📈 Performance

### Edge Functions

Para melhor performance, as API Routes do Next.js já rodam no Edge do Vercel.

### Caching

Configure cache headers se necessário:

```typescript
// app/api/igrejas/route.ts
export const revalidate = 60; // Revalidar a cada 60 segundos
```

### Database Connection Pooling

✅ Supabase já gerencia connection pooling automaticamente

---

## 💰 Custos

### Vercel (Hobby Plan - Grátis)

- ✅ 100 GB bandwidth/mês
- ✅ Deployments ilimitados
- ✅ Preview deployments ilimitados
- ✅ Edge Functions incluídas

### Supabase (Free Tier)

- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 50 MB bandwidth/mês
- ✅ 2 GB data transfer

**⚠️ Nota**: Monitor uso no dashboard de cada serviço

---

## 🎯 Checklist Final

### Antes do Deploy
- [x] Migration executada no Supabase
- [x] Variáveis de ambiente obtidas
- [x] Projeto conectado ao Git
- [x] Build local funciona (`npm run build`)

### No Vercel
- [ ] Projeto importado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] URL acessível

### Testes em Produção
- [ ] APIs funcionando
- [ ] Banco conectando
- [ ] UI renderizando
- [ ] Funcionalidades operacionais

### Pós-Deploy
- [ ] Configurar domínio personalizado (opcional)
- [ ] Configurar monitoramento
- [ ] Documentar URL de produção
- [ ] Treinar usuários

---

## 🆘 Suporte

### Documentação Oficial

- [Vercel + Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

### Problemas?

1. Verifique logs no Vercel Dashboard
2. Verifique logs no Supabase Dashboard
3. Teste endpoints com curl/Postman
4. Consulte documentação do projeto

---

## 📝 URLs Importantes

```
🔧 Desenvolvimento Local:
http://localhost:3000

🌐 Vercel Preview (developing):
https://ccb-espaco-infantil-git-developing.vercel.app

🚀 Vercel Produção (main):
https://ccb-espaco-infantil.vercel.app

💾 Supabase Dashboard:
https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji

📊 Vercel Dashboard:
https://vercel.com/dashboard
```

---

<div align="center">

## 🎉 Deploy Pronto!

Suas variáveis de ambiente já estão configuradas em `.env.local`.

Agora é só fazer o deploy no Vercel seguindo os passos acima!

**Que Deus abençoe! 🙏**

</div>

