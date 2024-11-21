# Docker-based demo setup

## Prerequisites
* Install Docker and Docker-compose [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

* Copy the RDFox license file to [../RDFox.lic](../RDFox.lic)

* Find a dexpi file, and copy it to [../rml_mappings/pandid.xml](../rml_mappings/pandid.xml)

## Running

* From the root folder in the project ([../](../)), run  
```
docker-compose -f docker/docker-compose.yml up --build
```

* Open [http://localhost:8080](http://localhost:8080)