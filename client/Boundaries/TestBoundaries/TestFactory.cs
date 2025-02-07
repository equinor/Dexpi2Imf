using System.Reflection;
using Boundaries;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Configurations;
using Xunit.Abstractions;


public class TestFactory : WebApplicationFactory<Backend.Program>, IAsyncLifetime
{
    private ContainerBuilder _rdfoxBuilder;

    private IContainer _rdfoxContainer;

    private string hostname;
    private int port;
    // private readonly IContainer _initRdfoxDockerClient;
    ITestOutputHelper _testOutputHelper;
    private readonly string _outputFolderPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? throw new InvalidOperationException();
    private string _tempRdfoxDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
    private const string RdfoxUsername = "dexpi";
    private readonly string _rdfoxPassword = Guid.NewGuid().ToString("D");

    public TestFactory()
    {
        Directory.CreateDirectory(_tempRdfoxDirectory);
        string filePath = Path.Combine(_tempRdfoxDirectory, "RDFox.versions");
        string content = "data-store-catalog 1\ndata-store-change-log 1\nendpoint.params 1\nrole-database 1\nserver.params 1";

        File.WriteAllText(filePath, content);

        // This tries to be as close as possible to the actual RDFox docker setup in terraform/bravo-webapi/packer/rdfox_initdb.sh
        // _initRdfoxDockerClient = new ContainerBuilder()
        //     .WithImage("oxfordsemantic/rdfox-init:7.3")
        //     .WithBindMount($"{_outputFolderPath}/../../../../../../", "/home/rdfox/data/", AccessMode.ReadOnly)
        //     .WithBindMount(_tempRdfoxDirectory, "/home/rdfox/.RDFox", AccessMode.ReadWrite)
        //     .WithCommand("-license.file", "/home/rdfox/data/RDFox.lic", "-persistence", "file-sequence", "-request-logger", "elf", "init")
        //     .WithEnvironment("RDFOX_ROLE", RdfoxUsername)
        //     .WithEnvironment("RDFOX_PASSWORD", _rdfoxPassword)
        //     .WithWaitStrategy(Wait.ForUnixContainer())
        //     .WithCleanUp(false)
        //     .Build();
        
        // Set up an RDFox Testcontainer
        _rdfoxBuilder = new ContainerBuilder()
            .WithImage("oxfordsemantic/rdfox:7.3")
            .WithBindMount($"{_outputFolderPath}/../../../../../../", "/home/rdfox/data/", AccessMode.ReadOnly)
            .WithBindMount(_tempRdfoxDirectory, "/home/rdfox/.RDFox", AccessMode.ReadWrite)
            .WithCommand("-license.file", "/home/rdfox/data/RDFox.lic", "-persistence", "off", "-request-logger", "elf",
                "-sandbox-directory", "/home/rdfox/data", "daemon", "/home/rdfox/data/rdfox", "dexpi")
            .WithPortBinding(12110, true)
            .WithEnvironment("RDFOX_ROLE", RdfoxUsername)
            .WithEnvironment("RDFOX_PASSWORD", _rdfoxPassword)
            .WithCleanUp(false)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(12110));
    }

    public void WithLogger(ITestOutputHelper testOutputHelper)
    {
        _testOutputHelper = testOutputHelper;
        var logger = new TestOutputLoggerProvider(testOutputHelper);
        _rdfoxBuilder = _rdfoxBuilder.WithLogger(logger.CreateLogger("dexpi"));
    }
    
    public async Task InitializeAsync()
    {
        //await _initRdfoxDockerClient.StartAsync();
        _rdfoxContainer = _rdfoxBuilder.Build();
        await _rdfoxContainer.StartAsync();
        hostname = _rdfoxContainer.Hostname;
        port = _rdfoxContainer.GetMappedPublicPort(12110);
        return;
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
                Host = hostname,
                Port = port,
                Username = RdfoxUsername,
                Password = _rdfoxPassword,
                Datastore = ""
            }));
        });
    }

    public new async Task DisposeAsync()
    {
        await _rdfoxContainer.DisposeAsync();
        //await _initRdfoxDockerClient.DisposeAsync();
    }
}
