#!/bin/bash

echo "[Intent CLI] Installation..."
echo ""

echo "1. Installation des dépendances..."
npm install

echo ""
echo "2. Création du lien global..."
# On utilise sudo s'il est disponible et si nous ne sommes pas root
if [ "$EUID" -ne 0 ] && command -v sudo &> /dev/null; then
    echo "Besoin de permissions root pour le lien global..."
    sudo npm link
else
    npm link
fi

echo ""
echo "[SUCCES] Intent CLI est installé !"
echo "Vous pouvez maintenant taper 'intent help' dans n'importe quel terminal."
