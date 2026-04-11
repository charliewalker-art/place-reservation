# Étape 1 : Construction
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur de production
FROM nginx:stable-alpine
# On copie les fichiers compilés
COPY --from=build /app/dist /usr/share/nginx/html
# ON AJOUTE CETTE LIGNE :
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]