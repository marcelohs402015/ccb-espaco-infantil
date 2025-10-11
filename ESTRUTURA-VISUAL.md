# 🎨 Estrutura Visual do Projeto

## 🏗️ Arquitetura Completa

```
┌─────────────────────────────────────────────────────────────┐
│                     CCB ESPAÇO INFANTIL                      │
│                  Sistema de Gestão Completo                  │
└─────────────────────────────────────────────────────────────┘

                            ┌──────────┐
                            │   USER   │
                            │ (Browser)│
                            └────┬─────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                  │
        ┌───────▼────────┐              ┌────────▼─────────┐
        │   NEXT.JS APP  │              │   API ROUTES     │
        │  (Components)  │              │   (Backend)      │
        └───────┬────────┘              └────────┬─────────┘
                │                                  │
        ┌───────▼────────┐              ┌────────▼─────────┐
        │  ZUSTAND STORE │──────────────│  SUPABASE CLIENT │
        │  (State Mgmt)  │              │   (lib/supabase) │
        └────────────────┘              └────────┬─────────┘
                                                  │
                                        ┌─────────▼──────────┐
                                        │   SUPABASE DB      │
                                        │   (PostgreSQL)     │
                                        └────────────────────┘
```

---

## 📂 Estrutura de Diretórios

```
/home/marcelo/projetos/ccb/ccb-espaco-infantil/

┌─ 📂 app/
│  ├─ 📂 api/                    ← Backend APIs
│  │  ├─ 📄 README.md           ← Documentação das APIs
│  │  ├─ 📂 igrejas/
│  │  │  └─ 📄 route.ts         ← GET, POST /api/igrejas
│  │  ├─ 📂 children/
│  │  │  ├─ 📄 route.ts         ← GET, POST, DELETE /api/children
│  │  │  └─ 📂 [id]/
│  │  │     ├─ 📄 route.ts      ← GET, PATCH, DELETE /api/children/[id]
│  │  │     └─ 📂 emergencia/
│  │  │        └─ 📄 route.ts   ← POST /api/children/[id]/emergencia
│  │  └─ 📂 resumo-hoje/
│  │     └─ 📄 route.ts         ← GET /api/resumo-hoje
│  ├─ 📄 layout.tsx
│  ├─ 📄 page.tsx
│  └─ 📄 globals.css
│
├─ 📂 components/                ← Componentes React (existentes)
│  ├─ 📄 add-child-form.tsx
│  ├─ 📄 child-card.tsx
│  ├─ 📄 header.tsx
│  └─ ... (outros)
│
├─ 📂 database/                  ← Migração do Banco de Dados
│  ├─ 📄 INDEX.md               ← 📑 Índice de tudo
│  ├─ 📄 README.md              ← 📚 Documentação completa
│  ├─ 📄 migration.sql          ⭐ Script principal (EXECUTE PRIMEIRO)
│  ├─ 📄 dados-exemplo.sql      ← 📝 Dados de teste
│  ├─ 📄 queries-uteis.sql      ← 🔍 28+ queries prontas
│  ├─ 📄 converter-dados.js     ← 🔄 JSON → SQL
│  └─ 📄 GUIA-MIGRACAO-LOCALSTORAGE.md ← Tutorial migração
│
├─ 📂 lib/                       ← Bibliotecas e utilitários
│  └─ 📄 supabase.ts            ← 🔧 Cliente Supabase configurado
│
├─ 📂 store/                     ← Gerenciamento de estado
│  └─ 📄 use-space-store.ts     ← Zustand store
│
├─ 📂 types/                     ← Tipos TypeScript
│  ├─ 📄 index.ts               ← Tipos existentes
│  └─ 📄 database.types.ts      ← 📝 Tipos do banco (NOVO)
│
├─ 📂 scripts/                   ← Scripts auxiliares
│  └─ 📄 setup-supabase.sh      ← 🚀 Setup automático
│
├─ 📂 utils/
│  └─ 📄 alert-sound.ts
│
├─ 📄 .env-template              ← 🔑 Template de variáveis
├─ 📄 .env.local                 ← 🔒 Suas credenciais (VOCÊ CRIA)
├─ 📄 .gitignore                 ← ✅ .env.local já está incluído
│
├─ 📄 package.json               ← 📦 Scripts atualizados
├─ 📄 tsconfig.json
├─ 📄 tailwind.config.ts
├─ 📄 next.config.mjs
│
└─ 📄 Documentação
   ├─ 📄 RESUMO-COMPLETO.md      ← 📋 Este resumo completo
   ├─ 📄 INICIO-RAPIDO.md        ← 🚀 Setup em 5 minutos
   ├─ 📄 CONFIGURACAO-SUPABASE.md← 📖 Guia completo de uso
   ├─ 📄 ESTRUTURA-VISUAL.md     ← 🎨 Este arquivo
   ├─ 📄 COMO-FUNCIONA.md        ← Como funciona o sistema
   ├─ 📄 HISTORICO.md
   └─ 📄 README.md               ← Documentação principal
```

---

## 🗄️ Banco de Dados - Diagrama de Relacionamentos

```
┌──────────────────────────────────────────────────────────────┐
│                         IGREJAS                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │ • id (UUID, PK)                                      │     │
│  │ • nome (VARCHAR)                                     │     │
│  │ • data_cadastro (TIMESTAMP)                         │     │
│  └────────────────────┬────────────────────────────────┘     │
└─────────────────────┬─┴─────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
        ▼             ▼             ▼              ▼
   ┌────────┐   ┌──────────┐  ┌─────────┐   ┌──────────┐
   │SETTINGS│   │ CHILDREN │  │  CULTO  │   │ HISTÓRICO│
   │        │   │          │  │  OBSERV │   │  CULTOS  │
   └────────┘   └──────────┘  └─────────┘   └──────────┘
                                                   ▲
                                                   │
                                            ┌──────────┐
                                            │ DIAS USO │
                                            └──────────┘
```

### Detalhamento das Tabelas

```
┌─────────────────────────────────────────────────────────────┐
│ SETTINGS (1:1 com IGREJAS)                                  │
├─────────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                             │
│ • igreja_id (UUID, FK → igrejas.id) UNIQUE                 │
│ • capacidade_maxima (INTEGER)                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CHILDREN (1:N com IGREJAS)                                  │
├─────────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                             │
│ • igreja_id (UUID, FK → igrejas.id)                        │
│ • nome (VARCHAR)                                            │
│ • nome_responsavel (VARCHAR)                                │
│ • tipo_responsavel (ENUM: 'pai', 'mae', 'outro')          │
│ • celular_responsavel (VARCHAR)                            │
│ • observacoes (TEXT)                                        │
│ • hora_entrada (TIME)                                       │
│ • is_chamado_ativo (BOOLEAN)                               │
│ • data_cadastro (DATE)                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CULTO_OBSERVACOES (1:N com IGREJAS)                        │
├─────────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                             │
│ • igreja_id (UUID, FK → igrejas.id)                        │
│ • data (DATE) UNIQUE per igreja                            │
│ • palavra_lida (TEXT)                                       │
│ • hinos_cantados (TEXT)                                     │
│ • aprendizado (TEXT)                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HISTORICO_CULTOS (1:N com IGREJAS)                         │
├─────────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                             │
│ • igreja_id (UUID, FK → igrejas.id)                        │
│ • data (DATE) UNIQUE per igreja                            │
│ • palavra_lida (TEXT)                                       │
│ • hinos_cantados (TEXT)                                     │
│ • aprendizado (TEXT)                                        │
│ • total_criancas (INTEGER)                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DIAS_USO (1:N com IGREJAS)                                 │
├─────────────────────────────────────────────────────────────┤
│ • id (UUID, PK)                                             │
│ • igreja_id (UUID, FK → igrejas.id)                        │
│ • data (DATE) UNIQUE per igreja                            │
│ • total_criancas (INTEGER)                                 │
│ • culto_realizado (BOOLEAN)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

### 1. Setup Inicial
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Executar migration.sql no Supabase                      │
│    ↓                                                         │
│ 2. Criar .env.local com credenciais                        │
│    ↓                                                         │
│ 3. Cliente Supabase inicializa (lib/supabase.ts)          │
│    ↓                                                         │
│ 4. Tipos TypeScript disponíveis (types/database.types.ts) │
│    ↓                                                         │
│ 5. APIs prontas para uso (app/api/)                       │
└─────────────────────────────────────────────────────────────┘
```

### 2. Cadastrar Criança (Exemplo Completo)
```
┌──────────────────────────────────────────────────────────────┐
│ USUÁRIO                                                       │
│   ↓ Preenche formulário                                      │
│ COMPONENT (add-child-form.tsx)                              │
│   ↓ handleSubmit()                                           │
│ ZUSTAND STORE (use-space-store.ts)                          │
│   ↓ addChild()                                               │
│ SUPABASE CLIENT (lib/supabase.ts)                           │
│   ↓ .from('children').insert()                              │
│ SUPABASE API                                                 │
│   ↓ PostgreSQL INSERT                                        │
│ DATABASE (Supabase)                                          │
│   ↓ Trigger update_updated_at_column()                      │
│   ↓ Row inserida                                             │
│ RESPONSE                                                      │
│   ↓ data: { id, nome, ... }                                 │
│ STORE atualiza                                               │
│   ↓                                                           │
│ COMPONENT re-renderiza                                       │
│   ↓                                                           │
│ UI atualiza automaticamente ✅                               │
└──────────────────────────────────────────────────────────────┘
```

### 3. Buscar Dados (Exemplo com API)
```
┌──────────────────────────────────────────────────────────────┐
│ COMPONENT                                                     │
│   ↓ useEffect(() => { fetch('/api/children?...') })        │
│ API ROUTE (app/api/children/route.ts)                       │
│   ↓ GET handler                                              │
│ SUPABASE CLIENT                                              │
│   ↓ .from('children').select('*')                           │
│ DATABASE                                                      │
│   ↓ Query execution                                          │
│ RESPONSE                                                      │
│   ↓ { success: true, data: [...] }                         │
│ COMPONENT                                                     │
│   ↓ setCriancas(result.data)                                │
│ UI renderiza lista ✅                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 📡 APIs - Mapa de Endpoints

```
/api/
├─ igrejas/
│  ├─ GET     → Listar todas as igrejas
│  └─ POST    → Criar nova igreja (+ settings automático)
│
├─ children/
│  ├─ GET     → Listar crianças (?igreja_id&data)
│  ├─ POST    → Cadastrar criança
│  ├─ DELETE  → Remover criança (?id)
│  └─ [id]/
│     ├─ GET     → Buscar criança específica
│     ├─ PATCH   → Atualizar criança
│     ├─ DELETE  → Remover criança
│     └─ emergencia/
│        └─ POST → Ativar/desativar emergência
│
└─ resumo-hoje/
   └─ GET     → Resumo de todas igrejas (View)
```

---

## 🎯 Ordem de Execução Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: SETUP DO BANCO                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. ✅ Acessar Supabase                                      │
│ 2. ✅ Executar database/migration.sql                       │
│ 3. ✅ Verificar tabelas criadas                             │
│ 4. ✅ (Opcional) Executar database/dados-exemplo.sql        │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: CONFIGURAR PROJETO                                  │
├─────────────────────────────────────────────────────────────┤
│ 1. ✅ Obter credenciais Supabase                            │
│ 2. ✅ Criar .env.local                                      │
│ 3. ✅ Verificar @supabase/supabase-js instalado             │
│ 4. ✅ Reiniciar npm run dev                                 │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 3: TESTAR                                              │
├─────────────────────────────────────────────────────────────┤
│ 1. ✅ Testar APIs (curl ou Postman)                        │
│ 2. ✅ Ver dados no Supabase Dashboard                      │
│ 3. ✅ Consultar com queries-uteis.sql                      │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 4: MIGRAR DADOS REAIS                                  │
├─────────────────────────────────────────────────────────────┤
│ 1. ✅ Exportar localStorage (Console)                       │
│ 2. ✅ Converter com converter-dados.js                      │
│ 3. ✅ Importar SQL no Supabase                              │
│ 4. ✅ Verificar migração                                    │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 5: INTEGRAR FRONTEND                                   │
├─────────────────────────────────────────────────────────────┤
│ 1. ⏳ Migrar Zustand Store                                  │
│ 2. ⏳ Atualizar Componentes                                 │
│ 3. ⏳ Implementar Loading States                            │
│ 4. ⏳ Implementar Error Handling                            │
│ 5. ⏳ Testar Funcionalidades                                │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 6: PRODUÇÃO                                            │
├─────────────────────────────────────────────────────────────┤
│ 1. ⏳ Configurar variáveis no Vercel                        │
│ 2. ⏳ Revisar RLS (Row Level Security)                      │
│ 3. ⏳ Implementar Autenticação                              │
│ 4. ⏳ Deploy e Testes Finais                                │
└─────────────────────────────────────────────────────────────┘

Legenda: ✅ Pronto | ⏳ Próximo Passo
```

---

## 💡 Dicas Visuais

### 🔴 Crítico (Faça Agora)
- Executar `migration.sql` no Supabase
- Criar `.env.local` com credenciais

### 🟡 Importante (Faça Logo)
- Testar APIs com dados de exemplo
- Ler documentação completa

### 🟢 Opcional (Quando Tiver Tempo)
- Migrar dados reais do localStorage
- Personalizar queries
- Implementar realtime

---

## 📚 Guia Rápido de Documentação

```
┌─────────────────────────────────────────────────────────────┐
│ QUERO...                         │ CONSULTE...              │
├──────────────────────────────────┼──────────────────────────┤
│ Começar rápido                   │ INICIO-RAPIDO.md         │
│ Entender tudo                    │ RESUMO-COMPLETO.md       │
│ Ver estrutura visual             │ ESTRUTURA-VISUAL.md (💡) │
│ Configurar Supabase              │ CONFIGURACAO-SUPABASE.md │
│ Migrar localStorage              │ GUIA-MIGRACAO-...md      │
│ Entender banco de dados          │ database/README.md       │
│ Queries prontas                  │ database/queries-uteis...│
│ Usar APIs                        │ app/api/README.md        │
│ Índice de arquivos DB            │ database/INDEX.md        │
└─────────────────────────────────────────────────────────────┘
```

---

<div align="center">

## ✨ Estrutura Completa Criada!

**17 Arquivos Novos**  
**6 Tabelas + 2 Views + 2 Funções**  
**8 API Routes Funcionais**  
**9 Documentações Detalhadas**

---

### 🚀 Próximo Passo

```bash
npm run setup:supabase
```

Ou consulte: **INICIO-RAPIDO.md**

---

**Que Deus abençoe! 🙏**

</div>

