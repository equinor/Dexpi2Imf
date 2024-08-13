# Boundary / commissioning package example

DEXPI at [file:///home/daghovland/Nedlastinger/C01V04-VER.EX01.svg](file:///home/daghovland/Nedlastinger/C01V04-VER.EX01.svg)

Boundary: 

* H1007
* N6 on T4750
* N5 on T4750
* P4712

Also an internal object T4750 is chosen, and the paths are filtered

We are not sure what are the criteria for equipment inside a boundary. Just all IRIs?

Commissioning/inside should have at least
T4750
N8 800 (??)
66KL21-80
75SA21-80 
MNc 47124 75HB13 80

## Bugs
The generated labels for T4750 are too many, and a lot of them should not be labels on the equipment, but measurements or attributes, probably

## Connection notes

P4712 har en Nozzle-7 og en Nozzle-9 

Nozzle-7 har en Node av type Process


PipingNetworkSystem (f.eks. MNc 47124 75HB13 80)
har en eller flere PipingNetworkSegments
som har en eller flere PipingComponent og en Connection

 <Connection FromID="PipeReducer-1" FromNode="2" ToID="Nozzle-7" ToNode="1"/>

 ## Example
 By loading dexpi.rdfox into an RDFox installation and run the query "select * where {?s a data:insideBoundaryX, dexpi:Equipment; rdfs:label ?name.}" we get 
 PipingComponents, Nozzles and Equipment inside the boundary. 
 The datalog rule insideBoundaryX is case-specific and made from input from the user. 