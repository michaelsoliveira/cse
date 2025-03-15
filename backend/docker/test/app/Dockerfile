FROM node:18-alpine

ARG VERSION

ENV VERSION $VERSION

WORKDIR /usr/src/app

COPY . .

RUN set -ex \
 && apk add --update --no-cache bash curl jq \
 && jq --arg v "$VERSION" '. + { version: $v }' package.json > package-jq.json \
 && mv package-jq.json package.json \
 && npm install -g nodemon \
 && npm install --no-optional \
 && npm cache clean --force \
 && rm -rf /var/cache/apk/*

ENV PATH /usr/src/app/node_modules/.bin:$PATH

CMD [ "npm", "run", "start" ]
