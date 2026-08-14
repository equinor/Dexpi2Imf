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
    private readonly IContainer _dagalogContainer;
    private string _hostname;
    private int _port;

    private readonly string _outputFolderPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? throw new InvalidOperationException();

    // Path inside the container, from the read-only bind mount of the repo root below.
    private const string RepoMountPath = "/home/dagalog/data";

    public TestFactory()
    {
        _dagalogContainer = new ContainerBuilder()
            .WithImage("ghcr.io/daghovland/dagalog:0.5.3")
            .WithBindMount($"{_outputFolderPath}/../../../../../../", RepoMountPath, AccessMode.ReadOnly)
            .WithCommand(
                "--serve", "--port", "3030",
                "--data", $"{RepoMountPath}/rml_mappings/pandid.trig",
                "--ontology", $"{RepoMountPath}/owl/dexpi.ttl",
                "--ontology", $"{RepoMountPath}/owl/imf-ontology.owl.ttl",
                "--ontology", $"{RepoMountPath}/owl/boundary.ttl",
                "--rules", $"{RepoMountPath}/datalog/noaka_boundary.datalog")
            .WithPortBinding(3030, true)
            .WithCleanUp(true)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(3030))
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _dagalogContainer.StartAsync();
        _hostname = _dagalogContainer.Hostname;
        _port = _dagalogContainer.GetMappedPublicPort(3030);
    }

    public HttpClient CreateAuthenticatingClient(params string[] roles)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(scheme: "TestAuthenticationScheme", "******");
        return client;
    }
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove existing IDagalogApi registration
            services.Remove(ServiceDescriptor.Singleton(typeof(DagalogApi)));
            // Register a test-specific DagalogApi instance, pointing at the dagalog
            // testcontainer started above instead of the "dagalog" hostname used in
            // docker-compose.
            services.AddSingleton<IDagalogApi>(new DagalogApi(new ConnectionSettings
            {
                Host = _hostname,
                Port = _port,
                Dataset = "ds"
            }));
        });
    }

    public new async Task DisposeAsync()
    {
        await _dagalogContainer.DisposeAsync();
    }
}
