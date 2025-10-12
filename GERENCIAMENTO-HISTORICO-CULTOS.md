# 📖 Gerenciamento de Histórico de Cultos

## Visão Geral

Sistema para criar e editar registros de cultos no histórico com data personalizada.

---

## 🎯 Funcionalidades

### 1. Botão "Criar"
- **Localização**: Seção "Resumo do Culto" na página principal
- **Função**: Criar um novo registro de culto com data personalizada
- **Cor**: Azul
- **Ícone**: Plus (+)

#### Como usar:
1. Clique no botão "Criar" no card "Resumo do Culto"
2. Escolha a data do culto
3. Preencha os campos:
   - Palavra Lida
   - Hinos Cantados
   - O que as Crianças Aprenderam
4. Clique em "Criar Registro"

**Características:**
- Salva diretamente na tabela `historico_cultos`
- Permite escolher qualquer data (passada, presente ou futura)
- Registra automaticamente o total de crianças presentes no dia
- Se já existir um registro para a data escolhida, ele será atualizado

---

### 2. Botão "Alterar"
- **Localização**: Seção "Resumo do Culto" na página principal
- **Função**: Editar o último registro de culto criado no histórico
- **Cor**: Verde
- **Ícone**: Edit (✏️)

#### Como usar:
1. Clique no botão "Alterar" no card "Resumo do Culto"
2. O modal abrirá com os dados do último culto registrado
3. Edite os campos conforme necessário:
   - Palavra Lida
   - Hinos Cantados
   - O que as Crianças Aprenderam
4. Clique em "Salvar Alterações"

**Características:**
- Edita apenas o último registro do histórico (mais recente)
- Mostra a data do culto que está sendo editado
- Mostra o total de crianças daquele dia
- Se não houver nenhum culto no histórico, mostra mensagem informativa

---

## 📊 Armazenamento

Todos os registros são salvos na tabela `historico_cultos` do banco de dados Supabase:

```sql
historico_cultos
├── id (UUID)
├── igreja_id (UUID)
├── data (DATE) - UNIQUE por igreja
├── palavra_lida (TEXT)
├── hinos_cantados (TEXT)
├── aprendizado (TEXT)
├── total_criancas (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🔧 Funções da Store

### `criarCultoNoHistorico(data, observacoes, totalCriancas)`

Cria um novo registro de culto no histórico.

**Parâmetros:**
- `data` (string): Data no formato YYYY-MM-DD
- `observacoes` (object):
  - `palavraLida` (string, opcional)
  - `hinosCantados` (string, opcional)
  - `aprendizado` (string, opcional)
- `totalCriancas` (number): Total de crianças presentes

**Exemplo:**
```typescript
await criarCultoNoHistorico(
  '2025-10-11',
  {
    palavraLida: 'João 3:16',
    hinosCantados: 'Hino 5, 12, 23',
    aprendizado: 'Amor de Deus'
  },
  15
);
```

---

### `atualizarUltimoCultoHistorico(observacoes)`

Atualiza o último registro de culto do histórico.

**Parâmetros:**
- `observacoes` (object):
  - `palavraLida` (string, opcional)
  - `hinosCantados` (string, opcional)
  - `aprendizado` (string, opcional)

**Exemplo:**
```typescript
await atualizarUltimoCultoHistorico({
  palavraLida: 'Mateus 5:1-12',
  hinosCantados: 'Hino 8, 15',
  aprendizado: 'As bem-aventuranças'
});
```

---

## 🎨 Componentes

### CreateCultoModal
**Arquivo**: `components/create-culto-modal.tsx`

Modal para criar um novo registro de culto com data personalizada.

**Props:**
- `onClose`: Função para fechar o modal

---

### EditLastCultoModal
**Arquivo**: `components/edit-last-culto-modal.tsx`

Modal para editar o último registro de culto do histórico.

**Props:**
- `onClose`: Função para fechar o modal

**Características especiais:**
- Carrega automaticamente os dados do último culto
- Mostra a data e total de crianças do culto sendo editado
- Se não houver nenhum culto, mostra mensagem informativa

---

## 🔄 Fluxo de Dados

### Criar Novo Culto:
```
1. Usuário clica em "Criar"
2. Abre modal CreateCultoModal
3. Usuário escolhe data e preenche dados
4. Clica em "Criar Registro"
5. Chama criarCultoNoHistorico()
6. Salva no Supabase (tabela historico_cultos)
7. Recarrega dados da igreja
8. Fecha modal
```

### Editar Último Culto:
```
1. Usuário clica em "Alterar"
2. Abre modal EditLastCultoModal
3. Carrega dados do último culto
4. Usuário edita os dados
5. Clica em "Salvar Alterações"
6. Chama atualizarUltimoCultoHistorico()
7. Atualiza no Supabase (tabela historico_cultos)
8. Recarrega dados da igreja
9. Fecha modal
```

---

## 📱 Interface do Usuário

### Resumo do Culto - Novo Layout

```
┌─────────────────────────────────────────────────────────┐
│  📖 Resumo do Culto                                      │
│  Gerencie os registros de cultos                         │
│                                         [Criar] [Alterar]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  [Ícone] Nenhum resumo de culto cadastrado ainda         │
│  Use o botão "Criar" para adicionar um novo registro    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

Ou, se houver dados:

```
┌─────────────────────────────────────────────────────────┐
│  📖 Resumo do Culto                                      │
│  sexta-feira, 11 de outubro de 2025                      │
│                                         [Criar] [Alterar]│
├─────────────────────────────────────────────────────────┤
│  PALAVRA LIDA    │  HINOS CANTADOS  │  APRENDIZADO      │
│  João 3:16...    │  Hino 5, 12...   │  Amor de Deus...  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Diferenças entre Criar e Alterar

| Característica | Criar | Alterar |
|---------------|-------|---------|
| **Data** | Escolhe qualquer data | Data fixa (último culto) |
| **Registro** | Cria novo ou atualiza existente | Atualiza apenas o último |
| **Validação** | Requer data obrigatória | Verifica se há cultos |
| **Cor do botão** | Azul | Verde |
| **Total de crianças** | Atual do sistema | Mantém o original |

---

## 💡 Casos de Uso

### Caso 1: Registrar culto de hoje
1. Clique em "Criar"
2. A data de hoje já vem selecionada
3. Preencha os dados
4. Salve

### Caso 2: Registrar culto de uma data passada
1. Clique em "Criar"
2. Mude a data para o dia desejado
3. Preencha os dados
4. Salve

### Caso 3: Corrigir dados do último culto
1. Clique em "Alterar"
2. Edite os campos necessários
3. Salve

### Caso 4: Ver histórico completo
1. Clique no botão "📚 Ver Histórico"
2. Visualize todos os cultos registrados
3. Clique em "Ver Detalhes" em qualquer culto

---

## ⚠️ Observações Importantes

1. **Unicidade por data**: Só pode existir um registro de culto por data/igreja
2. **Último culto**: O botão "Alterar" sempre edita o culto mais recente
3. **Total de crianças**: No criar, usa o total atual; no alterar, mantém o original
4. **Validação**: Todos os campos de observações são opcionais
5. **Histórico permanente**: Os registros ficam salvos permanentemente no banco

---

## 🔍 Consultas Úteis

### Ver todos os cultos de uma igreja:
```sql
SELECT * FROM historico_cultos
WHERE igreja_id = 'uuid-da-igreja'
ORDER BY data DESC;
```

### Ver último culto:
```sql
SELECT * FROM historico_cultos
WHERE igreja_id = 'uuid-da-igreja'
ORDER BY data DESC
LIMIT 1;
```

### Ver cultos de um período:
```sql
SELECT * FROM historico_cultos
WHERE igreja_id = 'uuid-da-igreja'
  AND data BETWEEN '2025-10-01' AND '2025-10-31'
ORDER BY data DESC;
```

---

## 📝 Changelog

### v1.0.0 - 11/10/2025
- ✅ Adicionado botão "Criar" para criar novos registros de culto
- ✅ Adicionado botão "Alterar" para editar último culto
- ✅ Criado modal CreateCultoModal
- ✅ Criado modal EditLastCultoModal
- ✅ Adicionadas funções na store:
  - `criarCultoNoHistorico()`
  - `atualizarUltimoCultoHistorico()`
- ✅ Atualizada interface do "Resumo do Culto"
- ✅ Melhorado layout para quando não há dados

---

## 🎓 Dicas de Uso

1. **Registre os cultos regularmente**: Use o botão "Criar" após cada culto
2. **Escolha a data correta**: Sempre verifique a data antes de salvar
3. **Seja detalhado**: Quanto mais informações, melhor o histórico
4. **Use o Alterar para correções**: Se errou algo, use o "Alterar"
5. **Consulte o histórico**: Use "Ver Histórico" para revisar cultos passados

---

Desenvolvido com ❤️ para o CCB Espaço Infantil

