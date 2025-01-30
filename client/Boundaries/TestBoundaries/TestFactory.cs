using Boundaries;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Configurations;


public class TestFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly IContainer _rdfox;
    public HttpClient? Client { get; private set; }

    public TestFactory()
    {
        // Set up an RDFox Testcontainer
        _rdfox = new ContainerBuilder()
            .WithImage("bravoacr.azurecr.io/oxfordsemantic/rdfox-init:7.2a")
            //TODO : copy the rdfox lic and mount properly - test it out to see how it goes :)) 
            // Not sure if password and username is needed? Silly values is used in the BravoTestFacory
            //.WithBindMount($"{_outputFolderPath}/TestData/RDFox.lic", "/opt/RDFox/RDFox.lic", AccessMode.ReadOnly)
            //.WithBindMount(_tempRdfoxDirectory, "/home/rdfox/.RDFox", AccessMode.ReadWrite)
            //.WithCommand("-persistence", "file-sequence", "-request-logger", "elf", "init")
            .WithPortBinding(12110, true)
            .WithCleanUp(true)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(12110))
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _rdfox.StartAsync();
        Client = CreateClient();
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
                Host = "",
                Port = 12210,
                Username = "",
                Password = "",
                Datastore = ""
            }));
        });
    }

    public new async Task DisposeAsync()
    {
        await _rdfox.DisposeAsync();
        Client?.Dispose();
    }
}
