## Identity for integration

Assets are represented by IRIs in RDF. An IRI representing an assets/thing/object is called an "Individual IRI". This is to separate it from the IRIs that are about the schema (classes, properties etc.). In a given interpretation an IRI must represent a single object. So if any individual IRI can mean different objects, they are in different interpretations of the RDF dataset. There is no easy way to integrate or merge interpretations, so this situation must be avoided, as it makes data integration hard or impossible.

That several IRIs represent the same object is, on the other hand, not a big problem, and RDF is quite good at handling that situation. 

The current situation is that objects are identified with good local identifiers in each system (some sort of primary key often?) and there is a loose integration using certain codes, specially facility, document and tag. 
Reusing the good local identifier, which already must exist, together with some identifier of the context, is perhaps noisy, but also sufficient and always not worse than the original system. 
For example, for DEXPI P&IDs, the IRIs of the elements can be made of facility + document-name + local dexpi ID.

Tags are one of the persistent, and globally understood names in Equinor. Unfortunately they are interpreted as different objects:
- The function in a design (Whatever pumps water through here). Called Activity in IMF
- A physical location (where the tag is placed). Called Space in IMF
- A type of equipment (water pump). Called implementation in IMF
- A physical piece of equipment. Usually not relevant(?), except for accounting

A solution is to use IRIs that also include the aspect, f.ex. adding Activity/Space/Implementation to the IRI. This solution is not acceptable, since many systems have objects that do not correspond to tags, or make objects before tags are decided. 

The chosen solution is to choose one perspective, probably activity, or some "tag"-perspecitve, and let the IRI made by facility + tag represent that object, and define relations between this and the other objects. This is an example of how that could look:

```turtle
@prefix : <https://rdf.equinor.com/dexpi#> .
@prefix asset: <https://assetid.equinor.com/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix imf: <https://ns.imfid.org/imf#> .

# This triple comes from the tag master
asset:AHA-Tag-20-ABC-01 rdf:type :Tag ;
                   rdfs:label "20-ABC-01" .

# This triple comes from the P&ID. It assumes the P&ID knows what tag is used.
asset:AHA-D065-AG-18-PE-0001-004--ReciprocatingPump-1 rdf:type <http://data.posccaesar.org/rdl/RDS416969> ;
                                                        rdfs:label "P4712";
                                                        imf:fulfills asset:AHA-Tag-20-ABC-01 .

# This triple comes from the datasheet.
asset:grundfos-PUMPA12342 rdf:type :Pump;
            imf:fulfills asset:AHA-Tag-20-ABC-01 ;
            :weightInKiloGrams 1234 .

                                                        
```
The first identifier `asset:AHA-Tag-20-ABC-01`is basically just a tag, so the "tag"-perspecitve mentioned above. 

The second identifier `asset:AHA-D065-AG-18-PE-0001-004--ReciprocatingPump-1` represents an object in a P&ID-drawing and is built up by document number of the P&ID plus the local ID on the P&ID. 

The third identifier `asset:grundfos-PUMPA12342` is a product catalog id, identifying a specific type of pump from a specific supplier. 



