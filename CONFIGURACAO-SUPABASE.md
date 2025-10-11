# 🔧 Configuração do Supabase - Guia Completo

## 📋 Pré-requisitos

- ✅ Banco de dados criado no Supabase (ccbdadosdb)
- ✅ Migration executada (`database/migration.sql`)
- ✅ Node.js instalado

## 🚀 Passo 1: Instalar Dependências

```bash
npm install @supabase/supabase-js
```

## 🔑 Passo 2: Configurar Variáveis de Ambiente

### Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local` com o seguinte conteúdo:

```env
# ============================================================
# SUPABASE CONFIGURATION
# ============================================================

NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### Obter suas credenciais:

1. **Acesse**: https://supabase.com
2. **Entre no projeto**: ccbdadosdb
3. **Vá em**: Settings → API
4. **Copie**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Exemplo real (substitua com seus dados):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ubyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk4ODUwMDAwLCJleHAiOjE4MTQ0MjYwMDB9...
```

## 📁 Estrutura Criada

```
/home/marcelo/projetos/ccb/ccb-espaco-infantil/
├── .env.local                    ← VOCÊ PRECISA CRIAR ESTE ARQUIVO
├── lib/
│   └── supabase.ts              ← Cliente Supabase (✅ criado)
├── types/
│   └── database.types.ts        ← Tipos do banco (✅ criado)
└── database/
    └── migration.sql            ← Script de migração (✅ criado)
```

## 🔍 Verificar Configuração

Após configurar o `.env.local`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

No console, você NÃO deve ver o aviso:
```
⚠️ Aviso: Variáveis de ambiente do Supabase ainda não foram preenchidas!
```

## 💻 Como Usar no Código

### Exemplo 1: Buscar todas as igrejas

```typescript
import { supabase } from '@/lib/supabase';

const fetchIgrejas = async () => {
  const { data, error } = await supabase
    .from('igrejas')
    .select('*')
    .order('nome');

  if (error) {
    console.error('Erro:', error);
    return [];
  }

  return data;
};
```

### Exemplo 2: Inserir uma criança

```typescript
import { supabase } from '@/lib/supabase';
import type { ChildInsert } from '@/types/database.types';

const addChild = async (child: ChildInsert) => {
  const { data, error } = await supabase
    .from('children')
    .insert(child)
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar criança:', error);
    return null;
  }

  return data;
};
```

### Exemplo 3: Buscar crianças de hoje

```typescript
import { supabase } from '@/lib/supabase';

const getCriancasHoje = async (igrejaId: string) => {
  const hoje = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('igreja_id', igrejaId)
    .eq('data_cadastro', hoje)
    .order('hora_entrada');

  if (error) {
    console.error('Erro:', error);
    return [];
  }

  return data;
};
```

### Exemplo 4: Usar View

```typescript
import { supabase } from '@/lib/supabase';
import type { CriancasHoje } from '@/types/database.types';

const getResumoHoje = async (): Promise<CriancasHoje[]> => {
  const { data, error } = await supabase
    .from('v_criancas_hoje')
    .select('*');

  if (error) {
    console.error('Erro:', error);
    return [];
  }

  return data;
};
```

### Exemplo 5: Atualizar um registro

```typescript
import { supabase } from '@/lib/supabase';

const ativarEmergencia = async (childId: string) => {
  const { data, error } = await supabase
    .from('children')
    .update({ is_chamado_ativo: true })
    .eq('id', childId)
    .select()
    .single();

  if (error) {
    console.error('Erro:', error);
    return null;
  }

  return data;
};
```

## 🔄 Realtime (Sincronização em Tempo Real)

### Escutar mudanças em crianças:

```typescript
import { supabase } from '@/lib/supabase';

const subscribeToChildren = (igrejaId: string, callback: (child: any) => void) => {
  const channel = supabase
    .channel('children-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // 'INSERT' | 'UPDATE' | 'DELETE'
        schema: 'public',
        table: 'children',
        filter: `igreja_id=eq.${igrejaId}`,
      },
      (payload) => {
        console.log('Mudança detectada:', payload);
        callback(payload.new);
      }
    )
    .subscribe();

  // Para desinscrever:
  // channel.unsubscribe();

  return channel;
};
```

## 🛡️ Helpers Disponíveis

### Verificar se está configurado:

```typescript
import { isSupabaseConfigured } from '@/lib/supabase';

if (!isSupabaseConfigured()) {
  console.error('Supabase não configurado!');
}
```

### Tratar erros:

```typescript
import { handleSupabaseError } from '@/lib/supabase';

const { data, error } = await supabase
  .from('children')
  .insert(child);

if (error) {
  const message = handleSupabaseError(error);
  alert(message); // "Este registro já existe no banco de dados"
}
```

### Log de queries (desenvolvimento):

```typescript
import { logQuery } from '@/lib/supabase';

logQuery('children', 'INSERT', { nome: 'João' });
// Output: 🔍 Supabase Query: INSERT on children { nome: 'João' }
```

## 🎯 Próximos Passos

### 1. Migrar Zustand Store

Atualmente, o store usa `localStorage`. Você precisará:

```typescript
// store/use-space-store.ts

import { supabase } from '@/lib/supabase';

// Substituir:
// addChild: (child) => set((state) => ({ children: [...state.children, child] }))

// Por:
addChild: async (child) => {
  const { data, error } = await supabase
    .from('children')
    .insert(child)
    .select()
    .single();
  
  if (error) {
    console.error('Erro:', error);
    return;
  }
  
  set((state) => ({ children: [...state.children, data] }));
}
```

### 2. Implementar Loading States

```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('children').select('*');
    setChildren(data || []);
    setIsLoading(false);
  };
  
  fetchData();
}, []);
```

### 3. Implementar Error Handling

```typescript
const [error, setError] = useState<string | null>(null);

const saveData = async () => {
  try {
    const { error } = await supabase.from('children').insert(child);
    if (error) throw error;
    setError(null);
  } catch (err) {
    setError(handleSupabaseError(err));
  }
};
```

## ⚠️ Checklist de Segurança

- [ ] `.env.local` está no `.gitignore` ✅ (já configurado)
- [ ] Nunca commite a anon key no código
- [ ] Configure RLS (Row Level Security) para produção
- [ ] Use políticas do Supabase para limitar acesso por igreja
- [ ] Implemente autenticação antes de produção

## 🔐 Configurar RLS (Futuramente)

Quando implementar autenticação:

```sql
-- Exemplo: Usuário só vê dados de sua igreja
CREATE POLICY "Usuários veem apenas dados de sua igreja"
  ON children FOR SELECT
  USING (igreja_id = auth.jwt() ->> 'igreja_id');
```

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [TypeScript Support](https://supabase.com/docs/reference/javascript/typescript-support)
- [Realtime](https://supabase.com/docs/guides/realtime)

## 🆘 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env.local` existe na raiz
- Reinicie o servidor: `npm run dev`
- Verifique se não tem espaços ou aspas extras

### "Table 'igrejas' does not exist"
- Execute o `database/migration.sql` no Supabase SQL Editor

### "Invalid API key"
- Verifique se copiou a chave correta (anon/public)
- Não use a service_role key no frontend!

---

<div align="center">

**Configuração completa! 🎉**

Agora você pode usar o Supabase em todo o projeto.

**Que Deus abençoe! 🙏**

</div>

