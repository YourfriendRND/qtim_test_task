FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env .

COPY . .

RUN npm run build
