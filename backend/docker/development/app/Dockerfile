FROM node:18.14-alpine

ARG VERSION

ENV VERSION ${VERSION}

WORKDIR /usr/src/app

# RUN apk add --no-cache openssl

# Copiar apenas arquivos essenciais para instalar dependências (evita cache desnecessário)
COPY package.json package-lock.json ./

RUN set -ex \
 && apk add --update --no-cache bash curl \
 && npm install -g nodemon \
 && npm install --no-optional \
 && npm cache clean --force \
 && rm -rf /var/cache/apk/*

COPY . .

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]

COPY ./../../bin/docker-entrypoint.sh ./docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]