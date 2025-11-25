#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# Community Health - Setup Completo
# ═══════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       🏃 COMMUNITY HEALTH - Setup do Projeto 🏃           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não encontrado. Por favor, instale o Node.js primeiro.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Node.js version:${NC} $(node --version)"
echo -e "${BLUE}📋 NPM version:${NC} $(npm --version)"
echo ""

# Limpar instalações anteriores problemáticas
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}🧹 Limpando instalação anterior...${NC}"
    rm -rf node_modules package-lock.json
    echo ""
fi

# Instalar dependências
echo -e "${GREEN}📦 Instalando dependências...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Erro na instalação. Tentando método alternativo...${NC}"
    npm install --legacy-peer-deps
fi

echo ""
echo -e "${GREEN}✅ Instalação concluída!${NC}"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    🚀 PRONTO PARA USO!                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Para iniciar o projeto, execute:${NC}"
echo ""
echo "   npm run dev"
echo ""
echo "ou"
echo ""
echo "   npx vite"
echo ""
echo -e "${GREEN}Depois acesse:${NC} http://localhost:5173"
echo ""
echo "────────────────────────────────────────────────────────────"
echo ""
