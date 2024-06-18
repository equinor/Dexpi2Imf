# DEXPI mappings

## Prerequisites
Download [C01V04-VER.EX01.xml](https://gitlab.com/dexpi/TrainingTestCases/-/blob/1d87438391911ce06c7c6c84a6063e45f7f4a3a1/dexpi%201.3/example%20pids/C01%20DEXPI%20Reference%20P&ID/C01V04-VER.EX01.xml) to  to this folder

Build rml-mapper from https://github.com/RMLio/rmlmapper-java.git in the folder above this one.


## Run 
`java -jar ../rmlmapper-java/target/rmlmapper-*-all.jar -m mapping.rml.ttl -s trig -o C01V04-VER.EX01.trig` 

