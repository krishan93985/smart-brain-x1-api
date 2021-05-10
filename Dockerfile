FROM node:16.1.0

WORKDIR /usr/src/smart-brain-x1-api

COPY ./ ./

RUN npm install

CMD ["npm","run","start"]