# 🚀 Guia Completo: Deploy no Vercel - FASE 2

## ⏱️ Tempo Total: ~10 minutos

---

## 📋 Checklist Rápido

- [ ] ✅ Passo 1: Acessar Vercel e importar repositório
- [ ] ✅ Passo 2: Configurar variáveis de ambiente
- [ ] ✅ Passo 3: Fazer deploy inicial
- [ ] ✅ Passo 4: Configurar Git settings
- [ ] ✅ Passo 5: Configurar proteção branch GitHub
- [ ] ✅ Passo 6: Validar ambos ambientes

---

## 🎯 PASSO 1: Importar Repositório no Vercel

### 1.1. Acesse o Vercel

**URL**: https://vercel.com/new

### 1.2. Importe do GitHub

1. Clique em **"Import Git Repository"**
2. Se solicitado, faça login com sua conta GitHub
3. Autorize o Vercel a acessar seus repositórios (se necessário)

### 1.3. Selecione o Repositório

1. Na lista de repositórios, procure por: **`ccb-espaco-infantil`**
2. Clique no botão **"Import"** ao lado do repositório

---

## ⚙️ PASSO 2: Configurar Projeto

### 2.1. Configurações Básicas

Na tela de configuração, preencha:

```
┌─────────────────────────────────────────────────────┐
│ Configure Project                                   │
├─────────────────────────────────────────────────────┤
│ Project Name: ccb-espaco-infantil                   │
│ Framework Preset: Next.js (detectado automaticamente)│
│ Root Directory: ./ (deixar vazio ou ".")            │
│ Build Command: npm run build (padrão)               │
│ Output Directory: .next (padrão)                    │
│ Install Command: npm install (padrão)               │
└─────────────────────────────────────────────────────┘
```

### 2.2. Configurar Variáveis de Ambiente (IMPORTANTE!)

⚠️ **NÃO clique em "Deploy" ainda!**

1. **Expanda a seção "Environment Variables"** (clique para abrir)

2. **Adicione as seguintes variáveis:**

#### Variável 1: NEXT_PUBLIC_SUPABASE_URL

```
┌──────────────────────────────────────────────────────┐
│ Key (nome)                                           │
│ NEXT_PUBLIC_SUPABASE_URL                             │
├──────────────────────────────────────────────────────┤
│ Value (valor)                                        │
│ https://jxmolsmgpibhdpdgmpuf.supabase.co             │
├──────────────────────────────────────────────────────┤
│ Environments (ambientes)                             │
│ ✅ Production                                        │
│ ✅ Preview                                           │
│ ✅ Development                                       │
└──────────────────────────────────────────────────────┘
```

Clique em **"Add"**

#### Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
┌──────────────────────────────────────────────────────┐
│ Key (nome)                                           │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY                        │
├──────────────────────────────────────────────────────┤
│ Value (valor)                                        │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX │
│ BhYmFzZSIsInJlZiI6Imp4bW9sc21ncGliaGRwZGdtcHVmIiwi │
│ cm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjk4MjAsImV4cCI6Mj │
│ A3NTgwNTgyMH0.9RR0CEcbh0Jy2ndoEwdrii4g4G_pnveo_F9 │
│ wSFgF8lQ                                             │
├──────────────────────────────────────────────────────┤
│ Environments (ambientes)                             │
│ ✅ Production                                        │
│ ✅ Preview                                           │
│ ✅ Development                                       │
└──────────────────────────────────────────────────────┘
```

Clique em **"Add"**

#### Variável 3: NEXT_PUBLIC_ENV (Production)

```
┌──────────────────────────────────────────────────────┐
│ Key (nome)                                           │
│ NEXT_PUBLIC_ENV                                      │
├──────────────────────────────────────────────────────┤
│ Value (valor)                                        │
│ production                                           │
├──────────────────────────────────────────────────────┤
│ Environments (ambientes)                             │
│ ✅ Production                                        │
│ ❌ Preview (DESMARCAR)                               │
│ ❌ Development (DESMARCAR)                           │
└──────────────────────────────────────────────────────┘
```

Clique em **"Add"**

#### Variável 4: NEXT_PUBLIC_ENV (Staging)

```
┌──────────────────────────────────────────────────────┐
│ Key (nome)                                           │
│ NEXT_PUBLIC_ENV                                      │
├──────────────────────────────────────────────────────┤
│ Value (valor)                                        │
│ staging                                              │
├──────────────────────────────────────────────────────┤
│ Environments (ambientes)                             │
│ ❌ Production (DESMARCAR)                            │
│ ✅ Preview                                           │
│ ✅ Development                                       │
└──────────────────────────────────────────────────────┘
```

Clique em **"Add"**

### 2.3. Verificar Variáveis

Você deve ter **4 variáveis** adicionadas:

```
✅ NEXT_PUBLIC_SUPABASE_URL       [Production, Preview, Development]
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  [Production, Preview, Development]  
✅ NEXT_PUBLIC_ENV = production   [Production]
✅ NEXT_PUBLIC_ENV = staging      [Preview, Development]
```

---

## 🚀 PASSO 3: Fazer Deploy Inicial

1. **Revise todas as configurações**
2. **Clique no botão azul "Deploy"**
3. **Aguarde o deploy** (~2-3 minutos)

Você verá:
- ✅ Building...
- ✅ Deploying...
- 🎉 **Success!**

---

## ⚙️ PASSO 4: Configurar Git Settings

Após o deploy inicial bem-sucedido:

### 4.1. Acessar Settings

1. No dashboard do projeto, clique em **"Settings"** (menu superior)
2. No menu lateral, clique em **"Git"**

### 4.2. Configurar Production Branch

Na seção **"Production Branch"**:

```
┌──────────────────────────────────────────┐
│ Production Branch                        │
├──────────────────────────────────────────┤
│ Branch Name: main                  [Edit]│
│                                          │
│ ✅ Deploy when pushed to main           │
└──────────────────────────────────────────┘
```

- Confirme que está **`main`**
- Se não estiver, clique em **"Edit"** e selecione `main`
- Salve

### 4.3. Verificar Preview Deployments

Na seção **"Deploy Hooks"** ou **"Ignored Build Step"**:

```
┌──────────────────────────────────────────┐
│ Preview Deployments                      │
├──────────────────────────────────────────┤
│ ✅ Enable preview deployments            │
│ ✅ Automatically create preview for all  │
│    branches                              │
└──────────────────────────────────────────┘
```

- Certifique-se de que está **ativado**
- Isso garante que a branch `develop` terá preview automático

---

## 🔒 PASSO 5: Proteger Branch Main no GitHub

### 5.1. Acessar Configurações do Repositório

1. Acesse: https://github.com/marcelohs402015/ccb-espaco-infantil/settings/branches
2. Role até **"Branch protection rules"**
3. Clique em **"Add branch protection rule"**

### 5.2. Configurar Regra de Proteção

```
┌──────────────────────────────────────────────────────┐
│ Branch name pattern                                  │
│ main                                                 │
├──────────────────────────────────────────────────────┤
│ Protect matching branches                           │
│ ✅ Require a pull request before merging            │
│    ✅ Require approvals: 1                          │
│    ✅ Dismiss stale PR approvals when new commits   │
│                                                      │
│ ✅ Require conversation resolution before merging   │
│ ✅ Require linear history                           │
│ ✅ Include administrators                           │
│                                                      │
│ ❌ Allow force pushes (MANTER DESMARCADO)           │
│ ❌ Allow deletions (MANTER DESMARCADO)              │
└──────────────────────────────────────────────────────┘
```

Clique em **"Create"** no final da página

---

## ✅ PASSO 6: Validar Ambientes

### 6.1. Validar Produção (main)

1. No Vercel, vá em **"Deployments"**
2. Encontre o deployment da branch `main`
3. Clique no link (ex: `ccb-espaco-infantil.vercel.app`)

**Validações:**
- ✅ Site abre normalmente
- ✅ **NÃO aparece** badge "🚧 STAGING" no header
- ✅ **NÃO aparece** badge "🚧 AMBIENTE DE TESTE" no rodapé
- ✅ Funcionalidades principais funcionam (cadastrar igreja, etc.)

**Teste no Console (F12):**
```javascript
console.log(process.env.NEXT_PUBLIC_ENV)
// Deve retornar: undefined ou não aparecer
```

### 6.2. Validar Staging (develop)

1. No Vercel, vá em **"Deployments"**
2. Encontre o deployment da branch `develop`
3. Clique no link (ex: `ccb-espaco-infantil-git-develop-seu-team.vercel.app`)

**Validações:**
- ✅ Site abre normalmente
- ✅ **APARECE** badge amarelo "🚧 STAGING" no header (canto superior esquerdo)
- ✅ **APARECE** badge amarelo "🚧 AMBIENTE DE TESTE" no rodapé (canto inferior direito)
- ✅ Funcionalidades principais funcionam

**Teste no Console (F12):**
```javascript
console.log(process.env.NEXT_PUBLIC_ENV)
// Deve retornar: "staging"
```

---

## 🎉 CONCLUSÃO - Checklist Final

Marque cada item conforme concluir:

### Deploy e Configuração
- [ ] ✅ Repositório importado no Vercel
- [ ] ✅ 4 variáveis de ambiente configuradas
- [ ] ✅ Deploy inicial bem-sucedido
- [ ] ✅ Production branch configurada como `main`
- [ ] ✅ Preview deployments ativados

### Proteção GitHub
- [ ] ✅ Branch protection rule criada para `main`
- [ ] ✅ Require PR ativado
- [ ] ✅ Include administrators ativado
- [ ] ✅ Force push desativado

### Validação
- [ ] ✅ Produção testada (sem badges)
- [ ] ✅ Staging testada (com badges)
- [ ] ✅ Variável NEXT_PUBLIC_ENV correta em cada ambiente
- [ ] ✅ Funcionalidades principais testadas

---

## 🎯 URLs Importantes

Depois de configurado, você terá:

**Produção (main):**
- 🌐 URL: `https://ccb-espaco-infantil.vercel.app`
- 📱 Para usuários finais
- 🔒 Protegida contra push direto

**Staging (develop):**
- 🌐 URL: `https://ccb-espaco-infantil-git-develop-[seu-team].vercel.app`
- 🧪 Para testes antes de produção
- 🚧 Badges visuais de ambiente de teste

**GitHub:**
- 📦 Repositório: https://github.com/marcelohs402015/ccb-espaco-infantil
- 🔒 Branch main protegida

**Vercel:**
- ⚙️ Dashboard: https://vercel.com/dashboard
- 📊 Deployments: https://vercel.com/[seu-team]/ccb-espaco-infantil

---

## 🆘 Troubleshooting

### Deploy falhou com erro de build

**Solução:**
1. Verifique logs no Vercel
2. Confirme que todas as variáveis foram adicionadas
3. Tente redeploy

### Badges não aparecem no staging

**Solução:**
1. Verifique se `NEXT_PUBLIC_ENV=staging` está em Preview/Development
2. Limpe cache do navegador (Ctrl+Shift+R)
3. Faça redeploy da branch develop

### Badges aparecem na produção

**Solução:**
1. Verifique se `NEXT_PUBLIC_ENV=production` está APENAS em Production
2. Faça redeploy da branch main

### Não consigo fazer push na main

**Solução:**
✅ **Isso é esperado!** A main está protegida
- Crie um Pull Request de `develop` → `main`
- Faça merge via PR

---

## 📚 Próximos Passos

Agora que está tudo configurado:

1. ✅ Leia o workflow completo: `docs/WORKFLOW-DESENVOLVIMENTO.md`
2. ✅ Comece a desenvolver em branches `feature/*`
3. ✅ Teste sempre em staging antes de produção
4. ✅ Use este padrão em todos os projetos futuros!

---

**Parabéns! Ambiente seguro de desenvolvimento está COMPLETO! 🎉**

**Desenvolvido com ❤️ para a glória de Deus**

---

*Última atualização: Outubro 2025*  
*Versão: 1.0.0*  
*Status: GUIA COMPLETO FASE 2 ✅*

