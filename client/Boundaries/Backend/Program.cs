using Backend.Model;
using Boundaries;
using System;
using System.Text;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Establish connection to Rdfox
var conn = RdfoxApi.GetDefaultConnectionSettings();


app.MapGet("/", () => "Hello World!");

// Add node as boundary
app.MapPost("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    // Example triple in Turtle syntax
    var data = $@"
        @prefix ex: <http://example.com/> .
        ex:Package-{packageId} ex:hasBoundary ex:Node-{nodeId} .
    ";

    // Load data into RDFox
    await RdfoxApi.LoadData(conn, data);

    // Return success response
    return Results.Ok($"Triple for package {packageId} and node {nodeId} inserted successfully.");
});

//Add node as internal
app.MapPost("/commissioning-package/{packageId}/internal/{nodeId}", (string packageId, string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Remove node as boundary
app.MapDelete("/commissioning-package/{packageId}/boundary/{nodeId}", (string packageId, string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Remove node as internal 
app.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", (string packageId, string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Add commissioning package
app.MapPost("/commissioning-package", (CommissioningPackage commissioningPackage) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Update commissioning package - updating information like name, color and id while persisting the calculated internal nodes, and boundaries. 
app.MapPut("/commissioning-package", (CommissioningPackage commissioningPackage) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Delete commissioning package 
app.MapDelete("/commissioning-package/{commissioningPackageId}", (string commissioningPackageId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Get commissioning package
app.MapGet("/commissioning-package/{commissioningPackageId}", (string commissioningPackageId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});


app.Run();
