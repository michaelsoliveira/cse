#!/bin/bash

cd $(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/../

source .env
source .env.io

# Remove build cache - https://docs.docker.com/engine/reference/commandline/builder_prune/
docker builder prune

echo -e '\n'

docker volume rm $POSTGRES_VOL

docker volume create $POSTGRES_VOL
