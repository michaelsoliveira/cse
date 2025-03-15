#!/bin/bash

source ./bin/confirma.sh

echo -e '\n'

yesno=""

confirm "Deseja executar serviço de BACKUP com depuração?"

yesno=$?

if [ $yesno -eq 0 ]; then

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    DOCKER_BUILDKIT=0  env $(cat .env.io) docker compose build --force-rm --no-cache backup 2>&1 && \
    DOCKER_BUILDKIT=0  env $(cat .env.io) docker compose run --rm --no-deps backup 2>&1

else

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    env $(cat .env.io) docker compose build --force-rm --no-cache backup 2>&1 && \
    env $(cat .env.io) docker compose run --rm --no-deps backup 2>&1
  
fi

echo -e '\n'
