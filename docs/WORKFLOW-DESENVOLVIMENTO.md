# 🚀 Workflow de Desenvolvimento - CCB Espaço Infantil

## Visão Geral

Este documento descreve o fluxo de trabalho seguro para desenvolvimento do projeto CCB Espaço Infantil, garantindo que mudanças sejam testadas adequadamente antes de irem para produção.

---

## 🌳 Estrutura de Branches

### `main` - Produção
- **Propósito**: Código em produção
- **Deploy**: Automático para https://ccb-espaco-infantil.vercel.app (ou seu domínio)
- **Proteção**: ✅ Protegida - apenas via Pull Request
- **Status**: Sempre estável e funcionando

### `develop` - Staging/Desenvolvimento
- **Propósito**: Ambiente de testes e desenvolvimento
- **Deploy**: Automático para preview URL (ex: ccb-espaco-git-develop.vercel.app)
- **Proteção**: Aceita commits diretos e PRs
- **Status**: Pode conter features em teste

### `feature/*` - Features Individuais
- **Propósito**: Desenvolvimento de funcionalidades específicas
- **Deploy**: Preview URL único por branch
- **Exemplo**: `feature/adicionar-relatorios`, `feature/melhorar-ui`
- **Status**: Em desenvolvimento ativo

---

## 📋 Workflow Completo

### 1️⃣ Desenvolvendo Nova Funcionalidade

```bash
# 1. Garantir que está na develop atualizada
git checkout develop
git pull origin develop

# 2. Criar branch da feature
git checkout -b feature/nome-da-funcionalidade

# 3. Fazer suas alterações
# ... editar código ...

# 4. Commit das mudanças
git add .
git commit -m "feat: adicionar funcionalidade X"

# 5. Push para o GitHub
git push origin feature/nome-da-funcionalidade

# 6. Criar Pull Request no GitHub
# - Base: develop
# - Compare: feature/nome-da-funcionalidade
# - Preencher template do PR

# 7. Aguardar deploy do preview
# - Vercel criará URL única para teste
# - Testar completamente no preview

# 8. Aprovar e fazer merge no develop
# - Após aprovação, fazer merge
# - Delete a branch da feature
```

### 2️⃣ Testando no Staging (develop)

```bash
# Após merge no develop, testar na URL de staging
# https://ccb-espaco-git-develop.vercel.app

# ✅ Verificar:
# - Todas as funcionalidades funcionam
# - Não há erros no console
# - Interface está correta
# - Dados são salvos/carregados corretamente
# - Sistema de emergência funciona
# - Realtime sync está ativo
```

### 3️⃣ Promovendo para Produção

```bash
# 1. Garantir que develop está testada e estável
# Acessar: https://ccb-espaco-git-develop.vercel.app

# 2. Criar Pull Request de develop → main
git checkout develop
git pull origin develop

# No GitHub:
# - Criar PR: develop → main
# - Título: "Release: [descrição das mudanças]"
# - Descrever todas as mudanças desde último release
# - Preencher checklist do template

# 3. Revisar cuidadosamente
# ⚠️ ATENÇÃO: Este PR vai para PRODUÇÃO!
# - Revisar todos os commits
# - Conferir não há código de debug
# - Validar que tudo foi testado

# 4. Aprovar e fazer merge
# - Deploy automático para produção em ~2 minutos
# - Monitorar logs no Vercel

# 5. Validar produção
# Acessar: https://ccb-espaco-infantil.vercel.app
# - Fazer teste rápido de smoke test
# - Validar funcionalidades críticas
```

---

## 🆘 Rollback de Emergência

### Método 1: Rollback no Vercel (Mais Rápido)

```bash
# 1. Acessar Vercel Dashboard
# https://vercel.com/[seu-team]/ccb-espaco-infantil

# 2. Ir em "Deployments"

# 3. Encontrar deployment anterior estável

# 4. Clicar nos três pontos (...) → "Promote to Production"

# 5. Confirmar
# ✅ Rollback completo em ~30 segundos
```

### Método 2: Revert via Git

```bash
# 1. Identificar o commit problemático
git log --oneline

# 2. Reverter o commit
git revert <commit-hash>

# 3. Push para main
git push origin main

# 4. Deploy automático do revert
```

### Método 3: Hotfix Urgente

```bash
# 1. Criar branch de hotfix da main
git checkout main
git pull origin main
git checkout -b hotfix/corrigir-problema-critico

# 2. Fazer correção mínima necessária
# ... editar código ...

# 3. Commit e push
git add .
git commit -m "hotfix: corrigir problema X"
git push origin hotfix/corrigir-problema-critico

# 4. Criar PR direto para main
# - Base: main
# - Compare: hotfix/corrigir-problema-critico
# - Marcar como URGENTE

# 5. Merge imediato após revisão rápida

# 6. IMPORTANTE: Atualizar develop também
git checkout develop
git merge hotfix/corrigir-problema-critico
git push origin develop
```

---

## 🔍 Verificações Antes de Cada Deploy

### Checklist Pré-Deploy

- [ ] ✅ Código testado localmente (`npm run dev`)
- [ ] ✅ Build completa sem erros (`npm run build`)
- [ ] ✅ Não há erros de TypeScript
- [ ] ✅ Não há erros no console do navegador
- [ ] ✅ Todas as funcionalidades testadas manualmente
- [ ] ✅ Sistema de emergência funcionando
- [ ] ✅ Sincronização em tempo real ativa
- [ ] ✅ Cadastro/edição/remoção de crianças OK
- [ ] ✅ Multi-igreja funcionando
- [ ] ✅ Histórico de cultos carregando
- [ ] ✅ Responsivo (mobile + desktop)
- [ ] ✅ `.env.local` não foi commitado
- [ ] ✅ Nenhuma informação sensível no código

---

## 🎯 Comandos Úteis

### Desenvolvimento Local

```bash
# Rodar em modo development
npm run dev

# Rodar em modo staging local
npm run dev:staging

# Build de produção
npm run build

# Rodar build de produção localmente
npm run start

# Lint do código
npm run lint
```

### Git Operations

```bash
# Ver status das mudanças
git status

# Ver diferenças
git diff

# Ver histórico de commits
git log --oneline --graph

# Atualizar branch atual
git pull origin <branch-name>

# Trocar de branch
git checkout <branch-name>

# Criar e trocar para nova branch
git checkout -b <nova-branch>

# Deletar branch local
git branch -d <branch-name>

# Deletar branch remota
git push origin --delete <branch-name>
```

### Vercel CLI

```bash
# Deploy manual para preview
npm run deploy:staging

# Deploy manual para produção
npm run deploy:prod

# Ver logs do deployment
vercel logs

# Listar deployments
vercel ls
```

---

## 🚨 Regras de Ouro

### ❌ NUNCA

1. **NUNCA** faça push direto na `main` (está bloqueada)
2. **NUNCA** force push (`git push --force`) em branches compartilhadas
3. **NUNCA** commite arquivos `.env.local` ou `.env`
4. **NUNCA** remova proteções de branch
5. **NUNCA** faça merge de código não testado em `develop`
6. **NUNCA** promova para produção sem testar em staging

### ✅ SEMPRE

1. **SEMPRE** crie Pull Requests para mudanças
2. **SEMPRE** teste no preview/staging antes de produção
3. **SEMPRE** preencha o template do PR completamente
4. **SEMPRE** faça commits descritivos e claros
5. **SEMPRE** rode `npm run build` antes de fazer PR
6. **SEMPRE** revise seu próprio código antes de submeter PR
7. **SEMPRE** mantenha `develop` sincronizada com `main` após releases

---

## 📊 Fluxo Visual

```
┌─────────────────┐
│  feature/nova   │
│   funcionalidade│
└────────┬────────┘
         │ PR
         ▼
┌─────────────────┐      ┌──────────────┐
│     develop     │─────▶│   Staging    │
│   (staging)     │      │   Preview    │
└────────┬────────┘      └──────────────┘
         │ PR
         │ (após testes)
         ▼
┌─────────────────┐      ┌──────────────┐
│      main       │─────▶│  Production  │
│   (produção)    │      │   Live       │
└─────────────────┘      └──────────────┘
```

---

## 🔐 Segurança

### Variáveis de Ambiente

**Staging (develop):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://jxmolsmgpibhdpdgmpuf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave]
NEXT_PUBLIC_ENV=staging
```

**Production (main):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://jxmolsmgpibhdpdgmpuf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave]
NEXT_PUBLIC_ENV=production
```

### Proteção de Dados

- ✅ Banco de dados compartilhado entre staging e production
- ✅ Dados são limpos automaticamente (LGPD)
- ✅ Não há risco de perda de dados em testes
- ✅ Ambientes visualmente identificados

---

## 📞 Suporte

### Problemas Comuns

**Conflito de merge:**
```bash
# Atualizar sua branch com a base
git checkout develop
git pull origin develop
git checkout sua-branch
git merge develop
# Resolver conflitos manualmente
git add .
git commit -m "merge: resolver conflitos com develop"
```

**Preview deployment falhou:**
1. Verificar logs no Vercel
2. Corrigir erros apontados
3. Fazer novo commit
4. Preview será recriado automaticamente

**Preciso desfazer último commit:**
```bash
# Desfazer commit mas manter mudanças
git reset --soft HEAD~1

# Desfazer commit e mudanças
git reset --hard HEAD~1
```

---

## 🎓 Boas Práticas

### Mensagens de Commit

Use o padrão Conventional Commits:

```bash
feat: adicionar funcionalidade X
fix: corrigir bug Y
docs: atualizar documentação Z
style: formatar código
refactor: refatorar componente W
test: adicionar testes
chore: atualizar dependências
```

### Tamanho dos PRs

- ✅ **Ideal**: 50-200 linhas de mudanças
- ⚠️ **Grande**: 200-500 linhas (dividir se possível)
- ❌ **Muito grande**: +500 linhas (dificulta revisão)

### Frequência de Commits

- Commits pequenos e frequentes são melhores
- Um commit por unidade lógica de trabalho
- Evite commits com mensagens "WIP" ou "fix"

---

## ✅ Workflow Estabelecido!

Este workflow garante:

- 🛡️ **Segurança**: Main protegida, testes obrigatórios
- 🚀 **Agilidade**: Deploy automático em todos ambientes
- 🔄 **Reversibilidade**: Rollback fácil em caso de problemas
- 👁️ **Visibilidade**: Preview de todas as mudanças
- 📈 **Qualidade**: Revisão e testes em múltiplas etapas

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0  
**Maintainer**: Equipe CCB Espaço Infantil

