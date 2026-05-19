@echo off
title Nexus ERP - Inicializador
echo ============================================
echo        Nexus ERP - Ambiente de Desenvolvimento
echo ============================================
echo.

echo [1/3] Instalando dependencias do backend...
cd /d "%~dp0Nexus ERP\backend"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias.
    pause
    exit /b 1
)
echo OK.
echo.

echo [2/3] Subindo banco de dados PostgreSQL...
cd /d "%~dp0"
docker-compose up -d db
if %errorlevel% neq 0 (
    echo ERRO: Docker nao esta rodando. Inicie o Docker Desktop primeiro.
    pause
    exit /b 1
)
echo Banco de dados pronto!
echo.

echo [3/3] Iniciando backend...
cd /d "%~dp0Nexus ERP\backend"
start "Nexus Backend" cmd /c "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo.
echo ============================================
echo  Backend rodando em: http://localhost:8000
echo  Documentacao:       http://localhost:8000/docs
echo  Frontend:           http://localhost:7777
echo ============================================
echo.
echo Pressione qualquer tecla para iniciar o frontend...
pause >nul

echo Iniciando frontend...
cd /d "%~dp0Nexus ERP"
npm run dev
