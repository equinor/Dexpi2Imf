using System.Net.Http.Json;
using Backend.Model;
using System.Text.Json;
using Xunit.Abstractions;

namespace TestBoundaries;

public class IntegrationTests : IClassFixture<TestFactory>
{
    private TestFactory _factory;
    private ITestOutputHelper _testOutputHelper;
    public IntegrationTests(TestFactory factory, ITestOutputHelper testOutputHelper)
    {
        _factory = factory;
        _testOutputHelper = testOutputHelper;
        var unused = _factory.CreateClient();
    }

    [Fact]
    public async Task TestCreatePackage()
    {
        // Arrange
        var client = _factory.CreateAuthenticatingClient();
        var commissioningPackage = new CommissioningPackage
        {
            Id = "package1",
            Name = "Test Package",
            Color = "Red"
        };

        // Act
        // Act
        var response = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);

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
    public async Task TestGetAllPackages()
    {
        // Arrange
        var client = _factory.CreateAuthenticatingClient();
        var commissioningPackage = new CommissioningPackage
        {
            Id = "package1",
            Name = "Test Package",
            Color = "Red"
        };

        var createresponse = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        createresponse.EnsureSuccessStatusCode();
        
        // Act
        var response = await client.GetAsync("/commissioning-package/all");
        // Assert
        if (!response.IsSuccessStatusCode)
        {
            var errorString = await response.Content.ReadAsStringAsync();
            _testOutputHelper.WriteLine($"Error: {response.StatusCode}");
            _testOutputHelper.WriteLine(errorString);
        }
        var package = await response.Content.ReadFromJsonAsync<CommissioningPackage[]>();
        response.EnsureSuccessStatusCode();
    }
    
        
    [Fact]
    public async Task TestGetAllPackageIds()
    {
        // Arrange
        var client = _factory.CreateAuthenticatingClient();
        var commissioningPackage = new CommissioningPackage
        {
            Id = "package1",
            Name = "Test Package",
            Color = "Red"
        };

        var createresponse = await client.PostAsJsonAsync("/commissioning-package", commissioningPackage);
        createresponse.EnsureSuccessStatusCode();
        
        // Act
        var response = await client.GetAsync("/commissioning-package/ids");
        // Assert
        if (!response.IsSuccessStatusCode)
        {
            var errorString = await response.Content.ReadAsStringAsync();
            _testOutputHelper.WriteLine($"Error: {response.StatusCode}");
            _testOutputHelper.WriteLine(errorString);
        }
        var stringResult = await response.Content.ReadAsStringAsync();
        var package = JsonSerializer.Deserialize<List<string>>(stringResult);
        response.EnsureSuccessStatusCode();
    }
}