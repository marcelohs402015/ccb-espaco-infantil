#!/bin/bash

# ============================================================
# Script de Setup do Supabase
# CCB Espaço Infantil
# ============================================================

echo "🚀 Configuração do Supabase - CCB Espaço Infantil"
echo "=================================================="
echo ""

# Verificar se .env.local já existe
if [ -f ".env.local" ]; then
    echo "⚠️  O arquivo .env.local já existe!"
    echo ""
    read -p "Deseja sobrescrever? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Operação cancelada."
        exit 0
    fi
fi

# Copiar template
echo "📋 Criando .env.local a partir do template..."
cp .env-template .env.local

if [ $? -eq 0 ]; then
    echo "✅ Arquivo .env.local criado com sucesso!"
    echo ""
    echo "📝 PRÓXIMOS PASSOS:"
    echo "─────────────────────────────────────────────"
    echo "1. Acesse: https://supabase.com"
    echo "2. Entre no projeto: ccbdadosdb"
    echo "3. Vá em: Settings → API"
    echo "4. Copie:"
    echo "   - Project URL"
    echo "   - Project API keys → anon public"
    echo ""
    echo "5. Edite o arquivo .env.local:"
    echo "   - Substitua 'sua-url-aqui' pela URL"
    echo "   - Substitua 'sua-chave-anon-aqui' pela Anon Key"
    echo ""
    echo "6. Salve e reinicie o servidor:"
    echo "   npm run dev"
    echo "─────────────────────────────────────────────"
    echo ""
    
    # Perguntar se quer abrir o editor
    if command -v code &> /dev/null; then
        read -p "Deseja abrir o .env.local no VS Code? (S/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            code .env.local
            echo "📝 Arquivo aberto no VS Code"
        fi
    fi
    
    echo ""
    echo "📚 Para mais informações, consulte:"
    echo "   - CONFIGURACAO-SUPABASE.md"
    echo "   - database/README.md"
    echo ""
    echo "🙏 Que Deus abençoe!"
else
    echo "❌ Erro ao criar .env.local"
    exit 1
fi

