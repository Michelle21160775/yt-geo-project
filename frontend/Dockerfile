FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto por defecto de Vite
EXPOSE 5173

# El comando "npm run dev" inicia el servidor.
# El argumento "--host" es VITAL para que Docker pueda exponer el puerto.
CMD ["npm", "run", "dev", "--", "--host"]