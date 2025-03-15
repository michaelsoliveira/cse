#!/bin/bash

source ./bin/confirma.sh

echo -e '\n'

yesno=""

confirm "Deseja executar serviço de RESTAURAÇÃO com depuração?"

yesno=$?

export BACKUP_FILE_TO_RESTORE=2024_02_04_01_00_44_bomanejo_backend_development_0.24.2-dev.2.dump.tar.gz

if [ $yesno -eq 0 ]; then

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    DOCKER_BUILDKIT=0 env $(cat .env.io) docker compose build --force-rm --no-cache restore 2>&1 && \
    DOCKER_BUILDKIT=0 env $(cat .env.io) docker compose run --rm --no-deps restore 2>&1

else

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    env $(cat .env.io)  docker compose build --force-rm --no-cache restore 2>&1 && \
    env $(cat .env.io) docker compose run --rm --no-deps restore 2>&1
  
fi

echo -e '\n'
