using System.Net.Http.Json;
using Backend.Model;
using Xunit;
using Xunit.Abstractions;
using FluentAssertions;

namespace TestBoundaries;

public class BoundaryIntegrationTests : IClassFixture<TestFactory>
{
    private readonly TestFactory _factory;
    private readonly ITestOutputHelper _testOutputHelper;

    public BoundaryIntegrationTests(TestFactory factory, ITestOutputHelper testOutputHelper)
    {
        _factory = factory;
        _testOutputHelper = testOutputHelper;
        var unused = _factory.CreateClient();
    }
    

    [Fact]
    public async Task TestAddBoundary()
    {
        // Arrange
        var client = _factory.CreateAuthenticatingClient();
        var packageId = "packageX";
        var nodeId = "node1";

        var commissioningPackage = new CommissioningPackage
        {
            Id = packageId,
            Name = "Test Package",
            Color = "Red"
        };
        var responsePackage = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        responsePackage.EnsureSuccessStatusCode();
        
        // Act
        var response = await client.PostAsync($"/commissioning-package/{packageId}/update-boundary/{nodeId}", null);

        // Assert
        if (!response.IsSuccessStatusCode)
        {
            var errorString = await response.Content.ReadAsStringAsync();
            _testOutputHelper.WriteLine($"Error: {response.StatusCode}");
            _testOutputHelper.WriteLine(errorString);
        }
        response.EnsureSuccessStatusCode();
    }

    
    [Fact]
    public async Task TestAddBoundaryWithWrongPackage()
    {
        // Arrange
        var client = _factory.CreateAuthenticatingClient();
        var packageId = $"package{Guid.NewGuid()}";
        var nodeId = "node1";

        // Act
        var response = await client.PostAsync($"/commissioning-package/{packageId}/update-boundary/{nodeId}", null);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TestRemoveBoundary()
    {
        // Arrange
        var client = _factory.CreateAuthenticatingClient();
        var packageId = $"package{Guid.NewGuid()}";
        var nodeId = "node1";

        var commissioningPackage = new CommissioningPackage
        {
            Id = packageId,
            Name = "Test Package",
            Color = "Red"
        };
        var responsePackage = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        responsePackage.EnsureSuccessStatusCode();
        var addresponse = await client.PostAsync($"/commissioning-package/{packageId}/update-boundary/{nodeId}", null);
        addresponse.EnsureSuccessStatusCode();

        // Act
        string nodeUri = $"/commissioning-package/{packageId}/boundary/{nodeId}";
        var message = new HttpRequestMessage()
        {
            Method = HttpMethod.Delete,
            RequestUri = new Uri(client.BaseAddress ?? throw new Exception("Lacking client base adress"), nodeUri)
        };
        var deleteresponse = await client.SendAsync(message);
        deleteresponse.IsSuccessStatusCode.Should().BeTrue();
    }
}