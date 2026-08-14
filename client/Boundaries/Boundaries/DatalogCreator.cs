using IriTools;

namespace Boundaries;

/// <summary>
/// Builds per-request Datalog rule text for RDFox's dynamic content-load endpoint
/// (see the old IRdfoxApi.LoadDatalog/DeleteDatalog). Not currently wired to any live
/// Backend endpoint - it's exercised only by DatalogCreatorTests.
///
/// dagalog (the current RDF backend, replacing RDFox) has no equivalent runtime
/// endpoint for loading/unloading a named ruleset - see
/// https://github.com/daghovland/rdf-datalog/issues/390. The generated rule text also
/// uses RDFox-only syntax not supported by dagalog's Datalog parser: literal constants in
/// atom position ("T4750") and the combined "NOT FILTER(...)" form - see
/// https://github.com/daghovland/rdf-datalog/issues/388. If this class is revived for use
/// against dagalog, both would need addressing (e.g. bind literals to a variable plus a
/// separate FILTER, and split "NOT FILTER(...)" into plain FILTER(?x != ...) conjuncts).
/// </summary>
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


    public string CreateConnectedSparqlQuery()
    {
        return $"select * where {{?s a <{BoundaryGraph}>; rdfs:label ?tag.}}";
        //return $"select * where {{?s a <{BoundaryGraph}>; <http://sandbox.dexpi.org/rdl/TagNameAssignmentClass> ?tag.}}";
    }
    public string CreateConnectedDatalogRule(string internalComponentLabel)
    {
        return $$$"""
                  <{{{BoundaryGraph}}}> [?node] :- 
                    rdfs:label [?node, "{{{internalComponentLabel}}}"].
                  
                  <{{{BoundaryGraph}}}> [?node] :- 
                      rdfs:label [?internal, "{{{internalComponentLabel}}}"],
                      imf:connectedTo [?internal, ?node],
                      dexpi:PipingOrEquipment [?node].
                      
                  <{{{BoundaryGraph}}}> [?new_node] :- 
                      <{{{BoundaryGraph}}}> [?existing_node],
                      imf:connectedTo [?existing_node, ?new_node],
                      dexpi:PipingOrEquipment [?new_node],
                      NOT dexpi:Nozzle [?existing_node].
                  """;
    }
}