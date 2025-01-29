using Xunit;
using VDS.RDF;
using VDS.RDF.Query;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using Backend.Model;
using VDS.RDF.Parsing;

namespace IntegrationTests;
public class CommissioningPackageTests
{
    private readonly HttpClient _client;
    private readonly TripleStore _mockStore;

    public CommissioningPackageTests()
    {
        // Initialize HttpClient for making requests to the API
        _client = new HttpClient();

        // Set up the mock RDF triplestore
        _mockStore = new TripleStore();
    }

    [Fact]
    public async Task AddCommissioningPackage_ShouldAddDataToStore()
    {
        // Arrange: Prepare the data to send
        var commissioningPackage = new CommissioningPackage
        {
            Id = "http://example.org/package/1",
            Name = "Package 1",
            Color = "Blue"
        };

        // Convert the commissioning package data to JSON
        var jsonContent = JsonSerializer.Serialize(commissioningPackage);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Act: Send a POST request to the API endpoint
        var response = await _client.PostAsync("/commissioning-package", content);

        // Assert: Check that the response is successful
        Assert.True(response.IsSuccessStatusCode);

        // Use dotNetRDF to verify that the data has been added to the mock triplestore
        var sparqlQueryStr = "SELECT ?s WHERE { ?s a <http://rdf.equinor.com/completion#CommissioningPackage> . }";
        SparqlQueryParser sparqlParser = new SparqlQueryParser();
        SparqlQuery sparqlQuery = sparqlParser.ParseFromString(sparqlQueryStr);
        LeviathanQueryProcessor processor = new LeviathanQueryProcessor(_mockStore);

        // Execute the query against the TripleStore
        SparqlResultSet results = processor.ProcessQuery(sparqlQuery) as SparqlResultSet;

        // Check that the triplestore contains the expected data
        Assert.NotNull(results);
        Assert.Single(results);
        Assert.Contains(results, result => result["s"].ToString().Equals(commissioningPackage.Id));
    }
}