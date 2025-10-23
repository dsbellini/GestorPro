# Use Node oficial
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código
COPY . .

# Expõe porta do backend
EXPOSE 3000

# Comando para rodar em dev (Hot reload com nodemon)
CMD ["npm", "run", "start:dev"]
