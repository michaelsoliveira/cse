FROM mongo

ARG ENVIRONMENT

COPY ./docker/${ENVIRONMENT}/db/init.sh /docker-entrypoint-initdb.d/

RUN chmod o+rx /docker-entrypoint-initdb.d/*
