FROM node:16.20.2

WORKDIR /front

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]