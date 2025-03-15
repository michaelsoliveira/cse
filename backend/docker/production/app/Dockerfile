FROM node:20-alpine3.17

ARG VERSION

ENV VERSION ${VERSION}

WORKDIR /usr/src/app

COPY . .

RUN set -ex \
 && apk add --update --no-cache bash curl \
 && npm install -g nodemon \
 && npm install --no-optional \
 && npm cache clean --force \
 && rm -rf /var/cache/apk/*

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npx prisma generate

CMD ["npm", "run", "start"]

COPY ./../../bin/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]