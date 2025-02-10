using System.Net.Http.Headers;
using System.Reflection;
using Boundaries;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Configurations;
using DotNet.Testcontainers.Containers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace TestBoundaries;

public class TestFactory : WebApplicationFactory<Backend.Program>, IAsyncLifetime
{
    private readonly IContainer _rdfoxContainer;
    private string _hostname;
    private int _port;

    private readonly string _outputFolderPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? throw new InvalidOperationException();
    private readonly string _tempRdfoxDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
    private const string RdfoxUsername = "dexpi";
    private readonly string _rdfoxPassword = Guid.NewGuid().ToString("D");

    public TestFactory()
    {
        Directory.CreateDirectory(_tempRdfoxDirectory);
        var filePath = Path.Combine(_tempRdfoxDirectory, "RDFox.versions");
        const string content = "data-store-catalog 1\ndata-store-change-log 1\nendpoint.params 1\nrole-database 1\nserver.params 1";

        File.WriteAllText(filePath, content);

        _rdfoxContainer = new ContainerBuilder()
            .WithImage("oxfordsemantic/rdfox:7.3")
            .WithBindMount($"{_outputFolderPath}/../../../../../../", "/home/rdfox/data/", AccessMode.ReadOnly)
            .WithBindMount(_tempRdfoxDirectory, "/home/rdfox/.RDFox", AccessMode.ReadWrite)
            .WithCommand("-license.file", "/home/rdfox/data/RDFox.lic", "-persistence", "off", "-request-logger", "elf",
                "-sandbox-directory", "/home/rdfox/data", "daemon", "/home/rdfox/data/rdfox", "dexpi")
            .WithPortBinding(12110, true)
            .WithEnvironment("RDFOX_ROLE", RdfoxUsername)
            .WithEnvironment("RDFOX_PASSWORD", _rdfoxPassword)
            .WithCleanUp(true)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(12110))
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _rdfoxContainer.StartAsync();
        _hostname = _rdfoxContainer.Hostname;
        _port = _rdfoxContainer.GetMappedPublicPort(12110);
    }

    public HttpClient CreateAuthenticatingClient(params string[] roles)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(scheme: "TestAuthenticationScheme", "Bearer null");
        return client;
    }
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove existing IRdfoxApi registration
            services.Remove(ServiceDescriptor.Singleton(typeof(RdfoxApi)));
            // Register a test-specific RdfoxApi instance
            services.AddSingleton<IRdfoxApi>(new RdfoxApi(new ConnectionSettings
            {
                Host = _hostname,
                Port = _port,
                Username = RdfoxUsername,
                Password = _rdfoxPassword,
                Datastore = "boundaries"
            }));
        });
    }

    public new async Task DisposeAsync()
    {
        await _rdfoxContainer.DisposeAsync();
    }
}