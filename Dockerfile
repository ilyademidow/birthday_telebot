FROM node:13.13.0-alpine3.11
WORKDIR /tmp/telebot
COPY . ./
RUN rm -rf node_modules; exit 0
RUN npm install
CMD ["npm", "start"]
