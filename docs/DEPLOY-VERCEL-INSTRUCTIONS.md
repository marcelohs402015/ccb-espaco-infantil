# 🚀 Instruções de Deploy no Vercel

## ✅ Pré-requisitos Concluídos

- ✅ Projeto Next.js 14 configurado
- ✅ Supabase conectado e tabelas criadas
- ✅ Variáveis de ambiente configuradas
- ✅ Banco de dados PostgreSQL funcionando

---

## 📦 Deploy Automático via GitHub

### Passo 1: Commit e Push para GitHub

```bash
git add .
git commit -m "feat: preparado para deploy no Vercel"
git push origin main
```

### Passo 2: Importar no Vercel

1. Acesse: https://vercel.com/new
2. Selecione seu repositório GitHub
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Passo 3: Variáveis de Ambiente (AUTOMÁTICO)

✨ **As variáveis já estão configuradas automaticamente via integração Supabase + Vercel!**

Você verá no painel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `SUPABASE_JWT_SECRET`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde ~2-3 minutos
3. ✅ Projeto estará no ar!

---

## 🌐 Deploy Manual (Vercel CLI)

### Instalar Vercel CLI

```bash
npm install -g vercel
```

### Fazer Login

```bash
vercel login
```

### Deploy

```bash
# Deploy de teste
vercel

# Deploy para produção
vercel --prod
```

---

## 📊 Configurações do Projeto no Vercel

### vercel.json Configurado

```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["gru1"],  // São Paulo - Brasil
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

---

## 🔐 Segurança

### Variáveis Protegidas

- ✅ `.env.local` está no `.gitignore`
- ✅ Credenciais não são commitadas
- ✅ Variáveis injetadas automaticamente no build

### RLS (Row Level Security)

- ✅ Habilitado em todas as tabelas
- ✅ Políticas temporárias configuradas
- ⚠️ **TODO:** Implementar autenticação e ajustar políticas

---

## 🎯 Após o Deploy

### 1. Verificar Funcionalidades

- [ ] Página inicial carrega
- [ ] Seletor de igrejas funciona
- [ ] Cadastro de crianças funciona
- [ ] Sistema de emergência funciona
- [ ] Histórico de cultos funciona
- [ ] Botões "Criar" e "Alterar" funcionam

### 2. Testar Performance

```bash
# Lighthouse no Chrome DevTools
# Verificar:
# - Performance > 90
# - Accessibility > 90
# - Best Practices > 90
# - SEO > 90
```

### 3. Configurar Domínio (Opcional)

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

---

## 🐛 Troubleshooting

### Erro de Build

```bash
# Limpar cache local
rm -rf .next node_modules
npm install
npm run build
```

### Erro de Variáveis de Ambiente

1. Verifique no Vercel Dashboard: **Settings** → **Environment Variables**
2. Confirme que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` existem
3. Re-deploy após adicionar variáveis

### Erro de Conexão com Supabase

1. Verifique se as tabelas foram criadas
2. Confirme políticas RLS
3. Teste conexão no SQL Editor do Supabase

---

## 📱 URLs do Projeto

### Desenvolvimento Local
```
http://localhost:3000
```

### Produção (após deploy)
```
https://ccb-espaco-infantil.vercel.app
ou
https://seu-dominio.com
```

---

## 🔄 Atualizações Futuras

### Deploy Automático

Todo push para `main` fará deploy automático no Vercel.

### Preview Deployments

Branches e Pull Requests geram previews automáticos.

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## ✅ Checklist Final

Antes de fazer deploy, confirme:

- [x] Código commitado no GitHub
- [x] `.env.local` no `.gitignore`
- [x] Tabelas criadas no Supabase
- [x] Variáveis de ambiente configuradas (automático via integração)
- [x] `vercel.json` configurado
- [x] `package.json` com scripts corretos
- [x] Build local funciona (`npm run build`)
- [x] Servidor local funciona (`npm run dev`)

---

🎉 **Projeto pronto para deploy no Vercel!**

