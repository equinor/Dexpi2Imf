# Boundaries to Commissioning app

## Usage

Start a dagalog server from the folder [../../dagalog/](../../dagalog) with the following command:

```
./boundaries.sh
```

Then run `dotnet run` and follow instructions.

There are two "modes". In both modes you must give an rdf file and the tag of an equipment. If you only give this, it finds all directly connected Equipment. If you also give a list of boundary IRIs it will give all components inside those boundary. Inside is defined as the same side as the equipment with the tag.
