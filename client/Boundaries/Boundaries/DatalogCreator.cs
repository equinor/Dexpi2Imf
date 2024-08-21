using IriTools;

namespace Boundaries;

public class DatalogCreator
{
    public IriReference BoundaryGraph = new IriReference($"https://data.equinor.com/boundaries/{Guid.NewGuid()}");
    
    public string CreateCommissioningSparqlQuery()
    {
        return $"select * where {{?s a <{BoundaryGraph}>}}";
    }
    
    public string CreateBoundaryDatalogRule(string internalComponentLabel, IriReference[] borderComponentIris)
    {
        var filters = borderComponentIris
            .Select(iri => $"NOT FILTER(?node1 = <{iri}>)")
            .Aggregate("", (acc, filter) => acc + ",\n    " + filter);
        return $$"""
               prefix data: <https://assetid.equinor.com/plantx/document/12345#>

               <{{BoundaryGraph}}> [?node] :- 
                   rdfs:label [?internal, "{{internalComponentLabel}}"],
                   imf:connectedTo [?internal, ?node],
                   dexpi:PipingOrEquipment [?node].
                   
               <{{BoundaryGraph}}> [?node] :- 
                   <{{BoundaryGraph}}> [?node1],
                   imf:connectedTo [?node1, ?node]{{filters}},
                   dexpi:PipingOrEquipment [?node].
               """;
    }
}