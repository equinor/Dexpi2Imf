using IriTools;

namespace Boundaries;

public static class DatalogCreator
{
    public static string CreateCommissioningSparqlQuery()
    {
        return $"select * where {{?s a data:insideBoundaryX}}";
    }
    
    public static string CreateBoundaryDatalogRule(string internalComponentLabel, IriReference[] borderComponentIris)
    {
        var filters = borderComponentIris
            .Select(iri => $"NOT FILTER(?node1 = <{iri}>)")
            .Aggregate("", (acc, filter) => acc + ",\n    " + filter);
        return $"""
               prefix data: <https://assetid.equinor.com/plantx/document/12345#>

               data:insideBoundaryX [?node] :- 
                   rdfs:label [?internal, "{internalComponentLabel}"],
                   imf:connectedTo [?internal, ?node],
                   dexpi:PipingOrEquipment [?node].
                   
               data:insideBoundaryX [?node] :- 
                   data:insideBoundaryX [?node1],
                   imf:connectedTo [?node1, ?node]{filters},
                   dexpi:PipingOrEquipment [?node].
               """;
    }
}