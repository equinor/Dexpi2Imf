# Docker-based demo setup

## Prerequisites
* Install Docker and Docker-compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

* Copy the RDFox license file to [../RDFox.lic](../RDFox.lic)

* Find a dexpi file, and copy it to [../rml_mappings/pandid.xml](../rml_mappings/pandid.xml)

## Running

* From the root folder in the project [../](../), run  
```
docker-compose -f docker/docker-compose.yml up --build
```

* Open [http://localhost:8080](http://localhost:8080)

## Debugging

* After running npm manually, it might be necessary to delete the local packages, by deleting the folder [../www/node_modules](../www/node_modules). (On linux and mac, run `rm -rf www/node_modules`)

* To get shell access into one of the docker images, run `docker container ls` while they are runing, and then `docker exec -it <continaer-id> /bin/bash`

* For container logs, run `docker container logs <contiainer-id>` (Get container id with `docker container ls` while container is running)

## Running and building faster
To improve building time when there are changes to the docker setup, build in parallel with 
```
docker-compose -f docker/docker-compose.yml build --parallel
```

To start the containers faster when there are no changes to the docker setup, dont build:
```
docker-compose -f docker/docker-compose.yml up
```

