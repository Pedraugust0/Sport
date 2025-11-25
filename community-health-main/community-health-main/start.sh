#!/bin/bash

# Script para iniciar o projeto Community Health
# Execute com: bash start.sh

echo "🏃 Community Health - Iniciando projeto..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Iniciar servidor de desenvolvimento
echo "🚀 Iniciando servidor de desenvolvimento..."
echo "   Acesse: http://localhost:5173"
echo ""
npm run dev
