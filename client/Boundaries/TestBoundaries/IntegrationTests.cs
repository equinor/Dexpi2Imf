using System.Net.Http.Json;
using Backend.Model;
using System.Text.Json;
using Xunit.Abstractions;

namespace TestBoundaries;

public class IntegrationTests(TestFactory factory, ITestOutputHelper testOutputHelper) : IClassFixture<TestFactory>
{
    [Fact]
    public async Task TestCreatePackage()
    {
        // Arrange
        var client = factory.CreateAuthenticatingClient();
        var commissioningPackage = new CommissioningPackage
        {
            Id = "package1",
            Name = "Test Package",
            Color = "Red"
        };

        // Act
        var response = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);

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
    public async Task TestGetAllPackages()
    {
        // Arrange
        var client = factory.CreateAuthenticatingClient();
        var commissioningPackage = new CommissioningPackage
        {
            Id = "package1",
            Name = "Test Package",
            Color = "Red"
        };

        var createResponse = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        createResponse.EnsureSuccessStatusCode();

        // Act
        var response = await client.GetAsync("/commissioning-package/all");

        // Assert
        if (!response.IsSuccessStatusCode)
        {
            var errorString = await response.Content.ReadAsStringAsync();
            testOutputHelper.WriteLine($"Error: {response.StatusCode}");
            testOutputHelper.WriteLine(errorString);
        }
        await response.Content.ReadFromJsonAsync<CommissioningPackage[]>();
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task TestGetAllPackageIds()
    {
        // Arrange
        var client = factory.CreateAuthenticatingClient();
        var commissioningPackage = new CommissioningPackage
        {
            Id = "package1",
            Name = "Test Package",
            Color = "Red"
        };

        var createResponse = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        createResponse.EnsureSuccessStatusCode();

        // Act
        var response = await client.GetAsync("/commissioning-package/ids");

        // Assert
        if (!response.IsSuccessStatusCode)
        {
            var errorString = await response.Content.ReadAsStringAsync();
            testOutputHelper.WriteLine($"Error: {response.StatusCode}");
            testOutputHelper.WriteLine(errorString);
        }
        var stringResult = await response.Content.ReadAsStringAsync();
        JsonSerializer.Deserialize<List<string>>(stringResult);
        response.EnsureSuccessStatusCode();
    }
}