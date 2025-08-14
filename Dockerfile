# Usar una imagen base de Node.js para construir la aplicación
FROM node:18-alpine AS build

WORKDIR /app

# Copiar los archivos del proyecto Angular
COPY . .

# Instalar dependencias y construir la aplicación
RUN npm install && npm run build

# Usar Nginx para servir la aplicación Angular
FROM nginx:alpine

# Copiar los archivos compilados al servidor Nginx
COPY --from=build /app/dist/sistema-examenes-frontend-san /usr/share/nginx/html

# Exponer el puerto en el que correrá la aplicación
EXPOSE 80

# Definir el comando de inicio
CMD ["nginx", "-g", "daemon off;"]
