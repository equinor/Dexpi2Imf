# Overview of mappings
This document describes the mappings from proteus XML to IMF RDF contained in this folder.

## Equipment

## PipingComponents
Three mapping files have been created for //PipingComponent. 

### PipingComponentBlock.map.ttl
This map in this file is responsible for selecting every ID of a PipingComponent and creates the following triple asset:PipingComponent-ID a imf:Block . 

### PipingComponentTerminal.map.ttl

#### :PipingComponentFlowInTerminal
The iterator of this map `//PipingComponent/ConnectionPoints/Node[position()=number(../@FlowIn)+1]` selects a single tag. 
If the FlowIn attribute is present then it selects the Node at the index stated by the FlowIn attribute value. If it is not 
present then it selects the node for FlowIn at index 1. This is in accordance to the proteus xml documentation. 

Responsible for creating the following triples:
:nodeId a imf:inputTerminal ;
        imf:hasConnector :connector

The connector is found by looking at the predecing piping-component. 
Input terminals are connected to output terminals with the help of a connector. Between every PipingComponent
a imf:Connector is created. The iri is constructed like this PipingComponent-ID_PipingNetworkSegment-ID. If it is the
first element in the PipingComponents contained within a PipingNetworkSegment, then the PipingNetworkSegment ID is chosen instead. For the last element of the list, the next PipingNetworkSegment-ID is chosen as the connector for its output terminal. **We always look at the preceding element to figure out what is connected.** 

