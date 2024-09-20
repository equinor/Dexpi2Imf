
# SPARQL tests 
- These tests are based on the data found in this [document](https://github.com/equinor/NOAKADEXPI/tree/main/Blueprint/DISC_EXAMPLE-02).
- The SPARQL queries without documentation can be found [here](#TODO). 

## Noaka DEXPI to IMF RDF
All dexpi piping components are modeled as blocks in IMF. Each piping component block has two terminals, one input and one output terminal. Each terminal is connected to another terminal with the help of a connector. 

All dexpi equipment are modeled as blocks im IMF. The dexpi nozzles on the equipment is modeled as terminals. A dexpi nozzle is connected to a dexpi piping network segments, these piping network segments has been modeled as imf connectors. 

### Mapping the first element to a nozzle
Attempting to connect the first piping component within a piping network segment to a nozzle.
The following SPARQL query checks that the first piping component on PipingNetworkSegment-11 is connected to a nozzle. The iri of this piping component is `asset:CustomPipingComponent-1`.

The equipment block with label `D-20VA001` has a nozzle terminal with iri `dexpi:Nozzle-11`. 
Hence, we need to check that there terminal on the equipment block `asset:CustomPipingComponent-1` shares the same connector with the `dexpi:Nozzle-11`.

```SPARQL
SELECT *
WHERE {
    ?block rdfs:label "D-20VA001" .
    ?block imf:connectedTo* asset:CustomPipingComponent-1 .
    asset:CustomPipingComponent-1 imf:hasTerminal ?componentTerminal .
    ?componentTerminal imf:hasConnector ?connector .
    ?nozzleTerminal imf:hasConnector ?connector .
    ?block imf:connectedThrough ?connector .
}
```

This query should result in the following answer:

| block | componentTerminal | connector | nozzleTerminal |
|-------|----------|-------------------| ---------------|
| asset:PressureVessel-1 | asset:PipingNode-30 | asset:Nozzle-11_connector | asset:Nozzle-11 |


When inserting this data into RDFox we get the expected answer
```SPARQL
INSERT DATA {asset:Nozzle-11 imf:hasConnector asset:Nozzle-11_connector . 
             asset:PipingNode-30 imf:hasConnector asset:Nozzle-11_connector .
             asset:CustomPipingComponent-1 imf:hasTerminal asset:PipingNode-30 .}
```
Hence, we need to create these triples in the RML mappings. 

### Mapping the first element to a nozzle
Attempting to connect the last piping component within a piping network segment to a nozzle.
The following SPARQL query checks this connection: