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
    public void TestCreatePackage()
    {
        var client = _factory.CreateClient();
        
    }
}