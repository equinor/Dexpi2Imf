using Boundaries;
using Backend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.AddSingleton<IRdfoxApi>(sp =>
{
    var connectionSettings = new ConnectionSettings
    {
        Host = "rdfox",
        Port = 12110,
        Username = "guest",
        Password = "guest",
        Datastore = "boundaries"
    };

    return new RdfoxApi(connectionSettings);
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(policyBuilder => policyBuilder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);
app.UseHttpsRedirection();

app.MapBoundaryEndpoints();
app.MapCommissioningPackageEndpoints();
app.MapGraphicalDataFormatEndpoints();

app.Run();


// Necessary for integration testing
namespace Backend{
    public partial class Program { }
}