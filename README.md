# DEXPI mappings

## Prerequisites
* Install RDFox, and put into path

* Download [C01V04-VER.EX01.xml](https://gitlab.com/dexpi/TrainingTestCases/-/blob/1d87438391911ce06c7c6c84a6063e45f7f4a3a1/dexpi%201.3/example%20pids/C01%20DEXPI%20Reference%20P&ID/C01V04-VER.EX01.xml) to  to this folder

* Build rml-mapper from https://github.com/RMLio/rmlmapper-java.git in the folder above this one.


## Run 
```
java -jar ../rmlmapper-java/target/rmlmapper-*-all.jar -m mapping.rml.ttl -s trig -o C01V04-VER.EX01.trig
``` 

```
RDFox sandbox . dexpi
```

Open a browser at the query  
[SELECT * WHERE {  ?asset dexpi:hasConnection ?d  }](http://localhost:12110/console/test?query=SELECT%20%2A%20WHERE%20%7B%20%20%3Fasset%20dexpi%3AhasConnection%20%3Fd%20%20%7D) and click "Explore Results"

# Example DEXPI files

* https://github.com/equinor/NOAKADEXPI

* https://gitlab.com/dexpi/TrainingTestCases