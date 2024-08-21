using IriTools;

namespace Boundaries;

public class DatalogCreator
{
    public IriReference BoundaryGraph = new IriReference($"https://data.equinor.com/boundaries/{Guid.NewGuid()}");
    
    public string CreateCommissioningSparqlQuery()
    {
        return $"select ?s(GROUP_CONCAT(?label; SEPARATOR=',') AS ?labels) where {{?s a <{BoundaryGraph}>; rdfs:label ?label. OPTIONAL{{?s  <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tag.}} }} GROUP BY (?s)";
    }
    
    public string CreateBoundaryDatalogRule(string internalComponentLabel, IriReference[] borderComponentIris)
    {
        var filters = borderComponentIris
            .Select(iri => $"NOT FILTER(?node1 = <{iri}>)")
            .Aggregate("", (acc, filter) => acc + ",\n    " + filter);
        return $$"""

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