# DEXPI mappings

## Prerequisites
Copy "C01V04-VER.EX01.xml" from https://gitlab.com/dexpi/TrainingTestCases.git to this folder

Build rml-mapper from https://github.com/RMLio/rmlmapper-java.git in the folder above this one.


## Run 
java -jar ../rmlmapper-java/rmlmapper-r372-all.jar -m mapping.rml.ttl -s trig -o C01V04-VER.EX01.trig

