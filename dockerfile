FROM node:20

WORKDIR /netlify-express

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=54783

EXPOSE 54783

CMD [ "npm", "start" ]