FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN node_modules/.bin/sequelize db:migrate

EXPOSE 3000

CMD ["npm", "run", "watch"]