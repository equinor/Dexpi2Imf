using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Boundaries;

/// <summary>
/// Client for a dagalog server's SPARQL 1.1 HTTP endpoint
/// (https://github.com/daghovland/rdf-datalog, docs/user/deployment.md#http-api-reference).
///
/// Data is always written/removed via SPARQL Update (INSERT DATA / DELETE DATA against
/// /{dataset}/update) rather than RDFox's raw content-load endpoint, and every request
/// carries an explicit PREFIX header: unlike RDFox, dagalog has no server-side global
/// prefix registry, so a bare `comp:isBoundaryOf` with no PREFIX declaration would silently
/// resolve to nothing (see https://github.com/daghovland/rdf-datalog/issues/389).
/// </summary>
public class DagalogApi(ConnectionSettings conn) : IDagalogApi
{
    /// <summary>
    /// The well-known prefixes used across this project's queries and data. Declared on
    /// every request so callers can keep writing e.g. "comp:isBoundaryOf" without repeating
    /// PREFIX declarations at every call site.
    /// </summary>
    private const string DefaultPrefixes = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX comp: <https://rdf.equinor.com/completion#>
        PREFIX imf: <http://ns.imfid.org/imf#>
        PREFIX dexpi: <https://rdf.equinor.com/dexpi#>

        """;

    /// <summary>
    /// The same namespaces as <see cref="DefaultPrefixes"/>, used to expand prefixed names
    /// to full IRIs before SPARQL Update requests. Working around
    /// https://github.com/daghovland/rdf-datalog/issues/392: dagalog's SPARQL Update parser
    /// currently rejects *any* prefixed name as "not declared", even one declared via PREFIX
    /// in the very same request, so INSERT DATA/DELETE DATA bodies must use full IRIs only.
    /// </summary>
    private static readonly Dictionary<string, string> Namespaces = new()
    {
        ["rdf"] = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        ["rdfs"] = "http://www.w3.org/2000/01/rdf-schema#",
        ["comp"] = "https://rdf.equinor.com/completion#",
        ["imf"] = "http://ns.imfid.org/imf#",
        ["dexpi"] = "https://rdf.equinor.com/dexpi#",
    };

    // Matches "prefix:localName", but not when preceded by a word character, '/', '<', or
    // '"' (so it skips full IRIs and string literal contents).
    private static readonly Regex PrefixedNamePattern = new(
        @"(?<![\w/<""])(rdf|rdfs|comp|imf|dexpi):([A-Za-z_][A-Za-z0-9_-]*)",
        RegexOptions.Compiled);

    /// <summary>
    /// Expands every recognised "prefix:localName" token to a full "&lt;IRI&gt;" — see
    /// <see cref="Namespaces"/> for why this is needed for SPARQL Update requests.
    /// </summary>
    private static string ExpandPrefixedNames(string turtleTriples) =>
        PrefixedNamePattern.Replace(turtleTriples, m => $"<{Namespaces[m.Groups[1].Value]}{m.Groups[2].Value}>");

    // Matches a full "<...>" IRI reference (no whitespace/angle-brackets/quotes inside).
    private static readonly Regex IriRefPattern = new(@"<([^<>\s""]+)>", RegexOptions.Compiled);

    // A valid absolute-IRI scheme prefix, e.g. "http:", "urn:", per RFC 3987.
    private static readonly Regex AbsoluteSchemePattern = new(@"^[A-Za-z][A-Za-z0-9+.\-]*:", RegexOptions.Compiled);

    /// <summary>
    /// Resolves every "&lt;...&gt;" IRI reference that isn't already absolute (i.e. has no
    /// scheme, such as production node/package ids always do) against a fixed synthetic base,
    /// so that relative-looking ids (mostly test fixtures, e.g. "&lt;package1&gt;") map to a
    /// stable absolute IRI. This is applied identically on write (Insert/Delete) and read
    /// (Query/Ask) paths so the same relative id always resolves to the same resource.
    ///
    /// This works around dagalog's SPARQL Update parser not resolving relative IRIs against
    /// any BASE declared in the same request (unlike its Query parser, which is lenient) -
    /// see the addendum on https://github.com/daghovland/rdf-datalog/issues/392.
    /// </summary>
    private static string ExpandRelativeIris(string sparqlOrTurtle) =>
        IriRefPattern.Replace(sparqlOrTurtle, m =>
        {
            var iri = m.Groups[1].Value;
            return AbsoluteSchemePattern.IsMatch(iri)
                ? m.Value
                : $"<urn:dagalog-relative:{Uri.EscapeDataString(iri)}>";
        });

    public ConnectionSettings GetDefaultConnectionSettings()
    {
        return conn;
    }

    private Uri SparqlUri => new($"http://{conn.Host}:{conn.Port}/{conn.Dataset}/sparql");
    private Uri UpdateUri => new($"http://{conn.Host}:{conn.Port}/{conn.Dataset}/update");

    /// <summary>
    /// SPARQL Update DELETE DATA - the dagalog equivalent of RDFox's
    /// "PATCH .../content?operation=delete-content".
    /// </summary>
    public async Task DeleteData(string turtleTriples)
    {
        var update = $"DELETE DATA {{ {ExpandRelativeIris(ExpandPrefixedNames(turtleTriples))} }}";
        await RunUpdate(update);
    }

    /// <summary>
    /// SPARQL Update INSERT DATA - the dagalog equivalent of RDFox's "POST .../content".
    /// </summary>
    public async Task InsertData(string turtleTriples)
    {
        var update = $"INSERT DATA {{ {ExpandRelativeIris(ExpandPrefixedNames(turtleTriples))} }}";
        await RunUpdate(update);
    }

    private async Task RunUpdate(string update)
    {
        using var client = conn.GetAuthenticatedClient();
        var content = new StringContent(update, Encoding.UTF8, "application/sparql-update");

        var request = new HttpRequestMessage(HttpMethod.Post, UpdateUri)
        {
            Content = content
        };

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            throw new Exception(await response.Content.ReadAsStringAsync());
    }

    /// <summary>
    /// curl -i -X POST localhost:3030/ds/sparql -H "Content-Type: application/sparql-query" -H "Accept: application/sparql-results+json" -d "SELECT ?S ?P ?O WHERE { ?S ?P ?O }"
    /// </summary>
    public async Task<string> QuerySparql(string query, string acceptHeader = "application/sparql-results+json")
    {
        using var client = conn.GetAuthenticatedClient();
        var content = new StringContent(DefaultPrefixes + ExpandRelativeIris(query), Encoding.UTF8, "application/sparql-query");

        var request = new HttpRequestMessage(HttpMethod.Post, SparqlUri)
        {
            Content = content
        };
        request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue(acceptHeader));

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            throw new Exception(await response.Content.ReadAsStringAsync());
        return await response.Content.ReadAsStringAsync();
    }

    public async Task<bool> AskSparql(string query)
    {
        using var client = conn.GetAuthenticatedClient();
        var content = new StringContent(DefaultPrefixes + ExpandRelativeIris(query), Encoding.UTF8, "application/sparql-query");

        var request = new HttpRequestMessage(HttpMethod.Post, SparqlUri)
        {
            Content = content
        };
        request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/sparql-results+json"));

        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            throw new Exception(await response.Content.ReadAsStringAsync());

        var responseContent = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonDocument.Parse(responseContent);
        return jsonResponse.RootElement.GetProperty("boolean").GetBoolean();
    }
}
