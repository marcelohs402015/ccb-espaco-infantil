# 🚀 Deploy no Vercel - Estrutura Separada

## 📁 Estrutura do Deploy

```
deploy-vercel/
├── frontend/          ← Aplicação Next.js
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── package.json
│   └── ...
├── api/               ← Serverless Functions
│   ├── igrejas.js
│   ├── children.js
│   └── resumo-hoje.js
├── lib/
│   └── supabase.js    ← Cliente Supabase compartilhado
├── vercel.json        ← Configuração do Vercel
├── package.json       ← Root package.json
└── .env.production    ← Variáveis de ambiente
```

## ✅ O que já está pronto:

- [x] Frontend copiado e configurado
- [x] API Serverless Functions criadas
- [x] vercel.json configurado
- [x] Variáveis de ambiente definidas
- [x] package.json da raiz

## ⚠️ O que você precisa fazer:

### 1. Instalar dependências do frontend

```bash
cd frontend
npm install
cd ..
```

### 2. Instalar dependências da API

```bash
npm install
```

## 🚀 Deploy no Vercel

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com
2. Clique em **"Add New Project"**
3. Conecte ao GitHub: https://github.com/marcelohs402015/ccb-espaco-infantil
4. **IMPORTANTE**: Configure o **Root Directory**:
   - Root Directory: `deploy-vercel`
   - Framework: Next.js
5. Configure **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gppkhqsutgnnawbwsgji.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM
   ```
   Marque: ✅ Production ✅ Preview ✅ Development

6. **Build Settings**:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
   - Install Command: `cd frontend && npm install`

7. Clique em **"Deploy"**

### Opção 2: Via CLI

```bash
# Na raiz do deploy-vercel
npm i -g vercel
vercel login
vercel

# Siga as instruções
# Quando perguntar o Root Directory: deploy-vercel
```

## 🔧 Configurar Supabase

Adicione a URL do Vercel no Supabase:

1. Acesse: https://supabase.com/dashboard/project/gppkhqsutgnnawbwsgji/settings/auth
2. Em **Site URL**, adicione:
   ```
   https://ccb-espaco-infantil.vercel.app
   ```
3. Em **Redirect URLs**, adicione:
   ```
   https://ccb-espaco-infantil.vercel.app/**
   https://*.vercel.app/**
   ```

## 📊 Endpoints da API

Após o deploy, suas APIs estarão disponíveis em:

```
https://seu-app.vercel.app/api/igrejas
https://seu-app.vercel.app/api/children
https://seu-app.vercel.app/api/resumo-hoje
```

## ✅ Checklist de Deploy

- [ ] Instalar dependências: `cd frontend && npm install`
- [ ] Instalar deps da API: `npm install` (na raiz deploy-vercel)
- [ ] Commit e push para GitHub
- [ ] Conectar repositório no Vercel
- [ ] Configurar Root Directory: `deploy-vercel`
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy
- [ ] Configurar URLs no Supabase
- [ ] Testar em produção

## 🆘 Troubleshooting

### "Build Failed"

Verifique:
- Root Directory está como `deploy-vercel`
- Variáveis de ambiente configuradas
- Build Command: `cd frontend && npm run build`

### "API não responde"

Verifique:
- Arquivos .js estão em `api/`
- vercel.json está configurado
- Variáveis de ambiente estão corretas

## 📝 Relatório de Status

✅ **PRONTO**:
- Frontend completo
- 3 API Serverless Functions
- Configuração do Vercel
- Variáveis de ambiente

⚠️ **VOCÊ PRECISA**:
- Instalar dependências
- Fazer deploy no Vercel
- Configurar variáveis no Vercel Dashboard
- Testar

---

**Siga o passo a passo acima para fazer o deploy!** 🚀

