#!/bin/bash

source ./bin/confirma.sh

echo -e '\n'

# Remove build cache - https://docs.docker.com/engine/reference/commandline/builder_prune/
docker builder prune


echo -e '\n'

yesno=""

confirm "Deseja instanciar com depuração?"

yesno=$?

if [ $yesno -eq 0 ]; then

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    # DOCKER_CONFIG=~/.docker DOCKER_BUILDKIT=0  env $(cat .env.io) docker compose up
    DOCKER_BUILDKIT=0  env $(cat .env.io) docker compose up

else

    cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

    # DOCKER_CONFIG=~/.docker env $(cat .env.io) docker compose up
    env $(cat .env.io) docker compose up
  
fi

echo -e '\n'
