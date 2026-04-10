# Étape 1 : Construction (Build)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# On passe l'URL de l'API au moment du build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Étape 2 : Serveur de production (Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# On remplace la config nginx par défaut si besoin (optionnel)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]