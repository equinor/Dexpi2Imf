# RML mappings

This folder contains RML mappings, [to IMF](http://www.imfid.org/) in the folder [imf](imf) and to our custom [graphical format](../examples/graphical.trig) in the folder [graphics](graphics)

## Prerequisites

* Download a proteus xml file, for example [DISC_EXAMPLE-02-01.xml](https://github.com/equinor/NOAKADEXPI/blob/main/Blueprint/DISC_EXAMPLE-02/DISC_EXAMPLE-02-01.xml) to this folder and rename it to "pandid.xml"

## Running
You can either run the docker command documented in [../docker/README.md](../docker/README.md), which as a side-effect will run the mappings. 
Or you can run it using java:

* Install java jdk version 17 or newer
    * *Use java jdk version 17 when building rml-mapper*. To check the java version used run `mvn -version`.
        If the version 17 is not used, install this and update the `JAVA_HOME` system variable to point to version 17. 

* Install maven 

* Build rml-mapper from https://github.com/RMLio/rmlmapper-java.git in the folder above this one:
    * clone the repository
    * run `mvn install -DskipTests=true` to build the jar files
    
## Run 
```
java -jar ../../rmlmapper-java/target/rmlmapper-*-all.jar -m imf/*map* -s trig -o pandid.trig
``` 

## Example files resources
* https://github.com/equinor/NOAKADEXPI
