# Spotify Listener Stats – Landing

Une application Next.js qui présente vos statistiques d’écoute Spotify (artistes, titres, tendances) avec une interface épurée. Ce dépôt est automatiquement synchronisé avec vos déploiements v0.app et déployé sur Vercel.

## Aperçu

- Framework: Next.js (TypeScript, App Router)
- UI: composants personnalisés (styles CSS/PostCSS)
- Déploiement: Vercel
- Synchronisation: v0.app pousse les changements vers ce repo
- Objectif: page(s) de landing + navigation cohérente vers les vues de stats

Site production: https://v0-spotify-listener-stats-landing.vercel.app  

## Fonctionnement de la sync v0.app

1. Créez/modifiez le projet dans v0.app  
2. Déployez les chats depuis l’interface v0  
3. Les changements sont automatiquement poussés ici  
4. Vercel déploie la dernière version du repo

## Prérequis

- Node.js 18+  
- PNPM (recommandé)  
- Compte Spotify Developer (Client ID/Secret) si vous activez l’auth réelle

## Installation

```bash
pnpm install
pnpm dev
```

Par défaut, l’app démarre sur http://localhost:3000.

## Configuration

Créez un fichier `.env.local` à la racine si vous activez l’auth Spotify:

```
SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ajustez les variables selon votre stratégie d’auth (PKCE/Authorization Code) et vos pages.

## Scripts (package.json)

- `pnpm dev` – lance le serveur de dev Next.js  
- `pnpm build` – build production  
- `pnpm start` – démarre le serveur en production  
- `pnpm lint` – (si configuré) lint du code

## Structure du projet

- `app/` – routes et pages (App Router)
- `components/` – UI réutilisable (navigation, cartes de stats…)
- `lib/` – utilitaires, intégrations (ex: API Spotify)
- `public/` – assets statiques (icônes, images)
- `styles/` – styles globaux et PostCSS config

## Déploiement

Le dépôt est connecté à Vercel. À chaque push sur `main`, Vercel déclenche un déploiement.

- Production: https://vercel.com/seonay/v0-spotify-listener-stats-landing  
- Historique des déploiements visible dans l’onglet “Deployments” du repo

Conseils:
- Définissez les variables d’environnement sur Vercel (Project Settings → Environment Variables)  
- Activez les “Protected Environments” si nécessaire pour les secrets Spotify

## Pages et navigation

Le projet inclut les pages demandées avec une navigation cohérente (header/footer). Les vues typiques:
- Accueil (Landing) – présentation, CTA “Connecter Spotify”
- Top Artistes / Top Titres – classements par période
- Tendances – évolution de l’écoute
- À propos / Mentions – contexte du projet

Adaptez les labels et le routing dans `app/` et les composants de navigation.

## Intégration Spotify (optionnelle)

Si vous consommez l’API Spotify:
- Auth: OAuth 2.0 (Authorization Code + PKCE conseillé)
- Scopes: `user-read-recently-played`, `user-top-read`, etc.
- Respectez les guidelines Spotify et limitez la fréquence des appels (caching côté serveur recommandé)

## Qualité & Styles

- TypeScript activé (`tsconfig.json`)  
- PostCSS/Tailwind (si ajouté) ou CSS Modules selon vos composants  
- Ajoutez ESLint/Prettier si non présents


## Contribuer

1. Fork  
2. Créez une branche: `feat/ma-fonctionnalite`  
3. Commit: `feat: description`  
4. Ouvrez une Pull Request

## Support

- Issues: onglet “Issues” du repo  
- Déploiement: tableau Vercel lié ci‑dessus