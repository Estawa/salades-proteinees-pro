# Salades Pro by C. Guilhem

Application de tes 25 salades protéinées meal-prep : fiche recette, taux de
protéines par portion bien visible, et une photo par recette que tu prends
toi-même avec ton téléphone.

## Comment ça marche

- **Protéines par portion** : affichées en badge noir bien visible sur
  chaque carte de la liste, et en grand en haut de chaque fiche recette.
- **Photo par recette** : bouton "Prendre une photo" sur la fiche recette.
  Sur téléphone, ça ouvre directement l'appareil photo. La photo est stockée
  uniquement sur ton appareil (IndexedDB), pas sur un serveur — rien à
  configurer. Tu peux la changer à tout moment avec "Changer la photo".
- **Filtre par catégorie** : Viande / Poisson / Végétarien, en haut de la liste.
- **Mode jour/nuit** : bouton en haut à droite.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvre l'adresse affichée (en général http://localhost:5173) sur ton
téléphone connecté au même réseau, ou dans le navigateur de ton ordinateur.

## Déployer (GitHub + Vercel, comme tes autres applis)

1. Crée un nouveau dépôt sur ton compte GitHub (Estawa), par exemple
   `salades-pro-app`.
2. Depuis ce dossier :
   ```bash
   git init
   git add .
   git commit -m "Version initiale"
   git branch -M main
   git remote add origin https://github.com/<ton-compte>/salades-pro-app.git
   git push -u origin main
   ```
3. Sur Vercel, "New Project" → importe ce dépôt. Vercel détecte
   automatiquement Vite, aucun réglage à changer.
4. Une fois déployé, ouvre le lien sur ton téléphone et fais
   "Ajouter à l'écran d'accueil" (Safari/Chrome) pour l'installer comme une
   vraie application.

## Ajouter une recette plus tard

Toutes les recettes sont dans `src/data/recipes.json`. Pour en ajouter une,
copie un bloc existant et modifie `id` (unique), `title`, `category`
(`Viande`, `Poisson` ou `Végétarien`), `proteinPerServing` (nombre, en
grammes), `desc`, `ingredients`, `steps` et `notes`.

## Détails techniques

- React + Vite + Tailwind (même socle que tes autres applications)
- Photos stockées en local via IndexedDB (`idb-keyval`), redimensionnées
  automatiquement pour rester légères
- PWA installable via `vite-plugin-pwa`
- Aucune base de données externe : tout fonctionne sans backend
