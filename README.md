## Setup seacows-backend manually

```shell
# Install postgresql via docker-compose
$ wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)
$ sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
$ sudo chmod -v +x /usr/local/bin/docker-compose
$ sudo systemctl enable docker
$ sudo systemctl start docker
$ sudo systemctl status docker
$ git clone  https://github.com/yolominds/seacows-backend.git
$ cat docker-compose.yml
version: "3.8"
services:
  # rabbitmq:
  #   image: rabbitmq:3.8-management-alpine
  #   container_name: 'rabbitmq'
  #   ports:
  #       - 5673:5672
  #       - 15673:15672
  #   volumes:
  #       - ~/.docker-conf/rabbitmq/data/:/var/lib/rabbitmq/
  #       - ~/.docker-conf/rabbitmq/log/:/var/log/rabbitmq
  #   networks:
  #       - rabbitmq_nodejs
    postgres:
        image: postgres:14
        ports:
          - "127.0.0.1:5432:5432"
        command:
          [
            "postgres",
            "-cshared_preload_libraries=pg_stat_statements",
            "-cmax_connections=200"
          ]
        environment:
          POSTGRES_USER: seacows
          POSTGRES_PASSWORD: seacows
          POSTGRES_DB: seacows_backend
          PGDATA: "/var/lib/postgresql/data"
          POSTGRES_INITDB_ARGS: "-E UTF8 --locale=C"
$ docker-compose up -d
$ docker-compose ps


# Setup seacows-backend
## Install dependencies
$ curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
$ node -v
$ sudo yum -y install gcc-c++ make nodejs
$ yarn workspace @yolominds/metadata-service-api install
$ yarn workspace @yolominds/metadata-service-api run build

## db init && db migrate
$ sudo yum install  postgresql-client -y
$ psql -h 127.0.0.1 -p 5432 -U seacows -d seacows_backend -f prisma/config.sql
$ yarn workspace @yolominds/metadata-service-api run db:migrate
$ yarn workspace @yolominds/metadata-service-api run db:seed

## Start seacows-backend
$ nohup node build/src/server.js &

## test
$ curl "http://localhost:3001/goerli/collections/0xa44d5f2954eb528e9cda391c63effe56b38d6556/tokens?ids=520,521,522,523,524,525,526,527,528,529,654,656,657,658,660,661,662,664,666,667,672"
```

### [Websocket](./docs/websocket.md)
