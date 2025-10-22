# 🚀 DEPLOY VERCEL - CONFIGURAÇÃO COMPLETA

## 📋 PASSO A PASSO PARA DEPLOY

### 1. 🔧 Preparar o Projeto
```bash
# Instalar dependências
npm install

# Verificar se o build funciona
npm run build

# Testar localmente
npm run dev
```

### 2. 🌐 Deploy no Vercel

#### Opção A: Via CLI (Recomendado)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

#### Opção B: Via GitHub
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente (veja seção abaixo)
3. Deploy automático

### 3. ⚙️ VARIÁVEIS DE AMBIENTE NO VERCEL

**OBRIGATÓRIAS:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ahddcerseteqcsjvoovv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZGRjZXJzZXRlcWNzanZvb3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMjM3ODIsImV4cCI6MjA3NjY5OTc4Mn0.aO2gb05L_H-ZUpG6yTqm8gt6HCPa54SznIOH9-rSDXY
```

**OPCIONAIS (para funcionalidades avançadas):**
```
POSTGRES_URL=postgres://postgres.ahddcerseteqcsjvoovv:isMunhtEYTvB38ME@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_PRISMA_URL=postgres://postgres.ahddcerseteqcsjvoovv:isMunhtEYTvB38ME@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_USER=postgres
POSTGRES_HOST=db.ahddcerseteqcsjvoovv.supabase.co
POSTGRES_PASSWORD=isMunhtEYTvB38ME
POSTGRES_DATABASE=postgres
SUPABASE_JWT_SECRET=OlAvQzxMQgaZFfnaRGCitDllHGC8Gc2n1/Mmr4Pa0q6I32gRMh22SL6FUIOUQp1E/vKAwCI3W4OwT67lP3cVmA==
```

### 4. 📱 Como Configurar no Dashboard Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://ahddcerseteqcsjvoovv.supabase.co`
   - **Environment**: Selecione `Production`, `Preview`, `Development`
   - Clique **Save**

5. Repita para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. 🔄 Redeploy
Após configurar as variáveis:
1. Vá em **Deployments**
2. Clique nos **3 pontos** do último deployment
3. Clique **Redeploy**

## ✅ CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas
- [ ] Build sem erros
- [ ] Banco de dados funcionando
- [ ] Deploy realizado
- [ ] Teste em produção

## 🆘 TROUBLESHOOTING

### Erro: "Failed to fetch"
- ✅ **RESOLVIDO**: Configuração do Supabase correta

### Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Erro de Variáveis
- Verificar se estão exatamente como mostrado acima
- Não usar aspas nas variáveis do Vercel
- Verificar se aplicou a todas as environments

## 🎯 COMANDOS RÁPIDOS

```bash
# Deploy rápido
vercel --prod

# Logs de produção
vercel logs

# Abrir no browser
vercel --open
```

---
**✨ Seu projeto CCB Espaço Infantil está pronto para produção!**