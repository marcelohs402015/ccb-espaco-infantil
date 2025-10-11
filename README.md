# 🙏 Sistema de Gerenciamento do Espaço Infantil Bíblico - CCB

![CCB Logo](./public/ccb-logo.png)

## 📖 Para o Senhor Jesus e Deus

Este sistema foi criado com amor e dedicação para servir à obra do Senhor no Espaço Infantil Bíblico da Congregação Cristã no Brasil. Que este projeto possa auxiliar as irmãs auxiliadoras no cuidado das crianças durante os cultos, proporcionando segurança, organização e paz para os responsáveis e pequeninos.

> *"E disse: Deixai vir os pequeninos a mim, e não os impeçais; porque dos tais é o reino de Deus."*  
> **Lucas 18:16**

---

## 🆕 Novidades da Versão 2.0 (Branch: developing)

### 🚀 Novas Funcionalidades Implementadas:

#### 🏛️ **Sistema Multi-Igreja**
Agora você pode gerenciar **múltiplas igrejas** no mesmo sistema! Cada igreja tem seus dados completamente isolados no localStorage, permitindo uso por diferentes congregações sem risco de misturar informações.

#### 📚 **Histórico Completo de Cultos**
Sistema automático que registra todos os cultos realizados com palavras lidas, hinos cantados e aprendizados. Inclui estatísticas e visualização detalhada.

#### 📅 **Registro de Dias de Uso**
O sistema registra automaticamente todos os dias em que foi utilizado, permitindo acompanhamento de frequência e uso.

#### 📱 **Máscara de Celular Automática**
Formatação automática do telefone no padrão brasileiro (XX) XXXXX-XXXX enquanto você digita.

#### 🔄 **Limpeza Automática de Campos**
Ao mudar a data do culto, os campos são automaticamente limpos para evitar duplicação de dados.

#### 🎨 **Interface Aprimorada**
Design moderno com glassmorphism, animações suaves e experiência de usuário otimizada.

---

## 🎯 Propósito do Sistema

O **Sistema de Gerenciamento do Espaço Infantil Bíblico** foi desenvolvido para auxiliar as irmãs auxiliadoras da Congregação Cristã no Brasil no gerenciamento e cuidado das crianças durante os cultos religiosos.

### Principais Objetivos:

- **Segurança**: Manter registro organizado de todas as crianças presentes no espaço infantil
- **Comunicação Rápida**: Sistema de emergência que permite chamar rapidamente os responsáveis quando necessário
- **Organização**: Controle de capacidade e informações essenciais de cada criança
- **Documentação**: Registro das atividades e ensinamentos realizados durante o culto

---

## ✨ Funcionalidades

### 🏛️ **NOVO!** Gerenciamento Multi-Igreja
- **Cadastro de múltiplas igrejas** com ID único e nome
- **Isolamento total de dados** por igreja no localStorage
- **Seletor de igreja** intuitivo no topo da página
- **Troca rápida** entre igrejas via dropdown
- Cada igreja mantém:
  - ✅ Suas próprias crianças cadastradas
  - ✅ Seus próprios cultos e observações
  - ✅ Seu próprio histórico completo
  - ✅ Suas próprias configurações
  - ✅ Seus próprios dias de uso
- **Gestão completa**: Adicionar, editar e remover igrejas
- **Preparado para Supabase**: Estrutura pronta para migração futura

### 📚 **NOVO!** Sistema de Histórico Completo
- **Histórico de todos os cultos** já realizados
- **Registro automático de dias de uso** do sistema
- **Estatísticas detalhadas**:
  - Total de cultos realizados
  - Total de dias que o sistema foi usado
  - Média de crianças por culto
- **Visualização organizada** por data (mais recente primeiro)
- **Botão "Ver Detalhes"** em cada culto para visualização completa
- **Campos com alturas definidas** para melhor leitura:
  - Palavra Lida: 2 linhas
  - Hinos Cantados: 4 linhas
  - O que Aprenderam: 6 linhas
- **Calendário visual** de dias de uso com indicadores coloridos
- **Isolado por igreja**: Cada igreja tem seu próprio histórico

### 1️⃣ Cadastro de Crianças
- Registro completo com nome da criança
- Informações do responsável (pai, mãe ou outro)
- **Telefone com máscara automática** (XX) XXXXX-XXXX
- Campo de observações para informações importantes (alergias, cuidados especiais, etc.)
- Horário de entrada automático
- **Pesquisa por nome** da criança

### 2️⃣ Sistema de Emergência
- Botão de **EMERGÊNCIA** em cada card de criança
- **Alerta sonoro** automático ao acionar a emergência
- **Alerta global** visível em toda a tela
- Modal elegante com informações do responsável
- Opções para:
  - Copiar número de telefone
  - Ligar diretamente (em dispositivos móveis)
- Botão de **Rechamar** caso o responsável demore
- Indicador visual quando o responsável foi chamado

### 3️⃣ Controle de Capacidade
- Configuração de capacidade máxima do espaço **por igreja**
- Contador em tempo real de crianças presentes
- Indicadores visuais de ocupação:
  - 🟢 Verde: até 70% da capacidade
  - 🟡 Amarelo: 70% a 90% da capacidade
  - 🔴 Vermelho: acima de 90% da capacidade
- **Bloqueio automático** de novos cadastros quando capacidade cheia

### 4️⃣ Registrando Informações Sobre o Culto
- Data do culto
- Palavra lida e versículos estudados
- Hinos cantados durante o culto
- O que as crianças aprenderam
- Exibição de resumo na tela principal
- **Limpeza automática de campos** ao mudar a data
- **Salvamento automático no histórico**
- Total de crianças presentes registrado automaticamente

### 5️⃣ Gestão de Crianças
- Visualização em cards organizados
- Edição de informações das crianças
- Remoção com confirmação de segurança
- Layout responsivo para diferentes dispositivos
- **Pesquisa em tempo real** por nome

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com renderização no servidor
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para maior segurança
- **TailwindCSS** - Framework CSS para estilização moderna
- **Lucide React** - Biblioteca de ícones elegantes

### Gerenciamento de Estado
- **Zustand** - State management leve e eficiente
- **localStorage** - Persistência de dados no navegador

### Recursos Especiais
- **Web Audio API** - Para alertas sonoros de emergência
- **Design Responsivo** - Funciona em celulares, tablets e computadores
- **PWA Ready** - Pode ser instalado como app no celular

---

## 🚀 Como Usar

### 1. Iniciando o Sistema pela Primeira Vez

Acesse a URL do sistema no navegador (pode ser em celular, tablet ou computador).

### 2. Cadastrando sua Igreja

**Primeira vez usando o sistema:**

1. Você verá um **alerta amarelo** no topo: "Nenhuma igreja cadastrada"
2. Clique no botão azul **"Cadastrar Igreja"**
3. Preencha:
   - **ID da Igreja**: identificador único (ex: `ccb-bras`, `ccb-mooca-01`)
   - **Nome da Igreja**: nome completo (ex: `CCB Brás`, `CCB São Paulo - Centro`)
4. Clique em **"Cadastrar"**
5. A igreja aparecerá no **dropdown** do seletor
6. Selecione a igreja no dropdown
7. Pronto! Agora você pode começar a usar o sistema

**Se você gerencia múltiplas igrejas:**

- Clique em **"Gerenciar Igrejas"** (botão azul no seletor do topo)
- Adicione quantas igrejas precisar
- Use o **dropdown** para alternar entre elas
- Cada igreja terá seus dados completamente isolados

### 3. Configurando a Capacidade

1. Clique no botão **"Configurar"** na seção de capacidade
2. Defina o número máximo de crianças permitidas no espaço
3. Clique em **"Salvar"**
4. ⚠️ **Importante**: Cada igreja pode ter sua própria capacidade máxima

### 4. Cadastrando uma Criança

1. Clique no botão **"✨ Nova Criança"**
2. Preencha as informações:
   - Nome da criança
   - Nome do responsável
   - Tipo (Pai, Mãe ou Outro)
   - **Telefone para contato** (digite só números: `11999999999` → formata automaticamente para `(11) 99999-9999`)
   - Observações importantes (opcional)
3. Clique em **"Cadastrar"**
4. A criança será cadastrada **apenas na igreja selecionada**

### 5. Em Caso de Emergência

1. Localize o card da criança
2. Clique no botão vermelho **"EMERGÊNCIA"**
3. Um alerta sonoro será tocado
4. **Alerta global** aparece na tela com destaque
5. Modal com opções para:
   - **Copiar** o número do responsável
   - **Ligar** diretamente (em celulares)
6. Se necessário, use o botão **"Rechamar"** para repetir o processo

### 6. Editando Informações de uma Criança

1. No card da criança, clique no ícone de **lápis** (editar)
2. Modifique as informações necessárias
3. Clique em **"Salvar"**

### 7. Removendo uma Criança

1. No card da criança, clique no ícone de **lixeira**
2. Confirme a remoção no modal que aparecer
3. A criança será removida da lista **da igreja atual**

### 8. Registrando Informações do Culto

1. Clique no botão **"📖 Sobre o Culto"**
2. Preencha:
   - Data do culto
   - Palavra lida (versículos e mensagem)
   - Hinos cantados
   - O que as crianças aprenderam
3. Clique em **"Salvar"**
4. As informações aparecerão no resumo na tela principal
5. **Automático**: Culto é salvo no histórico da igreja

### 9. **NOVO!** Visualizando o Histórico

1. Clique no botão **"📚 Ver Histórico"**
2. Veja as estatísticas:
   - Total de cultos realizados
   - Total de dias de uso
   - Média de crianças por culto
3. **Histórico de Cultos**: Lista completa de todos os cultos
4. **Botão "Ver Detalhes"**: Clique para ver informações completas
5. **Dias de Uso**: Calendário visual de todos os dias que o sistema foi usado

### 10. **NOVO!** Alternando Entre Igrejas

1. Use o **dropdown** no seletor azul do topo
2. Selecione a igreja desejada
3. Todos os dados mudam instantaneamente para a igreja selecionada
4. Para adicionar mais igrejas: clique em **"Gerenciar Igrejas"**

### 11. Pesquisando Crianças

1. Quando houver crianças cadastradas, um **campo de busca** aparece
2. Digite o nome da criança
3. A lista filtra em tempo real
4. Mostra quantas crianças foram encontradas

---

## 📱 Deploy no Vercel

### Passo 1: Preparar o Repositório
```bash
git add .
git commit -m "Sistema Espaço Infantil CCB"
git push origin main
```

### Passo 2: Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione o repositório `ccb-espaco-infantil`
5. Clique em **"Deploy"**
6. Aguarde a conclusão do deploy (2-3 minutos)
7. Acesse a URL fornecida pelo Vercel

### Passo 3: Usar no Celular
1. Acesse a URL do Vercel no navegador do celular
2. (Opcional) Adicione à tela inicial para acesso rápido:
   - **Android**: Menu > "Adicionar à tela inicial"
   - **iOS**: Compartilhar > "Adicionar à Tela de Início"

---

## 💾 Como Funciona a Gravação de Dados

### Sistema de Armazenamento

Este sistema foi desenvolvido com sabedoria para ser **simples, rápido e seguro**. Toda a gravação de dados acontece diretamente no **navegador** do dispositivo que você está usando, sem necessidade de servidores ou internet.

### 📱 O que é o localStorage?

O **localStorage** é uma tecnologia moderna dos navegadores que permite guardar informações diretamente no seu dispositivo (celular, tablet ou computador). É como um "caderninho digital" que o navegador mantém guardado com segurança.

### 🔄 Como os Dados São Gravados?

Quando você realiza qualquer ação no sistema, os dados são salvos **automaticamente e instantaneamente**:

#### 1. **Cadastrar uma Criança** 🧒
```
Você preenche o formulário → Clica em "Cadastrar" → Sistema salva IMEDIATAMENTE no localStorage → Criança aparece na tela
```

#### 2. **Editar Informações** ✏️
```
Você clica em "Editar" → Modifica os dados → Clica em "Salvar" → Sistema ATUALIZA no localStorage → Mudanças aparecem instantaneamente
```

#### 3. **Remover uma Criança** 🗑️
```
Você clica em "Remover" → Confirma → Sistema DELETA do localStorage → Card desaparece da tela
```

#### 4. **Configurar Capacidade** ⚙️
```
Você define a capacidade → Clica em "Salvar" → Sistema GRAVA no localStorage → Nova capacidade fica ativa
```

#### 5. **Registrar Informações do Culto** 📖
```
Você preenche os dados → Clica em "Salvar" → Sistema ARMAZENA no localStorage → Resumo aparece na tela
```

### 🔐 Tecnologia Zustand + localStorage

O sistema utiliza uma biblioteca moderna chamada **Zustand** que gerencia todos os dados e automaticamente sincroniza com o localStorage:

```typescript
// Quando você cadastra uma criança:
1. Zustand recebe os dados da criança
2. Zustand atualiza o estado da aplicação
3. Middleware "persist" GRAVA automaticamente no localStorage
4. Tela se atualiza instantaneamente mostrando a nova criança
```

### 📊 Estrutura dos Dados Salvos

Os dados são organizados de forma inteligente no localStorage com **isolamento completo por igreja**:

```json
{
  "igrejas": [
    {
      "id": "ccb-bras",
      "nome": "CCB Brás",
      "dataCadastro": "2025-10-13T10:30:00.000Z"
    },
    {
      "id": "ccb-mooca",
      "nome": "CCB Mooca",
      "dataCadastro": "2025-10-13T11:00:00.000Z"
    }
  ],
  "igrejaAtiva": "ccb-bras",
  "dadosPorIgreja": {
    "ccb-bras": {
      "children": [
        {
          "id": "1697123456789",
          "nome": "Maria da Silva",
          "nomeResponsavel": "João da Silva",
          "tipoResponsavel": "pai",
          "celularResponsavel": "(11) 99999-9999",
          "observacoes": "Alérgica a amendoim",
          "horaEntrada": "09:30"
        }
      ],
      "settings": {
        "capacidadeMaxima": 30
      },
      "cultoObservacoes": {
        "data": "2025-10-13",
        "palavraLida": "João 3:16 - Porque Deus amou o mundo...",
        "hinosCantados": "Hino 5, Hino 12, Hino 23",
        "aprendizado": "As crianças aprenderam sobre o amor de Deus"
      },
      "historicoCultos": [
        {
          "id": "1697123456789",
          "data": "2025-10-13",
          "palavraLida": "João 3:16",
          "hinosCantados": "Hino 5, 12, 23",
          "aprendizado": "O amor de Deus",
          "totalCriancas": 15
        }
      ],
      "diasDeUso": [
        {
          "data": "2025-10-13",
          "totalCriancas": 15,
          "cultoRealizado": true
        }
      ]
    },
    "ccb-mooca": {
      "children": [...],
      "settings": {...},
      "cultoObservacoes": {...},
      "historicoCultos": [...],
      "diasDeUso": [...]
    }
  }
}
```

### ⚡ Gravação em Tempo Real

- ✅ **Instantâneo**: Dados são salvos em milissegundos
- ✅ **Automático**: Você não precisa se preocupar em "salvar"
- ✅ **Confiável**: Sistema garante que os dados foram gravados
- ✅ **Sincronizado**: Tela sempre mostra os dados mais recentes

---

## 🔒 Privacidade e Segurança

### Armazenamento 100% Local e Privado

Este sistema foi desenvolvido pensando na **privacidade e segurança** das informações das crianças:

- 🔐 **Todos os dados são armazenados APENAS no navegador do dispositivo**
- 🚫 **Nenhuma informação é enviada para servidores externos**
- 🔒 **Nenhum dado trafega pela internet**
- 🛡️ **Os dados permanecem completamente privados e seguros**
- ✝️ **Proteção divina e tecnológica para as informações dos pequeninos**

### Importante Saber:

#### ✅ **O que PERMANECE**:
- Os dados ficam salvos mesmo se você **fechar o navegador**
- Os dados são mantidos mesmo se você **atualizar a página (F5)**
- Os dados permanecem se você **desligar e ligar o dispositivo**
- Os dados ficam guardados **indefinidamente** no localStorage

#### ⚠️ **O que PODE ser PERDIDO**:
- Se você **limpar os dados do navegador** (Configurações → Limpar cache)
- Se você **desinstalar o navegador**
- Se você usar **modo anônimo/privado** (dados são temporários)
- Se você **resetar o dispositivo** para configurações de fábrica

#### ℹ️ **Importante sobre Múltiplos Dispositivos**:
- Cada **dispositivo** tem seus próprios dados (celular ≠ tablet)
- Cada **navegador** tem seus próprios dados (Chrome ≠ Firefox)
- Os dados **NÃO sincronizam** entre dispositivos automaticamente
- **Recomendação**: Use um **único dispositivo** dedicado ao Espaço Infantil

### 🎯 Por que localStorage?

Escolhemos o localStorage pelos seguintes motivos abençoados:

1. **Simplicidade**: Não precisa de servidor, banco de dados ou configurações complexas
2. **Rapidez**: Acesso instantâneo aos dados, sem delays
3. **Privacidade**: Dados das crianças ficam seguros no dispositivo
4. **Gratuito**: Sem custos mensais de hospedagem ou banco de dados
5. **Confiável**: Tecnologia madura e testada em milhões de sites
6. **Offline**: Funciona perfeitamente sem internet

### 📖 Para Saber Mais

Para detalhes técnicos completos sobre o armazenamento, consulte o arquivo **COMO-FUNCIONA.md** que explica em profundidade toda a arquitetura do sistema.

---

## 💡 Dicas de Uso

### Para Irmãs Auxiliadoras:

1. **Mantenha o sistema aberto** durante todo o culto
2. **Cadastre as crianças** assim que chegarem
3. **Use o botão de emergência** sem hesitar quando necessário
4. **Preencha as observações** com informações importantes
5. **Registre o resumo do culto** ao final do dia

### Para Melhor Experiência:

- ✨ Use em modo paisagem (horizontal) no tablet para ver mais cards
- 📱 Mantenha o celular com som ligado para ouvir os alertas
- 🔋 Mantenha o dispositivo carregado durante o culto
- 📶 Não é necessária conexão com internet após carregar a página
- 🏛️ Cadastre todas as suas igrejas e alterne facilmente entre elas

---

## 🛠️ Ferramentas de Debug e Manutenção

### Verificar/Limpar localStorage

Acesse a ferramenta de debug em:
```
http://localhost:3000/limpar-storage.html
```

**Funcionalidades da Ferramenta:**
- 📊 Visualizar toda estrutura de dados do localStorage
- 🔍 Ver quantas igrejas estão cadastradas
- 📋 Verificar qual igreja está ativa
- 🗑️ Limpar TODO o localStorage (reset completo)
- ⚠️ Útil para debug e resolução de problemas

**Quando usar:**
- Se o sistema apresentar comportamento estranho
- Se precisar começar do zero
- Para verificar a integridade dos dados
- Para debug em desenvolvimento

---

## 🙏 Agradecimentos

### Glória a Deus!

Este projeto é dedicado ao **Senhor Jesus Cristo** e a **Deus Pai**, que nos deu sabedoria e capacidade para desenvolvê-lo.

> *"Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens."*  
> **Colossenses 3:23**

### Para:
- 💝 As **irmãs auxiliadoras** que dedicam seu tempo ao cuidado das crianças
- 👶 As **crianças** do Espaço Infantil, que são o futuro da igreja
- 👨‍👩‍👧‍👦 Os **pais e responsáveis** que confiam seus pequenos aos cuidados das irmãs
- ⛪ A **Congregação Cristã no Brasil**, pela obra maravilhosa que realiza

---

## 📚 Documentação Adicional

### Arquivos de Documentação:

- **COMO-FUNCIONA.md**: Explicação detalhada de como o sistema funciona tecnicamente
- **HISTORICO.md**: Documentação completa do sistema de histórico de cultos
- **README.md**: Este arquivo (visão geral do sistema)

### Links Úteis:

- **Repositório**: [GitHub - ccb-espaco-infantil](https://github.com/marcelohs402015/ccb-espaco-infantil)
- **Branch Stable**: `main` (versão estável)
- **Branch Development**: `developing` (novas funcionalidades)
- **Ferramenta Debug**: `/limpar-storage.html` (em localhost)

---

## 📞 Suporte e Melhorias

Este sistema está em constante evolução. Sugestões de melhorias e relatos de problemas são bem-vindos para que possamos servir cada vez melhor à obra do Senhor.

### Contato:
- **Desenvolvedor**: Marcelo Hernandes
- **GitHub**: [@marcelohs402015](https://github.com/marcelohs402015)

---

<div align="center">

### ✝️ Que Deus abençoe este trabalho e todos que o utilizam! ✝️

**Desenvolvido com ❤️ para a glória de Deus**

</div>
