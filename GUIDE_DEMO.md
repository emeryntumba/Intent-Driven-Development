# 🚀 Intent CLI - Quick Start Guide

Voici la procédure garantie **de bout en bout** pour installer et exécuter le projet sans erreur.

## 1. Installation Dépendances

Assurez-vous d'être à la racine du projet, puis lancez :

```powershell
npm install
```

## 2. Lancer la Démonstration (Méthode Garantie)

Utilisez `npx ts-node --esm` pour exécuter le CLI directement sans compilation complexe.

### Scénario A : Projet Laravel (Backend)
```powershell
# Aller dans le dossier démo
cd demo-app

# 1. Ajouter une intention (Feature Backend)
npx ts-node --esm ../bin/intent.ts add "users can reset password via email"

# 2. Voir l'explication architecturale (IA)
npx ts-node --esm ../bin/intent.ts explain

# 3. Voir le plan d'action
npx ts-node --esm ../bin/intent.ts plan

# 4. Suivre les tâches
npx ts-node --esm ../bin/intent.ts tasks
```

### Scénario B : Projet React/Next.js (Frontend)
```powershell
# Aller dans le dossier React
cd ../demo-react

# 1. Ajouter une intention (Feature Frontend)
npx ts-node --esm ../bin/intent.ts add "create dashboard page with stats component"

# 2. Vérifier le status
npx ts-node --esm ../bin/intent.ts status
```

## 3. Commandes Disponibles

| Commande | Description |
|---|---|
| `add "<int>"` | Analyse l'intention et génère un plan technique. |
| `explain` | Explique les choix d'architecture (IA/Simulation). |
| `plan` | Affiche la roadmap générée. |
| `tasks` | Checklist interactive pour suivre l'avancement. |
| `status` | Résumé de l'état actuel du projet. |
| `analyze` | Force une nouvelle analyse du dossier courant. |

---
*Astuce : Si vous voulez la commande `intent` globale, vous devez configurer votre PATH ou utiliser `npm link`, mais `npx ts-node` est plus sûr pour une démo immédiate.*
