# ⚡ Início Rápido

## 🚀 Como Iniciar o Projeto

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente
```bash
# Edite o arquivo .env.local com suas credenciais do Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 3️⃣ Iniciar Servidor
```bash
npm run dev
```

### 4️⃣ Acessar
```
http://localhost:3000
```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa linter |

---

## 🌐 Deploy Rápido (Vercel)

1. Push para GitHub:
```bash
git add .
git commit -m "Deploy"
git push origin main
```

2. Vá para [vercel.com](https://vercel.com)
3. Importe o repositório
4. Configure as variáveis de ambiente
5. Deploy!

---

## 📁 Estrutura Essencial

```
ccb-espaco-infantil/
├── app/              # Páginas e API Routes
├── components/       # Componentes React
├── lib/             # Configurações (Supabase)
├── store/           # Estado global (Zustand)
├── types/           # Tipos TypeScript
├── database/        # Scripts SQL
└── public/          # Arquivos estáticos
```

---

## ✅ Checklist de Configuração

- [ ] Dependências instaladas (`npm install`)
- [ ] `.env.local` configurado com credenciais Supabase
- [ ] Servidor rodando (`npm run dev`)
- [ ] Acessível em http://localhost:3000
- [ ] Igreja cadastrada no sistema
- [ ] Capacidade máxima configurada

---

## 🆘 Problemas Comuns

### Porta 3000 em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <número_do_pid> /F

# Ou use outra porta
PORT=3001 npm run dev
```

### Erro de dependências
```bash
# Limpe e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro de build
```bash
# Limpe o cache do Next.js
rm -rf .next
npm run dev
```

---

## 📞 Suporte

**GitHub**: [@marcelohs402015](https://github.com/marcelohs402015)

---

✝️ **Desenvolvido para a glória de Deus** ✝️

