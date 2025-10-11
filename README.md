# 🙏 Sistema de Gerenciamento do Espaço Infantil - CCB

![CCB Logo](./public/ccb-logo.png)

## 📖 Para o Senhor Jesus e Deus

Este sistema foi criado com amor e dedicação para servir à obra do Senhor no Espaço Infantil da Congregação Cristã no Brasil. Que este projeto possa auxiliar as irmãs auxiliadoras no cuidado das crianças durante os cultos, proporcionando segurança, organização e paz para os responsáveis e pequeninos.

> *"E disse: Deixai vir os pequeninos a mim, e não os impeçais; porque dos tais é o reino de Deus."*  
> **Lucas 18:16**

---

## 🎯 Propósito do Sistema

O **Sistema de Gerenciamento do Espaço Infantil** foi desenvolvido para auxiliar as irmãs auxiliadoras da Congregação Cristã no Brasil no gerenciamento e cuidado das crianças durante os cultos religiosos.

### Principais Objetivos:

- **Segurança**: Manter registro organizado de todas as crianças presentes no espaço infantil
- **Comunicação Rápida**: Sistema de emergência que permite chamar rapidamente os responsáveis quando necessário
- **Organização**: Controle de capacidade e informações essenciais de cada criança
- **Documentação**: Registro das atividades e ensinamentos realizados durante o culto

---

## ✨ Funcionalidades

### 1️⃣ Cadastro de Crianças
- Registro completo com nome da criança
- Informações do responsável (pai, mãe ou outro)
- Telefone para contato de emergência
- Campo de observações para informações importantes (alergias, cuidados especiais, etc.)
- Horário de entrada automático

### 2️⃣ Sistema de Emergência
- Botão de **EMERGÊNCIA** em cada card de criança
- **Alerta sonoro** automático ao acionar a emergência
- Modal elegante com informações do responsável
- Opções para:
  - Copiar número de telefone
  - Ligar diretamente (em dispositivos móveis)
- Botão de **Rechamar** caso o responsável demore
- Indicador visual quando o responsável foi chamado

### 3️⃣ Controle de Capacidade
- Configuração de capacidade máxima do espaço
- Contador em tempo real de crianças presentes
- Indicadores visuais de ocupação:
  - 🟢 Verde: até 70% da capacidade
  - 🟡 Amarelo: 70% a 90% da capacidade
  - 🔴 Vermelho: acima de 90% da capacidade

### 4️⃣ Registrando Informações Sobre o Culto
- Data do culto
- Palavra lida e versículos estudados
- Hinos cantados durante o culto
- O que as crianças aprenderam
- Exibição de resumo na tela principal

### 5️⃣ Gestão de Crianças
- Visualização em cards organizados
- Edição de informações das crianças
- Remoção com confirmação de segurança
- Layout responsivo para diferentes dispositivos

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

### 1. Iniciando o Sistema

Acesse a URL do sistema no navegador (pode ser em celular, tablet ou computador).

### 2. Configurando a Capacidade

1. Clique no botão **"Configurar"** na seção de capacidade
2. Defina o número máximo de crianças permitidas no espaço
3. Clique em **"Salvar"**

### 3. Cadastrando uma Criança

1. Clique no botão **"Nova Criança"**
2. Preencha as informações:
   - Nome da criança
   - Nome do responsável
   - Tipo (Pai, Mãe ou Outro)
   - Telefone para contato
   - Observações importantes (opcional)
3. Clique em **"Cadastrar"**

### 4. Em Caso de Emergência

1. Localize o card da criança
2. Clique no botão vermelho **"EMERGÊNCIA"**
3. Um alerta sonoro será tocado
4. Modal aparecerá com opções para:
   - **Copiar** o número do responsável
   - **Ligar** diretamente (em celulares)
5. Se necessário, use o botão **"Rechamar"** para repetir o processo

### 5. Editando Informações de uma Criança

1. No card da criança, clique no ícone de **lápis** (editar)
2. Modifique as informações necessárias
3. Clique em **"Salvar"**

### 6. Removendo uma Criança

1. No card da criança, clique no ícone de **lixeira**
2. Confirme a remoção no modal que aparecer
3. A criança será removida da lista

### 7. Registrando Informações do Culto

1. Clique no botão **"Sobre o Culto"**
2. Preencha:
   - Data do culto
   - Palavra lida (versículos e mensagem)
   - Hinos cantados
   - O que as crianças aprenderam
3. Clique em **"Salvar"**
4. As informações aparecerão no resumo na tela principal

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

## 🔒 Privacidade e Segurança

### Armazenamento Local
- **Todos os dados são armazenados apenas no navegador do dispositivo**
- Nenhuma informação é enviada para servidores externos
- Os dados permanecem privados e seguros

### Importante Saber:
- ✅ Os dados permanecem enquanto o navegador estiver aberto
- ✅ Os dados são salvos mesmo se você atualizar a página (F5)
- ✅ Os dados são mantidos no localStorage do navegador
- ⚠️ Se você limpar os dados do navegador, os registros serão perdidos
- ℹ️ Cada dispositivo/navegador tem seus próprios dados (não sincronizam)

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

## 📞 Suporte e Melhorias

Este sistema está em constante evolução. Sugestões de melhorias e relatos de problemas são bem-vindos para que possamos servir cada vez melhor à obra do Senhor.

---

<div align="center">

### ✝️ Que Deus abençoe este trabalho e todos que o utilizam! ✝️

**Desenvolvido com ❤️ para a glória de Deus**

</div>
