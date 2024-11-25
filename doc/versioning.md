# Plan for versioning support

### Record-based
The plan is to re-use the document + revision setup from https://github.com/equinor/records and https://github.com/equinor/revisions for the P&IDs
For the first demo, I suggest just using plain records with no replaces and no describes, with the translation of each
dexpi file in a separate record.

### Single-command startup
The demo should be possible to start with a single command-line. The best option is probably to keep a local directory with all versions of a P&ID and then use docker's volume mapping to give the docker containers access to it
Each file will be translated with RML-mapper and then put into its own record. The record will have an IRI (or some property ex:fileName) based on the filename so the frontend can communicate with the backend about each file.


### Graphical info in RDF
The setup will be a bit different with graphical info in RDF, mainly the actions in the front-end when selecting a new version
In the current setup, this will be based on file-loading, while later only interaction with the triplestore is needed.

### Separate storage of completion packages
The completion packages (including color and boundary, but not including the scoping) must be stored separately from the P&IDs
For this first demo, storage in head should be sufficient.

### Switching versions 
The list of files/records/P&IDs can be fetched (from the frontend) by this query
```sparql
SELECT ?rec WHERE { GRAPH ?g {?rec a rec:Record}}
```
It can also be fetched by listing the files in the folder mapped by the volume mapping. 
In the first iteration, without rdf representation of graphical data, the file-based listing is
probably easiest. 

The switch between versions is done using a marker, "ex:CurrentRevision". 
The frontend will send a sparql insert like this
```sparql
DELETE { ?rec a ex:CurrentVersion } WHERE { ?rec a ex:CurrentVersion }"

INSERT { <record-iri-from-filename> a ex:CurrentVersion } WHERE {  }"
```
There is a datalog rule in the triplestore that puts the ex:CurrentVersion in head, like this
```datalog
[?s, ?p, ?o] :-
    ex:CurrentVersion[?rec],
    [?s, ?p, ?o] ?rec .
```
This means the data is automatically updated, so the queries from the front-end about completion should not need to change. 
However, the front-end needs to get the new graphical data after switching versions. 
Today, this could just be fetched from the volume-mapping directly without any changes other than what filename is 
used to render the Dexpi. The highlighting could either happen automatically, or the completion package would have to be selected again (Depending on how the multiple commissioning packages setup is made)

### Demo "script"
Demo'er copies all relevant versions into a local folder "demo"
Demo'er starts script, the commandline includes an argument something like -v demo:versions
The page now only shows a list of file-names (or other metadata we are able to extract?). The demo'er selects one of them
The demo'er creates a boundary and checks that the completion works out. 
The demo'er in some way (a menu or a list) selects another file
The other file comes up, with boundary selection mechanism from multiple-boundary package user story