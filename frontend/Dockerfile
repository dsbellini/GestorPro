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

# Expõe porta do frontend
EXPOSE 5173

# Comando para rodar em dev (Hot reload com Vite)
CMD ["npm", "run", "dev", "--", "--host"]
