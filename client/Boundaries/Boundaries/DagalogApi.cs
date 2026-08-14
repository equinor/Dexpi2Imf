using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Boundaries;

/// <summary>
/// Client for a dagalog server's SPARQL 1.1 HTTP endpoint
/// (https://github.com/daghovland/rdf-datalog, docs/user/deployment.md#http-api-reference).
///
/// Data is always written/removed via SPARQL Update (INSERT DATA / DELETE DATA against
/// /{dataset}/update). Every request carries an explicit PREFIX header so callers can
/// keep writing e.g. "comp:isBoundaryOf" without repeating PREFIX declarations.
/// </summary>
public class DagalogApi(ConnectionSettings conn) : IDagalogApi
{
    /// <summary>
    /// Well-known prefixes used across this project's queries and updates. Prepended to
    /// every SPARQL Query and Update request.
    /// </summary>
    private const string DefaultPrefixes = """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX comp: <https://rdf.equinor.com/completion#>
        PREFIX imf: <http://ns.imfid.org/imf#>
        PREFIX dexpi: <https://rdf.equinor.com/dexpi#>

        """;

    // Matches a full "<...>" IRI reference (no whitespace/angle-brackets/quotes inside).
    private static readonly Regex IriRefPattern = new(@"<([^<>\s""]+)>", RegexOptions.Compiled);

    // A valid absolute-IRI scheme prefix, e.g. "http:", "urn:", per RFC 3987.
    private static readonly Regex AbsoluteSchemePattern = new(@"^[A-Za-z][A-Za-z0-9+.\-]*:", RegexOptions.Compiled);

    /// <summary>
    /// Resolves every &lt;...&gt; IRI reference without a scheme to a stable synthetic
    /// absolute IRI. Needed because dagalog's Update parser does not resolve relative IRIs
    /// against a BASE declaration (unlike its Query parser). Applies consistently to both
    /// read and write paths so the same id always resolves to the same resource.
    /// See https://github.com/daghovland/rdf-datalog/issues/392 (addendum).
    /// </summary>
    private static string ExpandRelativeIris(string sparqlOrTurtle) =>
        IriRefPattern.Replace(sparqlOrTurtle, m =>
        {
            var iri = m.Groups[1].Value;
            return AbsoluteSchemePattern.IsMatch(iri)
                ? m.Value
                : $"<urn:dagalog-relative:{Uri.EscapeDataString(iri)}>";
        });

    public ConnectionSettings GetDefaultConnectionSettings() => conn;

    private Uri SparqlUri => new($"http://{conn.Host}:{conn.Port}/{conn.Dataset}/sparql");
    private Uri UpdateUri => new($"http://{conn.Host}:{conn.Port}/{conn.Dataset}/update");

    public async Task DeleteData(string turtleTriples)
    {
        var update = $"{DefaultPrefixes}DELETE DATA {{ {ExpandRelativeIris(turtleTriples)} }}";
        await RunUpdate(update);
    }

    public async Task InsertData(string turtleTriples)
    {
        var update = $"{DefaultPrefixes}INSERT DATA {{ {ExpandRelativeIris(turtleTriples)} }}";
        await RunUpdate(update);
    }

    private async Task RunUpdate(string update)
    {
        using var client = conn.GetAuthenticatedClient();
        var content = new StringContent(update, Encoding.UTF8, "application/sparql-update");
        var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Post, UpdateUri) { Content = content });
        if (!response.IsSuccessStatusCode)
            throw new Exception(await response.Content.ReadAsStringAsync());
    }

    public async Task<string> QuerySparql(string query, string acceptHeader = "application/sparql-results+json")
    {
        using var client = conn.GetAuthenticatedClient();
        var content = new StringContent(DefaultPrefixes + ExpandRelativeIris(query), Encoding.UTF8, "application/sparql-query");
        var request = new HttpRequestMessage(HttpMethod.Post, SparqlUri) { Content = content };
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
        var request = new HttpRequestMessage(HttpMethod.Post, SparqlUri) { Content = content };
        request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/sparql-results+json"));
        var response = await client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
            throw new Exception(await response.Content.ReadAsStringAsync());
        var responseContent = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(responseContent).RootElement.GetProperty("boolean").GetBoolean();
    }
}
