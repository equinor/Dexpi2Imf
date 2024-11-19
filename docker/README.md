# Docker-based demo setup

## Prerequisites
* Copy the RDFox license file to [../RDFox.lic](../RDFox.lic)

* Find a dexpi file, and its path on your computer f.ex. ` ~/source/repos/NOAKADEXPI/Blueprint/DISC_EXAMPLE-02/DISC_EXAMPLE-02-01.xml`

## Running

* From the root folder in the project ([../](../)), run  
```
docker-compose -f docker/docker-compose.yml up --build -v  ~/source/repos/NOAKADEXPI/Blueprint/DISC_EXAMPLE-02/DISC_EXAMPLE-02-01.xml:/app/pandid.xml 
```

* Open [http://localhost:8080](http://localhost:8080)