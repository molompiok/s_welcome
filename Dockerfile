# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Installer les dépendances de développement
RUN npm ci

# Copier tout le reste du code source
COPY . .

# Construire l'application Vike (SSR + client build)
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:20-alpine AS runtime

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copier uniquement les fichiers nécessaires à l'exécution
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# S'assurer que les permissions sont correctement définies
RUN chown -R appuser:appgroup /app

# Utiliser l'utilisateur non-root
USER appuser

# Exposer le port utilisé par le serveur (optionnel, informatif)
EXPOSE 3000

# Variables d'environnement par défaut
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Démarrage du serveur SSR (adapter le chemin si besoin)
CMD ["node", "dist/server/entry-server.js"]
