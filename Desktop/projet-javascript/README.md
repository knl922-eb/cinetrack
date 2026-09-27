# CinéTrack

Application React + TypeScript pour découvrir des films, construire une watchlist et conserver ses avis personnels.

## Installation

```bash
npm install
copy .env.example .env.local
npm run dev
```

Créer un compte sur [TMDB](https://www.themoviedb.org/settings/api), puis renseigner `VITE_TMDB_TOKEN` dans `.env.local`. Sans token, CinéTrack utilise un jeu de démonstration pour garder la démo navigable.

## Scripts

`npm run dev` lance le serveur Vite avec HMR. `npm run build` lance `tsc -b` puis le build de production. `npm run test` lance Vitest.

## Fonctionnalités

- Catalogue TMDB avec recherche, filtres par genre et états chargement/erreur/succès.
- Route `/film/:id` avec synopsis, note, casting, bande-annonce et formulaire contrôlé.
- Watchlist globale via Context + `useReducer` (`AJOUTER`, `RETIRER`, `MARQUER_VU`).
- Hook générique `useFetch<T>` avec nettoyage par `AbortController`.
- Routes `/`, `/film/:id`, `/watchlist` et page 404.

## Répartition proposée

| Domaine | Responsable |
| --- | --- |
| API TMDB et hook `useFetch` | Membre 1 |
| Routage et pages | Membre 2 |
| Context, reducer et formulaire | Membre 3 |
| UI responsive et déploiement | Membre 4 |

Remplacez les noms par ceux du groupe avant le dépôt Moodle.