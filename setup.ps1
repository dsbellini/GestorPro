# Script de setup para Windows PowerShell
Write-Host "🚀 Configurando o projeto GestorPro..." -ForegroundColor Green

# Verificar se Docker está instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se Docker Compose está disponível
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose encontrado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose não está disponível. Por favor, verifique sua instalação do Docker." -ForegroundColor Red
    exit 1
}

# Criar arquivo .env do backend se não existir
if (-Not (Test-Path "backend\.env")) {
    Write-Host "📝 Criando arquivo backend\.env..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Arquivo backend\.env criado!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Arquivo backend\.env já existe." -ForegroundColor Blue
}

# Criar arquivo .env do frontend se não existir
if (-Not (Test-Path "frontend\.env")) {
    Write-Host "📝 Criando arquivo frontend\.env..." -ForegroundColor Yellow
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ Arquivo frontend\.env criado!" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Arquivo frontend\.env já existe." -ForegroundColor Blue
}

Write-Host ""
Write-Host "🐳 Subindo containers Docker..." -ForegroundColor Cyan
docker-compose down -v  # Remove volumes antigos
docker-compose build --no-cache  # Build limpo
docker-compose up -d

Write-Host ""
Write-Host "⏳ Aguardando containers iniciarem..." -ForegroundColor Yellow
Write-Host "   - Banco de dados: 30 segundos"
Start-Sleep -Seconds 30
Write-Host "   - Backend: 20 segundos"  
Start-Sleep -Seconds 20
Write-Host "   - Frontend: 30 segundos (npm install + build)"
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "🗄️  Executando migrações do banco de dados..." -ForegroundColor Cyan
docker-compose exec -T backend npx prisma migrate deploy
docker-compose exec -T backend npx prisma generate

Write-Host ""
Write-Host "🎉 Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Status dos containers:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🌐 Acesse a aplicação em:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Para mais informações, consulte o README.md" -ForegroundColor Blue