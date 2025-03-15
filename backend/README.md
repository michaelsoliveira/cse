### BOManejo
# bomanejo / backend

Implementa uma **REST API** utilizando NodeJS com Express, Postgresql, PgAdmin4 e NodeMailer e Prisma. Com a implementação de login utilizando jsonwebtoken.

Na pasta `docs` há um arquivo de testes para a API instanciada que pode ser importado na ferramenta [Insomnia](https://insomnia.rest).

Para instanciar este projeto em ambiente de desenvolvimento local, copie os arquivos:

- ```.env.example``` para ```.env```; e
- ```.env.io.example``` para ```.env.io```.

Com o [Docker](https://www.docker.com) instalado e rodando, crie os recursos externos necessários (network e volumes):

```
docker network create bomanejo_backend_development
docker volume create bomanejo_backend_development_db
docker volume create --driver local --opt type=none --opt device=$(pwd)/backup --opt o=bind bomanejo_backend_development_backup
```

> **Atenção!** Há outras formas, menos explícitas, de criar os volumes acima, porém esta reflete exatamente o que será feito nos servidores de _deploy_ para testes internos (_alpha_), testes externos (_beta_) e produção (_release_).

Por fim, instancie a aplicação:

```
env $(cat .env.io) docker-compose up --force-recreate --build --wait
```

<br>

# Utilitários para ambiente de desenvolvimento

A pasta ```bin``` contém scripts em bash que facilitam algumas operações no uso de Docker.

Estes scripts são <ins>executados manualmente</ins> para auxílio do desenvolvedor nas suas respectivas operações.

Para execução destes scripts, <ins>esteja sempre no diretório raiz do projeto.</ins>

- **build.sh**
  - Cria os volumes e a rede definidas previamente no arquivo ```.env```
    - Os quais também são utilizados no ```docker-compose.yaml```
  - Deve ser executado <ins>antes de qualquer operação</ins> se o projeto acabou de ser clonado

```
./bin/build.sh
```

<br>

- **run.sh**
  - Instancia os serviços definidos no ```docker-compose.yaml```
  - Ao final de sua execução, o prompt de comando permanece exibindo os outputs dos serviços, facilitando a visualização, como LOG dos mesmos

```
./bin/run.sh
```

<br>

- **runBackup.sh**
  - Opera um dump do banco de dados, para em seguida compactá-lo e salvá-lo na pasta ```./backup```

```
./bin/runBackup.sh
```

<br>

- **runRestore.sh**
  - Antes de sua execução, <ins>deve-se editar este script</ins> para definir qual arquivo de backup será restaurado
    - Definição a ser feita na variável de ambiente ```BACKUP_FILE_TO_RESTORE```
  - A restauração eliminirá o banco atual, recriando-o e por fim recuperando as estruturas e dados contidos no arquivo de backup indicado na variavel de ambiente

```
./bin/runRestore.sh
```

<br>

- **runSanitize.sh**
  - Executa as operações de ```vacuum``` e ```reindex``` do banco de dados PostgresSQL
    - Esta é uma operação que pode ser executada após a restauração de uma grande base de dados

```
./bin/runSanitize.sh
```

<br>

- **startDaemon.sh**
  - O mesmo que o ```run.sh``` mas com o efeito de que a execução passa a ficar em segundo plano, livrando o prompt para uso.

```
./bin/startDaemon.sh
```

<br>

- **stop.sh**
  - Encerra a execução dos containers em memória.

```
./bin/stop.sh
```

<br>

- **confirma.sh**
  - script bash de apoio
  - Usado pelos demais scripts para permitir interatividade com o usuário
  - <ins>não deve ser executado manualmente</ins>

<br>


### 2023-11-07

- **bashService.sh**
  - script bash de apoio
  - Permite acessar internamente o container por meio de shell (/bin/bash)
  - É necessário sua edição manual para inclusão do id do container desejado

```
./bin/bashService.sh
````

<br>

- **ipServices.sh**
  - script bash de apoio
  - Lista os containers em execução exibindo o seu nome e respectivo ID e IP
  - Utiliza-se como apoio do script shell **bashService.sh**

```
./bin/ipServices.sh
```

<br>

- **rebuilDB.sh**
  - script bash de apoio
  - Recria o volume do banco de dados

```
./bin/rebuilDB.sh
```