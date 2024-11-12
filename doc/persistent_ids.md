# Persistent IDs

## Centralized DISC ID management for Dexpi Equipment IDs
We suggest a common, centralized ID management for DISC Dexpi Identifiers. 

The identifiers are globally unique and cannot be re-used for example if the same P&ID is re-used in different locations.
(An example of such re-use would be a P&ID of a component from a supplier.)

That we are looking at P&IDs means we are identifying 
"processing and instrumentations", so functions and activities 
that usually have the same 
lifespan as the facility, and not the actual physical equipment. 

### Requirements
The ID system must have these capabilities: 
1. Looking up an ID and getting basic information about it
2. Creating a new ID together with basic information especialy including all other relevant IDs, like tags.
3. There must be a possibility for several ID management systems that do not overlap

For example: 
Equinor operates AHA and is planning to have a tank with Tag 4712. Aibel is designing a P&ID for the tank and wants to create an PersistentID for the tank.
Aibel get this ID from Equinors id system, which generates a new PersistentId: "Context equinor, Identifier 123"
Two years later Aker BP takes over the operator role of AHA. Equinor sends over all IDs used on AHA and their metadata. 
This means that "Context equinor, Identifier 123" is sill available, but now only in Aker BPs ID system.
Aibel now is going to change the P&ID around the tank, and creates a new nozzle, which they asks Aker BP for: The
query includes the "Context equinor, Identifier 123" for the tank, which returns metadata, f.ex. one or more P&IDs for 
the area around the tank. The Aibel engineer sees there is no ID for the nozzle, 
and asks to get a new Id "Context aker, Identifier 12345" for the nozzle.

So the ID systems can contain and be used to lookup IRIs that are generated in other systems, but can only generate IDs
for their own dedicated context.

This means there is no centralized global lookup, so you need to know the operator to get info about the ID. 
This assumes that all users and systems are aware of what operator is currently operating each facility.
An alternative would be to route requests via the old operator the new one, using a lookup table on the old one, or
to encode facilities in the IDs such that a global router could be configured to route requests to the correct operator.


In addition, to make integration easier, it should support this capability:
3. Checking if there exists an ID for a given "descriptor". F.ex.: "Is there an ID for the valve before tank P4712 in the Aasta Hansteen facility?"

An important question is what data can be stored in the ID system, since it probably can be used to reverse engineer the design.
Can f.ex. all P&IDs be shared between all DISC partners? Or must this be operator specific and not DISC-global?

### Using the PersistentID element from Proteus XML
In Proteus XML we follow NOAKADEXPI and suggest using the PersistentID element with Identifier for the actual id,
and Context for the name of the central ID management. 
This name could be the URL of the web-accessible api of the system.

