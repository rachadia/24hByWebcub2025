FROM node:18-alpine as builder

# Configuration des variables d'environnement
ENV NODE_ENV=production

# Répertoire de travail
WORKDIR /app

# Installation des dépendances du frontend
COPY front-end/package*.json ./front-end/
RUN cd front-end && npm ci

# Installation des dépendances du backend
COPY back-end/package*.json ./back-end/
RUN cd back-end && npm ci

# Copie du code source
COPY front-end ./front-end
COPY back-end ./back-end

# Build du frontend
RUN cd front-end && npm run build

# Exposition des ports
EXPOSE 3000
EXPOSE 4200

# Configuration de la base de données
ENV DB_HOST=192.168.161.12:3306
ENV DB_NAME=lesmakiscodeu_the_end_page_db
ENV DB_USER=lesmakiscodeu
ENV DB_PASSWORD=LesM4ki!

# Commande de démarrage
CMD ["sh", "-c", "cd back-end && npm start & cd front-end && npm start"] 