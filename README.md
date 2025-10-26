
<div align="center">

![CCB Logo](./public/ccb-logo.png)

# 🙏 Sistema de Gerenciamento do Espaço Infantil Bíblico

### Congregação Cristã no Brasil

*"E disse: Deixai vir os pequeninos a mim, e não os impeçais; porque dos tais é o reino de Deus."*  
**Lucas 18:16**

---

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## 🙌 Agradecimento

> "Dou graças a Deus por ter me dado a graça, sabedoria e saúde para criar este aplicativo. Que Ele abençoe cada irmã e responsável que irá usar esta ferramenta para cuidar, proteger e ensinar as crianças no espaço bíblico infantil. Que tudo seja feito para a glória de Deus!"

---

## 🚀 O que este app faz

Este sistema foi criado para ajudar as **irmãs auxiliadoras** e responsáveis pelo espaço infantil bíblico da Congregação Cristã no Brasil a:

- Gerenciar o cadastro de crianças presentes em cada culto
- Controlar a capacidade máxima do espaço infantil
- Registrar e consultar o histórico de cultos, observações e aprendizados
- Chamar rapidamente os responsáveis em caso de emergência
- Visualizar e editar informações de cada criança
- Gerenciar múltiplas igrejas/congregações de forma independente
- Garantir segurança, organização e tranquilidade para todos
- Utilizar uma interface simples, intuitiva e acessível em qualquer dispositivo

Tudo foi pensado para facilitar o trabalho das irmãs e trazer mais paz e segurança para as famílias durante os cultos.

---

## 📖 Sobre o Sistema

Sistema desenvolvido **com amor e dedicação** para auxiliar as **irmãs auxiliadoras** da Congregação Cristã no Brasil no gerenciamento e cuidado das crianças durante os cultos religiosos. Este projeto visa proporcionar **segurança, organização e paz** para os responsáveis e pequeninos.

### 🎯 Objetivos Principais

- **Segurança**: Manter registro organizado de todas as crianças presentes
- **Comunicação Rápida**: Sistema de emergência para chamar responsáveis quando necessário
- **Organização**: Controle de capacidade e informações essenciais
- **Histórico**: Registro completo das atividades e ensinamentos realizados
- **Simplicidade**: Interface intuitiva e fácil de usar, mesmo para quem não tem experiência com tecnologia

---

## ✨ Funcionalidades Completas

### 🏛️ **1. Sistema Multi-Igreja**

Gerencie múltiplas congregações em um único sistema!

- ✅ **Cadastro ilimitado de igrejas**
- ✅ **Isolamento total de dados** - Cada igreja tem seus próprios registros
- ✅ **Seletor intuitivo** no topo da página
- ✅ **Troca rápida** entre igrejas via dropdown
- ✅ **Dados independentes por igreja:**
  - Crianças cadastradas
  - Configurações de capacidade
  - Observações de cultos
  - Histórico completo
  - Dias de uso do sistema

**Como usar:**
1. No primeiro acesso, clique em "Cadastrar Igreja"
2. Preencha nome da igreja (ex: "CCB Brás", "CCB Mooca")
3. Selecione a igreja no dropdown
4. Pronto! Todos os dados serão específicos desta igreja

---

### 👶 **2. Cadastro de Crianças**

Sistema completo para registro das crianças presentes no espaço infantil.

#### Informações Cadastradas:
- 📝 **Nome da criança**
- 👨‍👩‍👧 **Dados do responsável**:
  - Nome completo
  - Tipo (Pai, Mãe ou Outro)
  - Telefone celular (formatação automática)
- 📋 **Observações importantes**:
  - Alergias (ex: "Alérgica a amendoim")
  - Cuidados especiais (ex: "Precisa tomar remédio às 15h")
  - Restrições alimentares
  - Qualquer informação relevante
- ⏰ **Hora de entrada** (registrada automaticamente)

#### Recursos Especiais:
- 🔍 **Pesquisa em tempo real** por nome da criança
- ✏️ **Editar informações** a qualquer momento
- 🗑️ **Remover criança** quando sair do espaço
- 📱 **Interface responsiva** - funciona em celular, tablet e computador

**Como usar:**
1. Clique no botão "✨ Nova Criança"
2. Preencha os dados
3. Telefone será formatado automaticamente: `11999999999` → `(11) 99999-9999`
4. Adicione observações importantes no campo específico
5. Clique em "Cadastrar"

---

### 🚨 **3. Sistema de Emergência**

Recurso vital para situações que requerem a presença do responsável.

#### Funcionamento:
1. **Botão vermelho "EMERGÊNCIA"** em cada card de criança
2. **Alerta sonoro automático** para chamar atenção
3. **Alerta visual global** na tela (barra vermelha no topo)
4. **Modal com informações do responsável**:
   - Nome completo
   - Telefone formatado
   - Botões de ação

#### Opções de Contato:
- 📋 **Copiar telefone** - Para usar em outro app
- 📞 **Ligar diretamente** - Funciona em dispositivos móveis
- 🔄 **Rechamar** - Se o responsável demorar para chegar

#### Indicadores Visuais:
- 🔴 Card fica vermelho quando emergência está ativa
- 🔊 Som de alerta toca automaticamente
- ⚠️ Alerta permanece até ser desativado

**Quando usar:**
- Criança chorando muito
- Necessidade de trocar fralda
- Criança não está se sentindo bem
- Qualquer situação que precise do responsável

---

### 📊 **4. Controle de Capacidade**

Gerenciamento inteligente do espaço disponível.

#### Recursos:
- 🎯 **Capacidade configurável** por igreja
- 📈 **Contador em tempo real** de crianças presentes
- 🚦 **Indicadores visuais de ocupação**:
  - 🟢 **Verde**: até 70% da capacidade (tranquilo)
  - 🟡 **Amarelo**: 70% a 90% (atenção)
  - 🔴 **Vermelho**: acima de 90% (quase cheio)
- 🚫 **Bloqueio automático** quando capacidade máxima é atingida

#### Exibição:
```
15 / 30 crianças presentes
50% ocupado
```

**Configurar capacidade:**
1. Clique no botão "Configurar" na seção de capacidade
2. Digite o número máximo de crianças
3. Salvar
4. O sistema bloqueará novos cadastros automaticamente se lotado

---

### 📖 **5. Registro de Cultos**

Sistema completo para documentar as atividades do espaço infantil.

#### Informações Registradas:
- 📅 **Data do culto**
- 📜 **Palavra Lida**:
  - Passagem bíblica estudada
  - Versículos lidos
  - Mensagem principal
- 🎵 **Hinos Cantados**:
  - Números dos hinos
  - Hinos especiais
- 📚 **O que as Crianças Aprenderam**:
  - Lições ensinadas
  - Atividades realizadas
  - Mensagem do dia

#### Funcionalidades:

##### 🆕 **Criar Novo Registro** (Botão Azul "Criar")
- Crie registro de cultos passados
- Útil para registrar cultos que esqueceu de documentar
- Data personalizável no formato DD/MM/AAAA
- Todos os campos editáveis

##### ✏️ **Editar Último Culto** (Botão Verde "Alterar")
- Edite o culto mais recente registrado
- Atualize palavra lida, hinos ou aprendizado
- Veja data e total de crianças do culto
- Salva automaticamente no histórico

**Como usar:**
1. **Para registro do dia:**
   - Clique em "📖 Sobre o Culto"
   - Preencha os campos
   - Salvar

2. **Para criar culto de outro dia:**
   - Clique no botão azul "Criar"
   - Escolha a data (DD/MM/AAAA)
   - Preencha informações
   - Criar Registro

3. **Para editar último culto:**
   - Clique no botão verde "Alterar"
   - Modifique campos necessários
   - Salvar Alterações

---

### 📚 **6. Histórico Completo**

Visualize todo o histórico de atividades do espaço infantil.

#### O que você vê:

##### 📊 **Estatísticas Gerais**
- 📖 **Total de cultos realizados**
- 📅 **Total de dias de uso do sistema**
- 👶 **Média de crianças por culto**

##### 📜 **Lista de Cultos**
- **Ordenação**: Mais recente primeiro
- **Informações visíveis**:
  - Data completa (dia da semana, dia, mês, ano)
  - Total de crianças presentes
  - Resumo da palavra lida
  - Resumo dos hinos
  - Resumo do aprendizado
- **Botão "Ver Detalhes"**: Abre modal com informações completas

##### 📅 **Calendário de Dias de Uso**
- Visualização de todos os dias que o sistema foi usado
- Indicadores coloridos:
  - 🟢 **Verde**: Dia com culto realizado
  - 🔵 **Azul**: Dia usado sem culto registrado
- Total de crianças por dia

**Como usar:**
1. Clique no botão "📚 Ver Histórico"
2. Veja estatísticas no topo
3. Role para ver lista de cultos
4. Clique em "Ver Detalhes" para informações completas
5. Veja calendário de dias de uso na parte inferior

---

### 🔍 **7. Sistema de Pesquisa**

Encontre crianças rapidamente.

#### Recursos:
- 🔎 **Busca em tempo real** enquanto digita
- 📝 **Pesquisa por nome** da criança
- 📊 **Contador de resultados** (ex: "3 crianças encontradas")
- 🧹 **Botão limpar** pesquisa

**Como usar:**
1. Digite o nome (ou parte do nome) no campo de pesquisa
2. Lista filtra automaticamente
3. Veja quantas crianças foram encontradas
4. Clique em "Limpar pesquisa" para ver todas novamente

---

### ⚙️ **8. Configurações por Igreja**

Cada igreja tem suas próprias configurações.

#### Configurável:
- 👥 **Capacidade máxima** do espaço
- 🏛️ **Nome da igreja** (editar ou remover)

**Gerenciar Igrejas:**
1. Clique em "Gerenciar Igrejas"
2. **Adicionar**: Cadastre nova igreja
3. **Editar**: Mude nome da igreja
4. **Remover**: Exclui igreja e TODOS seus dados
   - ⚠️ **Atenção**: Ação irreversível!

---

### 📊 **9. Registro Automático de Dias de Uso**

Sistema registra automaticamente cada dia de uso.

#### O que é registrado:
- 📅 Data de uso
- 👶 Total de crianças cadastradas no dia
- 📖 Se um culto foi realizado (sim/não)

#### Utilidade:
- Estatísticas de frequência
- Relatórios mensais
- Histórico de uso do sistema

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)

### Passo 1: Clone o Repositório

```bash
git clone https://github.com/marcelohs402015/ccb-espaco-infantil.git
cd ccb-espaco-infantil
```

### Passo 2: Instale Dependências

```bash
npm install
```

### Passo 3: Configure Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o arquivo `database/migration.sql`
4. Copie suas credenciais em **Settings** → **API**

### Passo 4: Configure Variáveis de Ambiente

```bash
# Copie o template
cp .env-template .env.local

# Edite .env.local com suas credenciais
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### Passo 5: Inicie o Servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🌐 Deploy no Vercel

### Deploy Automático

1. **Push para GitHub:**
```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

2. **Conecte ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório
   - Vercel detecta Next.js automaticamente

3. **Variáveis de Ambiente:**
   - ✨ **Automático** via integração Supabase + Vercel
   - Credenciais já configuradas!

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde ~2 minutos
   - ✅ Pronto! Projeto no ar

### Deploy Manual (CLI)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔄 Workflow de Desenvolvimento

Este projeto utiliza uma estratégia de desenvolvimento segura com ambientes separados para garantir qualidade e estabilidade.

### 🌳 Branches

- **`main`** - Produção (protegida, apenas via Pull Request)
- **`develop`** - Staging/Testes (ambiente de desenvolvimento seguro)
- **`feature/*`** - Features individuais

### 🚀 Fluxo de Desenvolvimento

#### Desenvolvendo Nova Feature:
```bash
# 1. Criar branch da feature
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade

# 2. Desenvolver e testar localmente
npm run dev:staging

# 3. Commit e push
git add .
git commit -m "feat: adicionar funcionalidade X"
git push origin feature/nome-da-funcionalidade

# 4. Criar PR para develop
# - Testar no preview deployment automático
# - Merge após aprovação
```

#### Promovendo para Produção:
```bash
# 1. Testar completamente em staging
# URL: https://seu-projeto-git-develop.vercel.app

# 2. Criar PR de develop → main
# - Revisar todas as mudanças
# - Merge após validação

# 3. Deploy automático para produção
```

### 🆘 Rollback Rápido

Se algo der errado em produção:
1. Acesse Vercel Dashboard → Deployments
2. Selecione deployment anterior estável
3. Clique em "Promote to Production"
4. Rollback completo em ~30 segundos

### 📚 Documentação Completa

Para guia completo de desenvolvimento, consulte:
- **[Workflow Detalhado](docs/WORKFLOW-DESENVOLVIMENTO.md)** - Guia completo
- **[Configuração Vercel](docs/CONFIGURACAO-VERCEL-MANUAL.md)** - Setup manual

### 🎯 Indicadores Visuais

- **Produção**: Interface limpa, sem indicadores
- **Staging**: Badge "🚧 STAGING" no header + "🚧 AMBIENTE DE TESTE" no rodapé

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com SSR
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização moderna
- **Lucide React** - Ícones elegantes

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança de dados

### State Management
- **Zustand** - Gerenciamento de estado leve

### Hospedagem
- **Vercel** - Deploy automático e CDN global

---

## 📱 Como Usar - Guia para Irmãs Auxiliadoras

### 🌅 **No Início do Culto**

1. **Abra o sistema** no celular, tablet ou computador
2. **Verifique a igreja ativa** no seletor do topo
3. **Confira a capacidade** disponível
4. **Mantenha a tela aberta** durante todo o culto

### 👶 **Quando uma Criança Chega**

1. Clique em **"✨ Nova Criança"**
2. Preencha:
   - Nome da criança
   - Nome do responsável (pai, mãe ou outro)
   - Telefone de contato
   - Observações importantes (alergias, etc.)
3. Clique em **"Cadastrar"**
4. A criança aparece na lista imediatamente

### 🚨 **Em Caso de Emergência**

1. **Localize o card** da criança
2. Clique no botão **vermelho "EMERGÊNCIA"**
3. **Som de alerta** toca automaticamente
4. **Chame o responsável**:
   - Pelo interfone/microfone
   - Ou vá pessoalmente ao salão
5. Se demorar, clique em **"Rechamar"**
6. Feche o modal quando responsável chegar

### 📖 **Registrando o Culto**

#### Durante o Culto:
- Anote mentalmente ou no papel:
  - Qual palavra foi lida
  - Quais hinos cantaram
  - O que ensinaram às crianças

#### Ao Final do Culto:
1. Clique em **"📖 Sobre o Culto"**
2. Preencha todos os campos
3. Clique em **"Salvar"**
4. Informações ficam salvas no histórico

### 🏁 **Ao Final do Culto**

1. **Remova crianças** que já foram embora:
   - Clique no ícone de **lixeira** 🗑️ no card
   - Confirme a remoção
2. **Verifique o resumo** do culto está completo
3. **Feche o sistema** ou deixe aberto para o próximo culto

---

## 💡 Dicas de Uso

### Para Melhor Experiência:

- 📱 **Use modo paisagem** no tablet para ver mais cards
- 🔊 **Mantenha som ligado** para ouvir alertas de emergência
- 🔋 **Mantenha dispositivo carregado** durante o culto
- 📶 **Conexão estável** com internet (Wi-Fi ou 4G/5G)
- 🏛️ **Cadastre todas as igrejas** que você auxilia

### Cuidados Importantes:

- ⚠️ **Sempre preencha observações** de alergias e cuidados especiais
- 📝 **Registre o culto ao final** - O histórico é importante!
- 🔐 **Não compartilhe senhas** ou credenciais do sistema
- 💾 **Verifique se salvou** antes de fechar o sistema

### Atalhos Úteis:

- **F5** - Atualizar página
- **Ctrl + F** - Buscar na página (navegador)
- **Esc** - Fechar modals abertos

---

## 🔒 Segurança e Privacidade

### Proteção de Dados:

- 🔐 **Conexão HTTPS** criptografada
- 🛡️ **Row Level Security** no banco de dados
- 🔒 **Dados isolados** por igreja
- 🚫 **Sem compartilhamento** com terceiros
- ⚖️ **Conformidade com LGPD** (Lei Geral de Proteção de Dados)

### Recomendações:

- Não deixe o dispositivo desbloqueado sem supervisão
- Use senha forte no dispositivo
- Faça logout se usar computador compartilhado
- Não fotografe informações pessoais das crianças

---

## 📊 Estrutura do Banco de Dados

### Tabelas Principais:

1. **igrejas** - Cadastro de congregações
2. **settings** - Configurações por igreja
3. **children** - Crianças cadastradas
4. **culto_observacoes** - Observações do culto atual
5. **historico_cultos** - Histórico completo de cultos
6. **dias_uso** - Registro de dias de uso

### Relacionamentos:

- Cada igreja tem suas próprias configurações
- Cada criança pertence a uma igreja
- Cada culto é associado a uma igreja
- Histórico isolado por igreja

---

## 🆘 Problemas Comuns e Soluções

### "Nenhuma igreja cadastrada"
**Solução:** Clique em "Cadastrar Igreja" e adicione sua congregação.

### "Capacidade Cheia"
**Solução:** 
1. Vá em "Configurar" na seção de capacidade
2. Aumente o número máximo
3. Ou remova crianças que já saíram

### "Erro ao salvar"
**Solução:**
1. Verifique sua conexão com internet
2. Recarregue a página (F5)
3. Tente novamente

### "Histórico não aparece"
**Solução:**
1. Certifique-se de ter salvado os cultos
2. Verifique se está na igreja correta
3. Clique em "Ver Histórico"

---

## 🙏 Dedicatória

Este projeto é dedicado ao **Senhor Jesus Cristo** e a **Deus Pai**, que nos deu sabedoria e capacidade para desenvolvê-lo.

> *"Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens."*  
> **Colossenses 3:23**

### Para:

- 💝 As **irmãs auxiliadoras** que dedicam seu tempo e amor ao cuidado das crianças
- 👶 As **crianças** do Espaço Infantil, que são o futuro da igreja
- 👨‍👩‍👧‍👦 Os **pais e responsáveis** que confiam seus pequeninos aos cuidados das irmãs
- ⛪ A **Congregação Cristã no Brasil**, pela obra maravilhosa que realiza

---

## 📞 Suporte e Contato

### Desenvolvedor:
- **Nome:** Marcelo Hernandes
- **GitHub:** [@marcelohs402015](https://github.com/marcelohs402015)

### Reportar Problemas:
- Abra uma [Issue no GitHub](https://github.com/marcelohs402015/ccb-espaco-infantil/issues)
- Descreva o problema detalhadamente
- Inclua prints se possível

### Sugestões de Melhorias:
- Compartilhe suas ideias no GitHub
- Feedback das irmãs auxiliadoras é muito bem-vindo!

---

## 📄 Licença

Este projeto é desenvolvido para uso interno da Congregação Cristã no Brasil.

---

## 🌟 Agradecimentos

Agradeço a Deus pela inspiração e sabedoria para desenvolver este sistema que auxilia no cuidado dos pequeninos durante os cultos.

Que este projeto possa servir à obra do Senhor e facilitar o trabalho das irmãs dedicadas ao Espaço Infantil Bíblico.

---

<div align="center">

### ✝️ Que Deus abençoe este trabalho e todos que o utilizam! ✝️

**Desenvolvido com ❤️ para a glória de Deus**

---

![CCB Logo](./public/ccb-logo.png)

**Congregação Cristã no Brasil**

*Sistema Espaço Infantil Bíblico v1.0.0*

</div>
