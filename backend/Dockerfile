# Usar una imagen base oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias y luego instalarlas
# Esto aprovecha el caché de Docker si no cambian las dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 3001

# El comando para iniciar la aplicación
CMD ["node", "index.js"]