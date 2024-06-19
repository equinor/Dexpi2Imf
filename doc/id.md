## Identifiy for integration

Assets are represented by IRIs in RDF. The IRIs representing assets/things/objects are called "individual IRIs" to separate them from the IRIs that are about the schema (classes, properties etc.). In a given interpretation an IRI must be a single object. So if any individual IRI can mean different objects, they are in different interpretations of the RDF dataset. There is no easy way to integrate or merge interpretations, so this makes data integration hard or impossible.

Tags are one of the few persistent, and globally understood names in Equinor. Unfortunately they are interpreted as different objects:
- The function in a design (Whatever pumps water through here). Called Activity in IMF
- A physical location (where the tag is placed). Called Space in IMF
- A type of equipment (water pump). Called implementation in IMF
- A physical piece of equipment. Usually not relevant, except for accounting

A solution is to use IRIs that consist of Facility + Tag + Activity/Space/Implementation. However, it is not clear that even this is granular enough. 

A different solution is to choose one perspective, probably activity, and define relations to that object.

ex:grundfosPumpx fulfillsActivity eqn:tagNumber .




