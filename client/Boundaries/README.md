# Boundaries to Commissioning app

## Usage

Start a rdfox server from the folder [../../rdfox/](../../rdfox) with the following command:

```
RDFox sandbox ../../rdfox boundaries
```

Then run `dotnet run` and follow instructions.

There are two "modes". In both modes you must give an rdf file and the tag of an equipment. If you only give this, it finds all directly connected Equipment. If you also give a list of boundary IRIs it will give all components inside those boundary. Inside is defined as the same side as the equipment with the tag.
