# ⚡ Guia Rápido: Deploy no Vercel em 3 Minutos

## 🎯 Suas Credenciais (Já Configuradas)

```env
NEXT_PUBLIC_SUPABASE_URL=https://gppkhqsutgnnawbwsgji.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGtocXN1dGdubmF3YndzZ2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTA2NjUsImV4cCI6MjA3NTc2NjY2NX0.nMLJtsjDcf9F5W7teHa5LCjjYVl8cg0n_BSK5DZ78GM
```

---

## 🚀 3 Passos Simples

### 1️⃣ Acesse o Vercel

```
https://vercel.com
```

1. Faça login
2. Clique em **"Add New Project"**
3. Selecione: **ccb-espaco-infantil** (seu repositório)

### 2️⃣ Configure Variáveis de Ambiente

Na tela de configuração, vá em **"Environment Variables"**:

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

### 3️⃣ Deploy

1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos ⏱️
3. **Pronto!** ✅

---

## 🎉 Resultado

Seu app estará disponível em:

```
https://ccb-espaco-infantil.vercel.app
```

---

## ✅ Verificar se Funcionou

### Teste 1: Acessar a URL

```
https://ccb-espaco-infantil.vercel.app
```

Deve carregar a aplicação normalmente.

### Teste 2: Testar API

```bash
curl https://ccb-espaco-infantil.vercel.app/api/igrejas
```

Deve retornar JSON com lista de igrejas.

### Teste 3: Console do Navegador

Abra o site e pressione `F12`:

- ✅ Não deve ter erros de Supabase
- ✅ Deve conectar ao banco normalmente

---

## 🐛 Problemas?

### "Build Failed"

**Solução**: Verifique se as variáveis foram configuradas corretamente.

### "Cannot connect to Supabase"

**Solução**: 
1. Verifique as variáveis no Vercel Dashboard
2. Verifique se executou `database/migration.sql` no Supabase

### "404 on API Routes"

**Solução**: Build provavelmente falhou. Veja logs no Vercel.

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- **DEPLOY-VERCEL.md** - Guia completo com todos os detalhes
- **CONFIGURACAO-SUPABASE.md** - Configuração do Supabase
- **app/api/README.md** - Documentação das APIs

---

## 💡 Dicas

### Redeploy

Para fazer deploy de novas alterações:

```bash
git add .
git commit -m "Suas alterações"
git push origin main
```

O Vercel faz deploy automático! 🚀

### Preview Deployments

Qualquer push para outras branches cria um preview:

```bash
git push origin developing
```

URL preview: `https://ccb-espaco-infantil-git-developing.vercel.app`

### Ver Logs

1. Vercel Dashboard → Seu Projeto
2. **Deployments** → Último deploy
3. **View Function Logs** → Ver logs das APIs

---

<div align="center">

## 🎊 Deploy Completo!

**Backend totalmente configurado e pronto para produção**

Suas credenciais foram obtidas via MCP Supabase  
e estão prontas para uso no Vercel.

**Que Deus abençoe! 🙏**

</div>

