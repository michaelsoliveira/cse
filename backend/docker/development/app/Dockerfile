FROM node:18-alpine

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

EXPOSE 3333

CMD ["npm", "run", "dev"]

COPY ./../../bin/docker-entrypoint.sh ./docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]