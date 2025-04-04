#!/bin/bash

source ./bin/confirma.sh

echo -e '\n'

yesno=""

confirm "Deseja executar serviço de RESTAURAÇÃO com depuração?"

yesno=$?

export BACKUP_FILE_TO_RESTORE=2025_04_03_21_35_05_backend_cse_1.dump.tar.gz

if [ $yesno -eq 0 ]; then

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    DOCKER_BUILDKIT=0 docker compose build --force-rm --no-cache restore 2>&1 && \
    DOCKER_BUILDKIT=0 docker compose run --rm --no-deps restore 2>&1

else

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    docker compose build --force-rm --no-cache restore 2>&1 && \
    docker compose run --rm --no-deps restore 2>&1
  
fi

echo -e '\n'
