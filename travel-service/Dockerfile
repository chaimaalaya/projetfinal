FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY ./src ./src

EXPOSE 5000

CMD ["node", "src/services/server.js"]
