FROM node:13.13.0-alpine3.11
COPY . /tmp/telebot
WORKDIR /tmp/telebot
RUN npm install -g