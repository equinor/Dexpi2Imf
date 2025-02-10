using System.Net.Http.Json;
using Backend.Model;
using Xunit.Abstractions;
using FluentAssertions;

namespace TestBoundaries;

public class BoundaryIntegrationTests(TestFactory factory, ITestOutputHelper testOutputHelper) : IClassFixture<TestFactory>
{
    [Fact]
    public async Task TestAddBoundary()
    {
        // Arrange
        var client = factory.CreateAuthenticatingClient();
        const string packageId = "packageX";
        const string nodeId = "node1";

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
            testOutputHelper.WriteLine($"Error: {response.StatusCode}");
            testOutputHelper.WriteLine(errorString);
        }
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task TestAddBoundaryWithWrongPackage()
    {
        // Arrange
        var client = factory.CreateAuthenticatingClient();
        var packageId = $"package{Guid.NewGuid()}";
        const string nodeId = "node1";

        // Act
        var response = await client.PostAsync($"/commissioning-package/{packageId}/update-boundary/{nodeId}", null);

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task TestRemoveBoundary()
    {
        // Arrange
        var client = factory.CreateAuthenticatingClient();
        var packageId = $"package{Guid.NewGuid()}";
        const string nodeId = "node1";

        var commissioningPackage = new CommissioningPackage
        {
            Id = packageId,
            Name = "Test Package",
            Color = "Red"
        };
        var responsePackage = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        responsePackage.EnsureSuccessStatusCode();
        var addResponse = await client.PostAsync($"/commissioning-package/{packageId}/update-boundary/{nodeId}", null);
        addResponse.EnsureSuccessStatusCode();

        // Act
        var nodeUri = $"/commissioning-package/{packageId}/boundary/{nodeId}";
        var message = new HttpRequestMessage()
        {
            Method = HttpMethod.Delete,
            RequestUri = new Uri(client.BaseAddress ?? throw new Exception("Lacking client base address"), nodeUri)
        };
        var deleteResponse = await client.SendAsync(message);
        deleteResponse.IsSuccessStatusCode.Should().BeTrue();
    }
}