
# SPARQL tests 
- These tests are based on the data found in this [document](https://github.com/equinor/NOAKADEXPI/tree/main/Blueprint/DISC_EXAMPLE-02).
- The SPARQL queries without documentation can be found [here](#TODO). 

## Noaka DEXPI to IMF RDF
All dexpi piping components are modeled as blocks in IMF. Each piping component block has two terminals, one input and one output terminal. Each terminal is connected to another terminal with the help of a connector. 

All dexpi equipment are modeled as blocks im IMF. The dexpi nozzles on the equipment is modeled as terminals. A dexpi nozzle is connected to a dexpi piping network segments, these piping network segments has been modeled as imf connectors. 

### Connecting piping components to nozzles 
`asset:PipingNetworkSegment-4` connects two equipment blocks togehter;
- `asset:RotaryPump-1` with tag name D-20PA001
- `asset:PlateHeatExchanger-1` with tag name D-20HA001 
- 
`asset:PipingNetworkSegment-4` begins from `dexpi:Nozzle-2` and ends at `asset:Nozzle-3`, hence connecting `asset:RotaryPump-1` to `asset:PlateHeatExhanger-1`. 

The only piping component contained within `asset:PipingNetworkSegment-4` is the piping component block `asset:Flange-3`. Hence, the input terminal `asset:Flange-3` should share the same connector as `dexpi:Nozzle-2`, and the output terminal should share the same connector as `asset:Nozzle-3` :

```trig
:Flange-3_input imf:hasConnector imf:connector-1 .
dexpi:Nozzle-2 imf:hasConnector imf:connector-1 .
:Flange-3_output imf:hasConnector imf:connector-2 .
dexpi:Nozzle-3 imf:hasConnector imf:connector-2 . 
```

#### Mapping the first element to a nozzle
Attempting to connect the first piping component within a piping network segment to a nozzle.

```SPARQL
SELECT *
WHERE {
    ?block rdfs:label "D-20HA001" .
    ?block imf:connectedTo* asset:Flange-3 .
    asset:Flange-3 imf:hasTerminal ?componentTerminal .
    ?componentTerminal imf:hasConnector ?connector .
    ?nozzleTerminal imf:hasConnector ?connector .
    ?block imf:connectedThrough ?connector .
}
```

This query should result in the following answer:

| block | componentTerminal | connector | nozzleTerminal |
|-------|----------|-------------------| ---------------|
| asset:PressureVessel-1 | asset:PipingNode-7 | asset:Nozzle-2_connector | asset:Nozzle-2 |

When inserting this data into RDFox we get the expected answer.
```SPARQL
INSERT DATA {
                asset:Nozzle-2 imf:hasConnector asset:Nozzle-2_connector . 
                asset:PipingNode-7 imf:hasConnector asset:Nozzle-2_connector .
                asset:Flange-3 imf:hasTerminal asset:PipingNode-7 .
                asset:PipingNode-7 a imf:InputTerminal .
            } 
```
Hence, we need to create these triples in the RML mappings. 

#### Mapping the last element to a nozzle
Attempting to connect the last piping component within a piping network segment to a nozzle.
```SPARQL
SELECT *
WHERE {
    ?block rdfs:label "D-20HA001" .
    ?block imf:connectedTo* asset:Flange-3 .
    asset:Flange-3 imf:hasTerminal ?componentTerminal .
    ?componentTerminal imf:hasConnector ?connector .
    ?nozzleTerminal imf:hasConnector ?connector .
    ?block imf:connectedThrough ?connector .
}
```

This query should result in the following answer:

| block | componentTerminal | connector | nozzleTerminal |
|-------|----------|-------------------| ---------------|
| asset:PlateHeatExchanger-1 | asset:PipingNode-8 | asset:Nozzle-3_connector | asset:Nozzle-3 |

When inserting this data into RDFox we get the expected answer
```SPARQL
INSERT DATA {
                asset:Nozzle- imf:hasConnector asset:Nozzle-2_connector . 
                asset:PipingNode-7 imf:hasConnector asset:Nozzle-3_connector .
                asset:Flange-3 imf:hasTerminal asset:PipingNode-7 .
                asset:PipingNode-7 a imf:OutputTerminal .
            }
```
Hence, we need to create these triples in the RML mappings. 

### Connecting piping components from different piping network segments
