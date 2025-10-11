#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        🚀 INICIANDO TESTE COM SUPABASE                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Verificando configuração..."

# Verificar .env.local
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local encontrado"
else
    echo "   ❌ .env.local não encontrado!"
    exit 1
fi

echo ""
echo "2️⃣  Iniciando servidor Next.js..."
echo ""
npm run dev

