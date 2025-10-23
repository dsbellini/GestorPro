Write-Host "=== SETUP GESTORPRO ===" -ForegroundColor Green

# Verificar Docker
try {
    docker --version | Out-Null
    Write-Host "Docker OK" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Docker nao encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Docker Compose  
try {
    docker-compose --version | Out-Null
    Write-Host "Docker Compose OK" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Docker Compose nao encontrado" -ForegroundColor Red
    exit 1
}

# Criar .env se necessario
if (-Not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Arquivo backend .env criado" -ForegroundColor Yellow
}

if (-Not (Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "Arquivo frontend .env criado" -ForegroundColor Yellow
}

# Subir containers (sem rebuild completo — mais rápido e consistente com bash)
Write-Host "Iniciando containers..." -ForegroundColor Cyan
docker-compose down -v
docker-compose up -d --build

# Espera o banco inicializar
Write-Host "Aguardando 60 segundos para o banco subir..." -ForegroundColor Yellow
Start-Sleep -Seconds 60


Write-Host "Gerando Prisma Client..." -ForegroundColor Cyan
docker-compose exec -T backend npx prisma generate

# Aplicar migrações dentro do container
Write-Host "Aplicando migracoes..." -ForegroundColor Cyan
docker-compose exec -T backend npx prisma migrate deploy

# Mensagem final
Write-Host ""
Write-Host "=== SETUP CONCLUIDO ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "Prisma Studio: http://localhost:5555" -ForegroundColor White