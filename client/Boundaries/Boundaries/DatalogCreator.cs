using IriTools;

namespace Boundaries;

public static class DatalogCreator
{
    public static string CreateBoundaryDatalogRule(string internalComponentLabel, IriReference[] borderComponentIris)
    {
        return """
               prefix dexpi: <https://rdf.equinor.com/dexpi#> 
               prefix imf: <http://ns.imfid.org/imf#> 
               prefix data: <https://assetid.equinor.com/plantx/document/12345#>


               data:insideBoundaryX [?node] :- 
                   rdfs:label [?internal, "T4750"],
                   imf:connectedTo [?internal, ?node],
                   dexpi:PipingOrEquipment [?node].

               data:insideBoundaryX [?node] :- 
                   data:insideBoundaryX [?node1],
                   imf:connectedTo [?node1, ?node],
                   dexpi:PipingOrEquipment [?node],
                   NOT rdfs:label [?node1, "H1007"],
                   NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#Nozzle-12>),
                   NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#Nozzle-8>),
                   NOT rdfs:label [?node1, "P4712"].
               );
               """;
    }
}