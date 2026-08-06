namespace Boundaries;

/// <summary>
/// HTTP client interface for a dagalog (https://github.com/daghovland/rdf-datalog) server,
/// used as the RDF/SPARQL backend for this application (replacing RDFox).
///
/// Note: unlike RDFox, dagalog has no endpoint for dynamically loading/unloading a named
/// Datalog ruleset at runtime - custom Datalog rules are only loaded once, at server startup.
/// See https://github.com/daghovland/rdf-datalog/issues/390 for a feature request tracking this.
/// </summary>
public interface IDagalogApi
{
    /// <summary>
    /// Insert one or more RDF triples (Turtle syntax, no PREFIX declarations needed -
    /// the well-known prefixes used by this project are declared automatically) into the
    /// default graph, via a SPARQL Update INSERT DATA statement.
    /// </summary>
    public Task InsertData(string turtleTriples);

    /// <summary>
    /// Delete one or more RDF triples (Turtle syntax, no PREFIX declarations needed) from
    /// the default graph, via a SPARQL Update DELETE DATA statement.
    /// </summary>
    public Task DeleteData(string turtleTriples);

    public Task<string> QuerySparql(string query, string acceptHeader = "application/sparql-results+json");

    public Task<bool> AskSparql(string query);
}
