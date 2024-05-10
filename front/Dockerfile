FROM node:16.20.2-alpine3.18

EXPOSE 3000

WORKDIR /front

RUN yarn global add serve

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["serve", "-s", "build"]