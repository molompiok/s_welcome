# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json (ou yarn.lock / pnpm-lock.yaml)
COPY package*.json ./
# Si tu utilises pnpm pour les frontends aussi:
# COPY pnpm-lock.yaml ./

# Installer PNPM si tu l'utilises, sinon supprimer ces lignes
# RUN corepack enable && corepack prepare pnpm@latest --activate

# Installer les dépendances
# Si PNPM:
# RUN pnpm install --frozen-lockfile
# Si NPM:
RUN npm install

# Copier le reste du code source de l'application
# Ceci inclut vite.config.*, vike.config.*, etc.
COPY . .

# Construire l'application Vike (génère le dossier `dist/`)
RUN npm run build
# Si PNPM:
# RUN pnpm build

# ---- Stage 2: Runtime ----
FROM node:20-alpine AS runtime

WORKDIR /app

# Créer un utilisateur non-root et un groupe
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copier uniquement les fichiers nécessaires depuis le stage builder
# Copier package.json et lockfile pour installer les dépendances de production
COPY --from=builder /app/package*.json ./
# Si PNPM:
# COPY --from=builder /app/pnpm-lock.yaml ./

# Copier le dossier `dist` qui contient le serveur SSR et les assets client
COPY --from=builder /app/dist ./dist

# Installer PNPM si tu l'utilises
# RUN corepack enable && corepack prepare pnpm@latest --activate

# Installer UNIQUEMENT les dépendances de production
# Si PNPM:
# RUN pnpm install --prod --frozen-lockfile
# Si NPM:
RUN npm install --omit=dev # ou npm ci --omit=dev pour plus de reproductibilité avec package-lock.json

# Changer le propriétaire des fichiers de l'application
RUN chown -R appuser:appgroup /app

# Passer à l'utilisateur non-root
USER appuser

# Exposer le port (défini par la variable d'environnement PORT)
# EXPOSE 3000 # Informatif

# Variables d'environnement par défaut
ENV HOST=0.0.0.0
ENV NODE_ENV=production
# PORT sera injecté par Swarm ou s_server (ex: 3000 pour Vike par défaut)

# Commande pour démarrer le serveur de production Vike
# Le chemin exact peut dépendre de la configuration de ton build Vike
# CMD ["node", "dist/server/entry-server.js"]
# Ou si tu as un script "start:prod" dans package.json qui lance le serveur de production:
CMD ["npm", "run", "server:prod"]