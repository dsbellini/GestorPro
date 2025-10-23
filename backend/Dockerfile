FROM node:20-alpine

WORKDIR /app

# Instalar NestJS CLI globalmente
RUN npm install -g @nestjs/cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
