#!/bin/bash

echo "🚀 Configurando o projeto GestorPro..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env do backend se não existir
if [ ! -f "backend/.env" ]; then
    echo "📝 Criando arquivo backend/.env..."
    cp backend/.env.example backend/.env
    echo "✅ Arquivo backend/.env criado!"
else
    echo "ℹ️  Arquivo backend/.env já existe."
fi

# Criar arquivo .env do frontend se não existir
if [ ! -f "frontend/.env" ]; then
    echo "📝 Criando arquivo frontend/.env..."
    cp frontend/.env.example frontend/.env
    echo "✅ Arquivo frontend/.env criado!"
else
    echo "ℹ️  Arquivo frontend/.env já existe."
fi

echo ""
echo "🐳 Subindo containers Docker..."
docker-compose up -d

echo ""
echo "⏳ Aguardando containers iniciarem..."
sleep 10

echo ""
echo "🗄️  Executando migrações do banco de dados..."
docker-compose exec -T backend npx prisma migrate deploy
docker-compose exec -T backend npx prisma generate

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "🌐 Acesse a aplicação em:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📚 Para mais informações, consulte o README.md"