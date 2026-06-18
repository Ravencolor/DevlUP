<div align="center">

# 🚀 DevlUP

**La plateforme communautaire des développeurs**

Forum · API Hub · Quêtes quotidiennes · Classement

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)

</div>

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Base de données](#-base-de-données)
- [Lancer le projet](#-lancer-le-projet)
- [Routes API](#-routes-api)
- [Auteurs](#-auteurs)

---

## 🎯 Présentation

**DevlUP** est une plateforme communautaire conçue pour les développeurs. Elle combine un **forum de questions/réponses** (type StackOverflow), un **hub d'APIs** documentées façon Swagger, un système de **quêtes quotidiennes** pour apprendre en s'amusant, et un **classement** global pour récompenser les plus actifs.

---

## ✨ Fonctionnalités

### 💬 Forum
- Créer, modifier et supprimer des threads
- Système de commentaires avec réponses
- Vote (upvote/downvote) sur les threads et commentaires
- Marquer une réponse comme "meilleure réponse"
- Filtrage par tags
- Pagination
- Mise en favoris (bookmarks)

### 🔌 API Hub
- Catalogue d'APIs créées par la communauté
- Documentation interactive façon Swagger (endpoints, paramètres, réponses)
- Catégorisation (Finance, Social, AI, Weather, E-commerce, etc.)
- Visibilité publique/privée

### ⚡ Quêtes quotidiennes
- Une question de dev par jour (JavaScript, CSS, SQL, Git, Docker, etc.)
- Système de points à gagner
- Historique des tentatives
- Une seule tentative par quête

### 🏆 Classement
- Leaderboard global basé sur les points
- Top 10 des développeurs
- Affichage de votre position si hors du top 10

### 🔐 Authentification
- Connexion via **Google OAuth 2.0**
- Mode testeur (credentials) pour le développement
- Gestion de session avec NextAuth.js + JWT

---

## 🛠 Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 16** (App Router + Turbopack) | Framework fullstack React |
| **TypeScript 5** | Typage statique |
| **Tailwind CSS 4** | Styling utilitaire |
| **Prisma 6** | ORM & migrations |
| **PostgreSQL 17** | Base de données relationnelle |
| **NextAuth.js 4** | Authentification (Google OAuth + Credentials) |
| **Zod 4** | Validation des données |

---

## 📁 Architecture du projet

```
DevlUP/
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   ├── seed.ts                # Données de seed (APIs + quêtes)
│   └── migrations/            # Historique des migrations
├── src/
│   ├── app/
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── layout.tsx         # Layout racine
│   │   ├── globals.css        # Design system (couleurs, tokens)
│   │   ├── providers.tsx      # SessionProvider NextAuth
│   │   ├── auth/signin/       # Page de connexion
│   │   ├── quest/             # Page quête du jour
│   │   ├── leaderboard/       # Page classement
│   │   ├── apiHub/            # Hub d'APIs
│   │   ├── (main)/            # Layout avec Navbar (forum)
│   │   │   ├── threads/       # Liste & détail des threads
│   │   │   ├── bookmarks/     # Favoris
│   │   │   └── profile/       # Profil utilisateur
│   │   └── api/               # Routes API (REST)
│   │       ├── threads/       # CRUD threads
│   │       ├── comments/      # CRUD commentaires
│   │       ├── tags/          # Tags
│   │       ├── apis/          # CRUD APIs
│   │       ├── quest/         # Quête du jour + réponse
│   │       ├── leaderboard/   # Classement
│   │       ├── users/         # Profil utilisateur
│   │       └── auth/          # NextAuth handler
│   ├── modules/               # Logique métier par domaine
│   │   ├── threads/           # Threads (components, schemas, server)
│   │   ├── comments/          # Commentaires
│   │   ├── tags/              # Tags
│   │   ├── votes/             # Système de votes
│   │   ├── bookmarks/         # Favoris
│   │   └── users/             # Utilisateurs
│   ├── ui/components/nav/     # Composants UI partagés (Navbar, Sidebar)
│   ├── lib/                   # Utilitaires (auth, pagination, erreurs)
│   ├── db/                    # Client Prisma
│   └── types/                 # Types globaux
├── .env                       # Variables d'environnement
├── package.json
├── tsconfig.json
└── next.config.ts
```

### Architecture modulaire

Chaque **module** suit la même structure :
```
modules/threads/
├── components/       # Composants React (ThreadCard, ThreadList, etc.)
├── schemas/          # Schémas de validation Zod
├── server/
│   ├── thread.repository.ts   # Requêtes Prisma (accès DB)
│   ├── thread.service.ts      # Logique métier
│   └── thread.permissions.ts  # Vérifications d'autorisation
└── types.ts          # Types TypeScript
```

---

## 📦 Prérequis

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **npm** ou **yarn**
- Compte **Google Cloud** (pour OAuth, optionnel en dev)

---

## 🚀 Installation

```bash
# 1. Cloner le repository
git clone https://github.com/Ravencolor/DevlUP.git
cd DevlUP

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos valeurs (voir section ci-dessous)

# 4. Créer la base de données et appliquer les migrations
npx prisma db push

# 5. Générer le client Prisma
npx prisma generate

# 6. Seeder la base de données (APIs + quêtes)
npm run seed

# 7. Lancer le serveur de développement
npm run dev
```

---

## 🔑 Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/devlup?schema=public"

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="une-chaine-secrete-aleatoire"
```

> 💡 **En mode développement**, vous pouvez vous connecter via le bouton "Se connecter en tant que testeur" sans configurer Google OAuth.

---

## 🗄 Base de données

### Modèles principaux

| Modèle | Description |
|---|---|
| `User` | Utilisateurs (auth, profil, points) |
| `Thread` | Questions du forum |
| `Comment` | Réponses aux threads |
| `Tag` / `ThreadTag` | Tags pour catégoriser les threads |
| `ThreadVote` / `CommentVote` | Votes (upvote/downvote) |
| `Bookmark` | Favoris |
| `Api` | APIs documentées |
| `Endpoint` | Endpoints d'une API |
| `EndpointParam` | Paramètres d'un endpoint |
| `EndpointResponse` | Réponses d'un endpoint |
| `Quest` | Quêtes quotidiennes |
| `UserQuestAttempt` | Tentatives de réponse aux quêtes |

### Commandes Prisma utiles

```bash
# Visualiser la DB dans Prisma Studio
npx prisma studio

# Appliquer le schéma sans migration
npx prisma db push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la DB
npx prisma migrate reset

# Seeder la DB
npm run seed
```

---

## ▶️ Lancer le projet

```bash
# Développement (avec hot reload)
npm run dev

# Build de production
npm run build

# Lancer en production
npm start

# Linter
npm run lint
```

Le serveur démarre sur **http://localhost:3000**.

---

## 🌐 Routes API

### Threads
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/threads` | Lister les threads (paginé) |
| `POST` | `/api/threads` | Créer un thread |
| `GET` | `/api/threads/:id` | Détail d'un thread |
| `PUT` | `/api/threads/:id` | Modifier un thread |
| `DELETE` | `/api/threads/:id` | Supprimer un thread |

### Commentaires
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/comments?threadId=X` | Lister les commentaires d'un thread |
| `POST` | `/api/comments` | Créer un commentaire |
| `PUT` | `/api/comments/:id` | Modifier un commentaire |
| `DELETE` | `/api/comments/:id` | Supprimer un commentaire |

### Tags
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/tags` | Lister tous les tags |

### APIs (Hub)
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/apis` | Lister les APIs |
| `POST` | `/api/apis` | Créer une API |
| `GET` | `/api/apis/:id` | Détail d'une API (avec endpoints) |
| `PUT` | `/api/apis/:id` | Modifier une API |
| `DELETE` | `/api/apis/:id` | Supprimer une API |

### Quêtes & Classement
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/quest/today` | Quête du jour |
| `POST` | `/api/quest/answer` | Répondre à la quête |
| `GET` | `/api/leaderboard` | Classement (top 10) |

### Utilisateurs
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/users/me` | Profil de l'utilisateur connecté |
| `PUT` | `/api/users/me` | Modifier son profil |

---

## 👥 Auteurs

- **Mohammed Tahri** — [@mohammed-tahri24](https://github.com/mohammed-tahri24)
- **HLAVIEUVILLE** — [@Ravencolor](https://github.com/Ravencolor)

---

<div align="center">

Fait avec ❤️ par des développeurs, pour des développeurs.

**[⬆ Retour en haut](#-devlup)**

</div>
