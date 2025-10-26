# CCB Espaço Infantil - Visão Geral do Projeto

## Objetivo Funcional

Sistema de apoio ao "Espaço Infantil" da igreja CCB (Congregação Cristã no Brasil), desenvolvido para facilitar o gerenciamento de crianças durante os cultos e eventos da igreja.

### Funcionalidades Principais

- **Gestão de Crianças**: Cadastro, listagem, edição e remoção de crianças
- **Sistema de Emergência**: Ativação de chamados emergenciais para responsáveis
- **Gestão de Cultos**: Controle de histórico e observações dos cultos
- **Multi-Igreja**: Suporte a múltiplas igrejas com dados isolados
- **Sincronização em Tempo Real**: Atualizações instantâneas em todos os dispositivos conectados
- **Notificações Push**: Alertas nativos para situações de emergência

## Stack Técnica

### Frontend
- **Next.js 14** com App Router (Server Components + API Routes)
- **TypeScript** com tipagem estrita
- **TailwindCSS** para estilização
- **Zustand** para gerenciamento de estado global
- **PWA** (Progressive Web App) com Service Worker

### Backend
- **Supabase** como BaaS (Backend as a Service)
  - PostgreSQL como banco de dados
  - Realtime para sincronização em tempo real
  - Storage para arquivos (se necessário)
  - Auth para autenticação (futuro)

### Infraestrutura
- **Vercel** para deploy e hosting
- **GitHub** para versionamento
- Scripts de migração SQL automatizados

## Arquitetura do Projeto

```
ccb-espaco-infantil/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── children/      # CRUD de crianças
│   │   ├── igrejas/       # Gestão de igrejas
│   │   └── resumo-hoje/   # Resumos diários
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── modals/           # Modais (alert, confirm, emergency, etc.)
│   ├── forms/            # Formulários
│   └── ui/               # Componentes de interface
├── hooks/                # Hooks customizados
│   ├── use-realtime-sync.ts  # Sincronização em tempo real
│   ├── use-notification.ts   # Notificações push
│   └── use-modal.ts          # Gerenciamento de modais
├── store/                # Estado global (Zustand)
├── lib/                  # Configurações e utilitários
│   └── supabase.ts       # Cliente Supabase
├── types/                # Tipos TypeScript
├── database/             # Scripts SQL e migrações
├── docs/                 # Documentação
└── scripts/              # Scripts de automação
```

## Fluxos Principais

### 1. CRUD de Crianças
- **Endpoint**: `/api/children`
- **Funcionalidades**: 
  - Listagem com filtros por igreja e data
  - Cadastro com validações obrigatórias
  - Edição de informações
  - Remoção de registros
- **Validações**: Campos obrigatórios, tipos de responsável (pai/mãe/outro)

### 2. Sistema de Emergência
- **Endpoint**: `/api/children/[id]/emergencia`
- **Fluxo**:
  1. Ativação da flag `is_chamado_ativo` no banco
  2. Supabase Realtime detecta a mudança
  3. Hook `use-realtime-sync` dispara:
     - Refresh imediato em todos os dispositivos
     - Evento customizado `emergency-triggered`
     - Notificação push nativa (se habilitada)
  4. Interface atualiza automaticamente

### 3. Sincronização em Tempo Real
- **Hook**: `use-realtime-sync`
- **Canais Monitorados**:
  - `children-{igreja_id}`: Mudanças em crianças
  - `cultos-{igreja_id}`: Mudanças em cultos
  - `observacoes-{igreja_id}`: Observações de culto
  - `settings-{igreja_id}`: Configurações
  - `igrejas-global`: Mudanças em igrejas
- **Estratégias**:
  - Emergências: Refresh imediato
  - Outras mudanças: Refresh com delay (1s)

## Padrões e Convenções

### Código
- **Nomenclatura**: kebab-case para arquivos, camelCase para variáveis, PascalCase para componentes
- **Funções**: Prefixo "handle" para event handlers (ex: `handleClick`)
- **Early Returns**: Sempre que possível para melhor legibilidade
- **Tipagem**: TypeScript estrito, sem uso de `any`
- **Acessibilidade**: Implementação de ARIA labels, tabindex, etc.

### Componentes
- **Server Components**: Preferência por RSC quando possível
- **Client Components**: Apenas quando necessário ('use client')
- **Estados**: Loading e error states obrigatórios
- **Estilização**: Apenas TailwindCSS, sem CSS customizado

### API
- **Validação**: Campos obrigatórios e tipos validados
- **Tratamento de Erro**: Helper `handleSupabaseError` para mensagens amigáveis
- **Logging**: Queries logadas em desenvolvimento
- **Runtime**: Node.js com `force-dynamic`

## Banco de Dados

### Tabelas Principais
- `children`: Dados das crianças
- `igrejas`: Cadastro de igrejas
- `historico_cultos`: Histórico de cultos
- `culto_observacoes`: Observações dos cultos
- `configuracoes`: Configurações por igreja

### Relacionamentos
- Crianças vinculadas a igrejas (`igreja_id`)
- Dados isolados por igreja para multi-tenancy
- Histórico temporal com `data_cadastro`

## Recursos Avançados

### PWA (Progressive Web App)
- **Manifest**: `public/manifest.json`
- **Service Worker**: `public/sw.js`
- **Offline**: Funcionalidades básicas offline
- **Instalação**: App instalável em dispositivos móveis

### Notificações Push
- **Permissão**: Modal para solicitar permissão
- **Emergências**: Notificações automáticas para situações críticas
- **Configurável**: Usuário pode habilitar/desabilitar

### Estado Global
- **Zustand**: Store principal em `use-space-store`
- **Persistência**: Dados mantidos entre sessões
- **Sincronização**: Integração com Supabase Realtime

## Deploy e Configuração

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### Scripts Disponíveis
- `npm run dev`: Desenvolvimento local
- `npm run build`: Build para produção
- `npm run start`: Servidor de produção
- `scripts/setup-supabase.sh`: Configuração inicial do Supabase

### Vercel Deploy
- Configuração automática via `vercel.json`
- Variáveis de ambiente configuradas no dashboard
- Deploy automático via GitHub integration

## Documentação Adicional

- `docs/QUICK-START.md`: Guia de início rápido
- `docs/DEPLOY-VERCEL-GUIA.md`: Guia completo de deploy
- `docs/CONFIGURAR-VARIAVEIS-VERCEL.md`: Configuração de variáveis
- `database/migration.sql`: Script de migração do banco

## Próximos Passos / Roadmap

- [ ] Sistema de autenticação com Supabase Auth
- [ ] Relatórios e estatísticas
- [ ] Backup automático de dados
- [ ] Integração com WhatsApp para emergências
- [ ] Modo offline mais robusto
- [ ] Testes automatizados (Jest/Cypress)

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0  
**Maintainer**: Equipe de Desenvolvimento CCB
