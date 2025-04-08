#!/bin/bash

cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

source .env

# Remove build cache - https://docs.docker.com/engine/reference/commandline/builder_prune/
docker builder prune

echo -e '\n'

docker network create $APP_NAME'_network'
docker volume create $POSTGRES_VOL
docker volume create $PGADMIN_VOL

docker volume create --driver local --opt type=none --opt device=$(pwd)/backup --opt o=bind $APP_NAME'_backup'