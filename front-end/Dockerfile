FROM node:24.0-alpine
WORKDIR /home/node/app
COPY package.json package-lock.json .
RUN npm install
COPY src/ .
EXPOSE 4200