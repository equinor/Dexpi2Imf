# Boundary / commissioning package example

In this example we will investigate how to find all items along the yellow line. This yellow line represents a comission package given the boundaries highlighted in red. 

![image](images/example_boundary.png)

### Required input
In order to locate the items inside a boundary the following prerequisites
must be met:
1) At which items the boundary is set
2) We need to know at least one item that exist within the boundary
 
For this example, the boundary is set at the following points:
* Equipment H1007
* Nozzle N6 50 
* Nozzle N5 50 
* Equipment P4712

Equipment T4750 is used as the internal item. The need to know at least one internal item is to differentiate between the outside, and the inside of the boundary. 


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