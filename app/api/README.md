# 📡 API Routes - CCB Espaço Infantil

Documentação completa das APIs disponíveis.

## 🔧 Configuração

Todas as APIs usam o cliente Supabase configurado em `lib/supabase.ts`.

**Base URL**: `http://localhost:3000/api` (desenvolvimento)

## 📋 Endpoints Disponíveis

### 🏛️ Igrejas

#### `GET /api/igrejas`
Listar todas as igrejas

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nome": "Igreja CCB - Central",
      "data_cadastro": "2025-10-11T00:00:00Z",
      "created_at": "2025-10-11T10:00:00Z",
      "updated_at": "2025-10-11T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### `POST /api/igrejas`
Criar nova igreja

**Body:**
```json
{
  "nome": "Igreja CCB - Vila Nova"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "Igreja CCB - Vila Nova",
    "data_cadastro": "2025-10-11T00:00:00Z"
  },
  "message": "Igreja cadastrada com sucesso"
}
```

---

### 👶 Crianças

#### `GET /api/children?igreja_id={uuid}&data={YYYY-MM-DD}`
Listar crianças de uma igreja em uma data

**Query Params:**
- `igreja_id` (obrigatório): UUID da igreja
- `data` (opcional): Data no formato YYYY-MM-DD (padrão: hoje)

**Exemplo:**
```
GET /api/children?igreja_id=123e4567-e89b-12d3-a456-426614174000&data=2025-10-11
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "igreja_id": "uuid",
      "nome": "João Silva",
      "nome_responsavel": "Maria Silva",
      "tipo_responsavel": "mae",
      "celular_responsavel": "(11) 98765-4321",
      "observacoes": "Primeira vez",
      "hora_entrada": "19:00:00",
      "is_chamado_ativo": false,
      "data_cadastro": "2025-10-11"
    }
  ],
  "total": 1
}
```

#### `POST /api/children`
Cadastrar nova criança

**Body:**
```json
{
  "igreja_id": "uuid",
  "nome": "Ana Beatriz",
  "nome_responsavel": "José Santos",
  "tipo_responsavel": "pai",
  "celular_responsavel": "(11) 99999-8888",
  "observacoes": "Alérgica a amendoim",
  "hora_entrada": "19:15:00"
}
```

**Validações:**
- `tipo_responsavel`: deve ser `'pai'`, `'mae'` ou `'outro'`
- Todos os campos são obrigatórios exceto `observacoes`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "igreja_id": "uuid",
    "nome": "Ana Beatriz",
    ...
  },
  "message": "Criança cadastrada com sucesso"
}
```

#### `DELETE /api/children?id={uuid}`
Remover criança

**Query Params:**
- `id` (obrigatório): UUID da criança

**Resposta:**
```json
{
  "success": true,
  "message": "Criança removida com sucesso"
}
```

---

### 👶 Criança Individual

#### `GET /api/children/{id}`
Buscar criança por ID

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "João Silva",
    ...
  }
}
```

#### `PATCH /api/children/{id}`
Atualizar dados da criança

**Body (todos opcionais):**
```json
{
  "nome": "João Pedro Silva",
  "observacoes": "Muito educado",
  "is_chamado_ativo": false
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nome": "João Pedro Silva",
    ...
  },
  "message": "Criança atualizada com sucesso"
}
```

#### `DELETE /api/children/{id}`
Remover criança

**Resposta:**
```json
{
  "success": true,
  "message": "Criança removida com sucesso"
}
```

---

### 🚨 Emergência

#### `POST /api/children/{id}/emergencia`
Ativar/desativar chamado de emergência

**Body:**
```json
{
  "ativar": true
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_chamado_ativo": true,
    ...
  },
  "message": "🚨 Emergência ativada! Responsável deve ser chamado."
}
```

---

### 📊 Resumo do Dia

#### `GET /api/resumo-hoje`
Buscar resumo de todas as igrejas hoje

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "igreja_id": "uuid",
      "igreja_nome": "Igreja CCB - Central",
      "total_criancas": 5,
      "capacidade_maxima": 30,
      "percentual_ocupacao": 16.67,
      "chamados_ativos": 0
    }
  ],
  "totais": {
    "total_igrejas": 3,
    "total_criancas": 15,
    "total_chamados_ativos": 1
  }
}
```

---

## 🔍 Formato de Respostas

### Sucesso
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Erro
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva"
}
```

## 📝 Status HTTP

- `200` - OK (GET, PATCH, DELETE)
- `201` - Criado (POST)
- `400` - Bad Request (validação falhou)
- `404` - Not Found (recurso não encontrado)
- `500` - Internal Server Error (erro do servidor)

## 💡 Exemplos de Uso

### Usando fetch (JavaScript)

```javascript
// GET - Listar igrejas
const igrejas = await fetch('/api/igrejas')
  .then(res => res.json());

// POST - Criar igreja
const novaIgreja = await fetch('/api/igrejas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Igreja CCB - Nova' })
}).then(res => res.json());

// GET - Buscar crianças
const criancas = await fetch(
  `/api/children?igreja_id=${igrejaId}&data=2025-10-11`
).then(res => res.json());

// POST - Cadastrar criança
const novaCrianca = await fetch('/api/children', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    igreja_id: 'uuid',
    nome: 'João Silva',
    nome_responsavel: 'Maria Silva',
    tipo_responsavel: 'mae',
    celular_responsavel: '(11) 98765-4321',
    hora_entrada: '19:00:00'
  })
}).then(res => res.json());

// PATCH - Atualizar criança
const atualizada = await fetch('/api/children/uuid-da-crianca', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ observacoes: 'Criança tranquila' })
}).then(res => res.json());

// DELETE - Remover criança
await fetch('/api/children/uuid-da-crianca', {
  method: 'DELETE'
});

// POST - Ativar emergência
const emergencia = await fetch('/api/children/uuid-da-crianca/emergencia', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ativar: true })
}).then(res => res.json());
```

### Usando em Componentes React

```typescript
'use client';

import { useState, useEffect } from 'react';

const MinhaComponente = () => {
  const [criancas, setCriancas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCriancas = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/children?igreja_id=${igrejaId}`
        );
        const result = await response.json();
        
        if (result.success) {
          setCriancas(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchCriancas();
  }, [igrejaId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {criancas.map(crianca => (
        <div key={crianca.id}>{crianca.nome}</div>
      ))}
    </div>
  );
};
```

## 🔒 Segurança

- ✅ Validação de dados no backend
- ✅ Tratamento de erros consistente
- ✅ Uso de prepared statements (Supabase)
- ⚠️ RLS (Row Level Security) está permissivo temporariamente
- ⚠️ Implementar autenticação antes de produção

## 🧪 Testes

### Teste Manual com cURL

```bash
# Listar igrejas
curl http://localhost:3000/api/igrejas

# Criar igreja
curl -X POST http://localhost:3000/api/igrejas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Igreja Teste"}'

# Listar crianças
curl "http://localhost:3000/api/children?igreja_id=uuid&data=2025-10-11"

# Cadastrar criança
curl -X POST http://localhost:3000/api/children \
  -H "Content-Type: application/json" \
  -d '{
    "igreja_id":"uuid",
    "nome":"João",
    "nome_responsavel":"Maria",
    "tipo_responsavel":"mae",
    "celular_responsavel":"11999999999",
    "hora_entrada":"19:00:00"
  }'
```

## 📚 Mais Informações

- **Supabase Client**: `lib/supabase.ts`
- **Tipos TypeScript**: `types/database.types.ts`
- **Database Schema**: `database/migration.sql`

---

<div align="center">

**API pronta para uso! 🚀**

**Que Deus abençoe! 🙏**

</div>

