FROM node:18-alpine

WORKDIR /lookalike

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]