# ⚙️ Configuração Manual do Vercel - FASE 2

## 🎯 Objetivo

Configurar as variáveis de ambiente e Git integration no Vercel para completar a separação dos ambientes Staging e Produção.

**⏱️ Tempo estimado**: 3-5 minutos

---

## 📋 Pré-requisitos

✅ FASE 1 já foi executada (branches criadas, código atualizado)  
✅ Acesso ao dashboard do Vercel  
✅ Projeto já conectado ao GitHub

---

## 🔧 Passo 1: Configurar Variáveis de Ambiente

### 1.1. Acessar Configurações

1. Acesse o Vercel Dashboard: https://vercel.com/dashboard
2. Selecione o projeto **ccb-espaco-infantil** (ou nome do seu projeto)
3. Clique em **Settings** no menu superior
4. No menu lateral, clique em **Environment Variables**

### 1.2. Adicionar Variável NEXT_PUBLIC_ENV para Production

1. Clique no botão **Add New** (ou **Add** se for a primeira variável)
2. Preencha os campos:
   - **Key**: `NEXT_PUBLIC_ENV`
   - **Value**: `production`
   - **Environments**: ✅ Marque **APENAS** `Production`
3. Clique em **Save**

### 1.3. Adicionar Variável NEXT_PUBLIC_ENV para Preview/Staging

1. Clique em **Add New** novamente
2. Preencha os campos:
   - **Key**: `NEXT_PUBLIC_ENV`
   - **Value**: `staging`
   - **Environments**: ✅ Marque **Preview** e **Development**
3. Clique em **Save**

### ✅ Resultado Esperado

Você deve ter a variável `NEXT_PUBLIC_ENV` configurada duas vezes:

```
NEXT_PUBLIC_ENV = "production"   [Production]
NEXT_PUBLIC_ENV = "staging"      [Preview, Development]
```

---

## 🌿 Passo 2: Configurar Git Integration

### 2.1. Verificar Production Branch

1. Ainda em **Settings**, vá para **Git**
2. Na seção **Production Branch**, confirme que está configurada como: `main`
3. Se não estiver, clique em **Edit** e selecione `main`
4. Clique em **Save**

### 2.2. Configurar Preview Deployments

1. Na mesma página **Settings → Git**
2. Role até a seção **Deploy Hooks** ou **Ignored Build Step**
3. Certifique-se de que:
   - ✅ Preview deployments estão **ATIVADOS**
   - ✅ **Todas as branches** podem gerar preview (ou especificamente `develop`)

### 2.3. Configurar Branch de Desenvolvimento (Opcional mas Recomendado)

Se houver opção de configurar branches específicas para preview:

1. Procure por **Preview Branch** ou **Deploy Branches**
2. Adicione `develop` como branch principal de preview
3. Salvar configurações

---

## 🚀 Passo 3: Forçar Novo Deploy

Para aplicar as novas variáveis de ambiente:

### 3.1. Redeploy da Produção (main)

1. Vá em **Deployments** no menu superior
2. Encontre o último deployment da branch `main`
3. Clique nos três pontos `...` ao lado
4. Selecione **Redeploy**
5. Confirme e aguarde o deploy (~2 minutos)

### 3.2. Deploy do Staging (develop)

1. Ainda em **Deployments**
2. Encontre o deployment da branch `develop` (se já existir)
3. Clique nos três pontos `...` e selecione **Redeploy**
4. OU faça um commit qualquer na branch `develop` para disparar novo deploy

---

## ✅ Passo 4: Validar Configuração

### 4.1. Testar Ambiente de Produção

1. Acesse a URL de produção: `https://seu-projeto.vercel.app`
2. Abra o DevTools (F12)
3. No Console, digite:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_ENV)
   ```
4. ✅ **Deve retornar**: `undefined` ou não mostrar o badge de teste
5. ✅ **Não deve aparecer**: Badge "🚧 AMBIENTE DE TESTE"

### 4.2. Testar Ambiente de Staging

1. Acesse a URL de preview/staging:
   - Exemplo: `https://seu-projeto-git-develop-seu-team.vercel.app`
   - Encontre a URL em **Deployments** → branch `develop`
2. Abra a aplicação
3. ✅ **Deve aparecer**: Badge amarelo no canto inferior direito "🚧 AMBIENTE DE TESTE"
4. No Console, digite:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_ENV)
   ```
5. ✅ **Deve retornar**: `"staging"`

---

## 📸 Capturas de Tela de Referência

### Environment Variables
```
┌─────────────────────────────────────────────────┐
│ Environment Variables                           │
├─────────────────────────────────────────────────┤
│ NEXT_PUBLIC_ENV                                 │
│ Value: production                               │
│ Environments: ✓ Production                      │
├─────────────────────────────────────────────────┤
│ NEXT_PUBLIC_ENV                                 │
│ Value: staging                                  │
│ Environments: ✓ Preview  ✓ Development          │
├─────────────────────────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL                        │
│ Value: https://jxmolsmgpibhdpdgmpuf.supabase.co │
│ Environments: ✓ Production ✓ Preview ✓ Dev      │
├─────────────────────────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_ANON_KEY                   │
│ Value: eyJhbGci...                              │
│ Environments: ✓ Production ✓ Preview ✓ Dev      │
└─────────────────────────────────────────────────┘
```

### Git Settings
```
┌─────────────────────────────────────────────────┐
│ Production Branch                               │
├─────────────────────────────────────────────────┤
│ Branch Name: main                         [Edit]│
└─────────────────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Badge não aparece no staging

**Causa**: Variável de ambiente não foi aplicada  
**Solução**:
1. Verificar se `NEXT_PUBLIC_ENV=staging` está em Preview
2. Fazer redeploy da branch develop
3. Limpar cache do navegador (Ctrl+Shift+R)

### Badge aparece na produção

**Causa**: Variável incorreta em Production  
**Solução**:
1. Ir em Environment Variables
2. Editar `NEXT_PUBLIC_ENV` de Production
3. Mudar para `production` (ou remover a variável)
4. Redeploy da branch main

### Preview deployment não está funcionando

**Causa**: Git integration não configurada  
**Solução**:
1. Settings → Git
2. Verificar se Preview Deployments estão ativados
3. Fazer um novo commit em `develop`
4. Verificar em Deployments se o preview foi criado

### Variáveis não aparecem no build

**Causa**: Variáveis devem começar com `NEXT_PUBLIC_` para serem acessíveis no cliente  
**Solução**: Todas as variáveis já estão corretas com o prefixo adequado

---

## 📝 Checklist Final

Antes de considerar concluído, verifique:

- [ ] ✅ Variável `NEXT_PUBLIC_ENV=production` em Production
- [ ] ✅ Variável `NEXT_PUBLIC_ENV=staging` em Preview e Development
- [ ] ✅ Production Branch configurada como `main`
- [ ] ✅ Preview deployments ativados
- [ ] ✅ Redeploy realizado em ambos ambientes
- [ ] ✅ Produção testada (sem badge)
- [ ] ✅ Staging testada (com badge "🚧 AMBIENTE DE TESTE")
- [ ] ✅ Todas as funcionalidades testadas em ambos ambientes

---

## 🎉 Conclusão

Parabéns! Você concluiu a configuração dos ambientes separados.

### O que você tem agora:

✅ **Produção (main)**
- URL: https://seu-projeto.vercel.app
- Sem indicadores visuais
- Deploy automático quando merge em `main`
- Protegida contra push direto

✅ **Staging (develop)**
- URL: https://seu-projeto-git-develop.vercel.app
- Badge visual "🚧 AMBIENTE DE TESTE"
- Deploy automático quando push em `develop`
- Ambiente seguro para testes

### Próximos Passos

1. Leia `docs/WORKFLOW-DESENVOLVIMENTO.md` para entender o fluxo diário
2. Comece a desenvolver features em branches `feature/*`
3. Teste sempre em staging antes de promover para produção
4. Use este workflow em todos os projetos futuros!

---

**Precisa de ajuda?**  
Consulte: `docs/WORKFLOW-DESENVOLVIMENTO.md` ou abra uma issue no GitHub.

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0

