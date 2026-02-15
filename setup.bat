@echo off
echo [Intent CLI] Installation...
echo.

echo 1. Installation des dependances...
call npm install
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo 2. Creation du lien global (symlink)...
call npm link
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible de creer le lien global. Essayez de lancer ce script en Administrator.
    pause
    exit /b %errorlevel%
)

echo.
echo [SUCCES] Intent CLI est installe !
echo Vous pouvez maintenant taper 'intent help' dans n'importe quel terminal.
echo.
pause
