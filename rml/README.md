# DEXPI mappings

## Prerequisites
* Install RDFox, and put into path

* Download a proteus xml file, for example [C01V04-VER.EX01.xml](https://gitlab.com/dexpi/TrainingTestCases/-/blob/1d87438391911ce06c7c6c84a6063e45f7f4a3a1/dexpi%201.3/example%20pids/C01%20DEXPI%20Reference%20P&ID/C01V04-VER.EX01.xml) to this folder and rename it to "pandid.xml"

* Install java jdk version 17 or newer
    * *Use java jdk version 17 when building rml-mapper*. To check the java version used run `mvn -version`.
        If the version 17 is not used, install this and update the `JAVA_HOME` system variable to point to version 17. 

* Install maven

* Build rml-mapper from https://github.com/RMLio/rmlmapper-java.git in the folder above this one:
    * clone the repository
    * run `mvn install -DskipTests=true` to build the jar files
    

## Run 
```
java -jar ../../rmlmapper-java/target/rmlmapper-*-all.jar -m *map* -s trig -o pandid.trig
``` 

## Example files resources


* https://github.com/equinor/NOAKADEXPI

* https://gitlab.com/dexpi/TrainingTestCases

* https://github.com/ProteusXML/proteusxml