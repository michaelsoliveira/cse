#!/bin/bash

cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

source .env
source .env.io

# Remove build cache - https://docs.docker.com/engine/reference/commandline/builder_prune/
docker builder prune

echo -e '\n'

docker network create $IO_PROJECT'_'$IO_APP'_'$IO_STAGE
docker volume create $POSTGRES_VOL
docker volume create $PGADMIN_VOL

docker volume create --driver local --opt type=none --opt device=$(pwd)/backup --opt o=bind $IO_PROJECT'_'$IO_APP'_'$IO_STAGE'_backup'