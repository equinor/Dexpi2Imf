# RDFox scripts for testing the DEXPI to IMF/RDF translation

## Prerequisites
Run the rml mapper scripts as described in [../rml/README.md](../rml/README.md)

This will create a file [../rml/pandid.trig](../rml/pandid.trig)

## Running the example commmissioning package
In this folder, run
```
RDFox sandbox . dexpi
```
This will load ontology and datalog rules, and in addition load the data in [../rml/pandid.trig](../rml/pandid.trig)

There are a lot of warnings about axioms in the IMF ontology that cannot be handled. This can safely be ignored. Other warnings and errors should be checked, especially if the last output is not the expected commissioning package output

## Graphical output

Ater running the script above, there 

Open a browser at [http://localhost:12110/console/test](http://localhost:12110/console/test)
and enter f.ex. the query  
`SELECT * WHERE {  ?asset imf:connectedTo ?d  }`
or
`select * where {?s a data:insideBoundaryX}`
Try also the `Explain` button on the web console.


## Running just a server for the boundaries app
To run a server for use with [Boundaries cli](../client/Boundaries/Boundaries.sln), run
```
RDFox sandbox . boundaries
```
This will load ontology and prefixes, but no data. 

## Running the pump connections example
In this folder, run
```
RDFox sandbox . connected
```
This will load ontology and datalog rules, and in addition load the data in [../rml/pandid.trig](../rml/pandid.trig)

There are a lot of warnings about axioms in the IMF ontology that cannot be handled. This can safely be ignored. Other warnings and errors should be checked, especially if the last output is not the expected commissioning package output
