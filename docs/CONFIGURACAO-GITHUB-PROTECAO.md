# 🔒 Configuração de Proteção de Branch no GitHub

## 🎯 Objetivo

Proteger a branch `main` para garantir que todas as mudanças passem por Pull Request e revisão antes de irem para produção.

**⏱️ Tempo estimado**: 2-3 minutos

---

## 📋 Pré-requisitos

✅ Branches `main` e `develop` já criadas no GitHub  
✅ Acesso de administrador ao repositório  
✅ Repositório: https://github.com/marcelohs402015/ccb-espaco-infantil

---

## 🔧 Passo a Passo

### 1. Acessar Configurações do Repositório

1. Acesse: https://github.com/marcelohs402015/ccb-espaco-infantil
2. Clique na aba **Settings** (Configurações)
3. No menu lateral esquerdo, clique em **Branches** (ou **Branches** em "Code and automation")

### 2. Adicionar Regra de Proteção para Main

1. Na seção **Branch protection rules**, clique em **Add branch protection rule** (ou **Add rule**)
2. No campo **Branch name pattern**, digite: `main`

### 3. Configurar Regras de Proteção

Marque as seguintes opções:

#### ✅ Require a pull request before merging
- **Descrição**: Impede commits diretos na main
- **Ação**: ✅ Marcar esta opção
- **Subopcões recomendadas**:
  - ✅ **Require approvals**: Requer aprovação antes do merge (opcional, mas recomendado)
    - Número de aprovações: `1` (você mesmo pode aprovar se for solo)
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**: Invalida aprovações antigas quando há novos commits

#### ✅ Require status checks to pass before merging (Opcional)
- **Descrição**: Garante que builds/testes passem antes do merge
- **Ação**: ⚠️ Marcar apenas se você tiver CI/CD configurado
- Se marcar, adicione checks como:
  - `build`
  - `lint`
  - `test`

#### ✅ Require conversation resolution before merging (Recomendado)
- **Descrição**: Todos os comentários devem ser resolvidos antes do merge
- **Ação**: ✅ Marcar esta opção

#### ✅ Require linear history (Opcional mas Recomendado)
- **Descrição**: Mantém histórico linear (sem merge commits complexos)
- **Ação**: ✅ Marcar se preferir histórico limpo
- **Nota**: Isso força uso de `squash merge` ou `rebase merge`

#### ✅ Include administrators (Importante!)
- **Descrição**: Aplica regras mesmo para administradores
- **Ação**: ✅ **SEMPRE** marcar esta opção
- **Motivo**: Garante que nem você pule o processo de PR

#### ❌ Allow force pushes (NUNCA marque)
- **Descrição**: Permitir force push
- **Ação**: ❌ **NUNCA** marcar
- **Motivo**: Force push pode destruir histórico

#### ❌ Allow deletions (NUNCA marque)
- **Descrição**: Permitir deletar a branch
- **Ação**: ❌ **NUNCA** marcar
- **Motivo**: Protege contra deleção acidental

### 4. Salvar Configurações

1. Role até o final da página
2. Clique em **Create** (ou **Save changes**)
3. ✅ Proteção da branch `main` está ativa!

---

## 📸 Configuração Recomendada (Checklist)

```
Branch protection rule for: main

✅ Require a pull request before merging
  ✅ Require approvals (1 approval)
  ✅ Dismiss stale pull request approvals when new commits are pushed
  ⬜ Require review from Code Owners (opcional)

⬜ Require status checks to pass before merging
  (só se tiver CI/CD configurado)

✅ Require conversation resolution before merging

✅ Require linear history

✅ Include administrators

⬜ Require signed commits (opcional, segurança extra)

❌ Allow force pushes (DESATIVADO)

❌ Allow deletions (DESATIVADO)
```

---

## ✅ Validar Configuração

### Teste 1: Tentar Push Direto na Main (Deve Falhar)

```bash
git checkout main
git commit --allow-empty -m "test: tentar push direto"
git push origin main
```

**Resultado Esperado:**
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
```

✅ Se você receber este erro, a proteção está funcionando!

### Teste 2: Criar Pull Request (Deve Funcionar)

```bash
git checkout develop
echo "# teste" >> test.md
git add test.md
git commit -m "test: arquivo de teste"
git push origin develop

# Criar PR no GitHub: develop → main
# Deve permitir o merge após aprovação
```

✅ Se conseguir criar PR e fazer merge, está tudo certo!

---

## 🔄 Proteger Branch Develop (Opcional mas Recomendado)

Para maior segurança, você pode também proteger a `develop`:

1. Repetir o processo acima para `develop`
2. Configurações mais leves:
   - ✅ Require a pull request before merging (sem aprovações obrigatórias)
   - ✅ Require conversation resolution before merging
   - ⬜ Include administrators (pode deixar desmarcado para flexibilidade)

---

## 🚨 Troubleshooting

### "Não consigo fazer push mesmo em develop"

**Causa**: Você pode estar com a main selecionada  
**Solução**:
```bash
git branch  # Ver branch atual
git checkout develop  # Trocar para develop
```

### "Não vejo opção para criar branch protection rule"

**Causa**: Você não é administrador do repositório  
**Solução**: Pedir permissões de admin ao dono do repo

### "Quero remover a proteção temporariamente"

**Causa**: Para alguma operação especial  
**Solução**:
1. Settings → Branches
2. Encontre a regra de `main`
3. Clique em **Edit**
4. Desmarque **Include administrators** temporariamente
5. Faça a operação necessária
6. ⚠️ **IMPORTANTE**: Reative imediatamente!

---

## 📚 Referências

- [GitHub Docs - Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Best Practices for Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)

---

## ✅ Checklist de Conclusão

Antes de considerar concluído, verifique:

- [ ] ✅ Regra de proteção criada para `main`
- [ ] ✅ "Require a pull request before merging" ativado
- [ ] ✅ "Include administrators" ativado
- [ ] ✅ "Allow force pushes" DESATIVADO
- [ ] ✅ "Allow deletions" DESATIVADO
- [ ] ✅ Testado: push direto na main foi bloqueado
- [ ] ✅ Testado: PR de develop → main funciona

---

## 🎉 Conclusão

Parabéns! A branch `main` agora está protegida.

### O que isso significa:

✅ **Ninguém** (nem você) pode fazer push direto na `main`  
✅ **Todas** as mudanças devem passar por Pull Request  
✅ **Histórico** de produção fica limpo e rastreável  
✅ **Rollback** é fácil via reverter PRs  
✅ **Qualidade** garantida por processo de revisão  

### Próximos Passos:

1. ✅ Configurar variáveis no Vercel (ver `CONFIGURACAO-VERCEL-MANUAL.md`)
2. ✅ Começar a desenvolver usando o workflow (ver `WORKFLOW-DESENVOLVIMENTO.md`)
3. ✅ Aplicar este padrão em todos os projetos futuros!

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0  
**Maintainer**: Equipe CCB Espaço Infantil

