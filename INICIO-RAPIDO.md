# 🚀 Início Rápido - Configurar Supabase

## ⚡ Configuração em 5 Minutos

### 1️⃣ Execute o Script de Setup

```bash
npm run setup:supabase
```

**OU manualmente:**

```bash
cp .env-template .env.local
```

### 2️⃣ Obtenha suas Credenciais

1. Acesse: https://supabase.com
2. Entre no projeto: **ccbdadosdb**
3. Vá em: **Settings → API**
4. Copie:
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon public key** (começa com `eyJhbGciOiJI...`)

### 3️⃣ Configure o .env.local

Edite o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

### 4️⃣ Execute a Migration

No Supabase SQL Editor, execute o arquivo `database/migration.sql`

### 5️⃣ Reinicie o Servidor

```bash
npm run dev
```

---

## ✅ Verificar se Está Funcionando

Abra o console do navegador (F12) e você NÃO deve ver:

```
⚠️ Aviso: Variáveis de ambiente do Supabase ainda não foram preenchidas!
```

Se não aparecer o aviso, está tudo certo! ✅

---

## 📂 Estrutura Criada

```
/home/marcelo/projetos/ccb/ccb-espaco-infantil/
├── .env.local                    ← Suas credenciais (CRIAR ESTE)
├── .env-template                 ← Template de exemplo
├── lib/
│   └── supabase.ts              ← Cliente Supabase (✅)
├── types/
│   └── database.types.ts        ← Tipos do banco (✅)
├── database/
│   ├── migration.sql            ← Script SQL principal (✅)
│   ├── dados-exemplo.sql        ← Dados de teste (✅)
│   ├── queries-uteis.sql        ← Queries prontas (✅)
│   └── README.md                ← Documentação completa (✅)
└── scripts/
    └── setup-supabase.sh        ← Script de setup (✅)
```

---

## 💡 Teste Rápido

Teste o Supabase diretamente no código:

```typescript
// Em qualquer componente ou página
import { supabase } from '@/lib/supabase';

const testSupabase = async () => {
  const { data, error } = await supabase
    .from('igrejas')
    .select('*');

  console.log('Igrejas:', data);
  console.log('Erro:', error);
};
```

---

## 📚 Documentação Completa

- **CONFIGURACAO-SUPABASE.md** - Guia detalhado de uso
- **database/README.md** - Estrutura do banco
- **database/INDEX.md** - Índice de todos os arquivos

---

## 🆘 Problemas?

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Variáveis de ambiente não configuradas"
1. Verifique se `.env.local` existe
2. Verifique se as variáveis estão corretas
3. Reinicie: `npm run dev`

### "Table 'igrejas' does not exist"
Execute `database/migration.sql` no Supabase SQL Editor

---

<div align="center">

**Pronto para começar! 🎉**

Consulte **CONFIGURACAO-SUPABASE.md** para exemplos de uso.

**Que Deus abençoe! 🙏**

</div>

