using Backend.Model;
using Boundaries;
using System;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

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


// Add node as boundary
app.MapPost("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    // The packageId and nodeId parameters are automatically URL-decoded by ASP.NET Core routing.

    // Construct the RDF triple with the full IRIs
    var data = $@"
        <{packageId}> comp:hasBoundary <{nodeId}> .
    ";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple with subject {packageId} and object {nodeId} inserted successfully.");
});

//Add node as internal
app.MapPost("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    var data = $@"
        <{packageId}> comp:isInPackage <{nodeId}> .
    ";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} inserted successfully.");
});

// Remove node as boundary
app.MapDelete("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    var data = $@"
        <{packageId}> comp:isBoundaryOf <{nodeId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

// Remove node as internal
app.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    // Example triple in Turtle syntax to delete
    var data = $@"
        <{packageId}> comp:isInPackage <{nodeId}> .
    ";

    // Delete data from RDFox
    await RdfoxApi.DeleteData(conn, data);

    // Return success response
    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Add commissioning packageadd commision package endpoint?

app.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage) =>
{
    // Construct the RDF data for the new commissioning package
    var data = new StringBuilder();
    data.AppendLine($@"<{commissioningPackage.Id}> rdf:type comp:CommissioningPackage .");
    data.AppendLine($@"<{commissioningPackage.Id}> comp:hasName ""{commissioningPackage.Name}"" .");
    data.AppendLine($@"<{commissioningPackage.Id}> comp:hasColour ""{commissioningPackage.Colour}"" .");

    // Optionally add boundary and internal nodes to the data if they are provided
    commissioningPackage.Boundary?.ForEach(node =>
        data.AppendLine($@"<{commissioningPackage.Id}> comp:hasBoundary <{node.Id}> ."));

    commissioningPackage.CalculatedInternal?.ForEach(node =>
        data.AppendLine($@"<{commissioningPackage.Id}> comp:hasCalculatedInternal <{node.Id}> ."));

    commissioningPackage.SelectedInternal?.ForEach(node =>
        data.AppendLine($@"<{commissioningPackage.Id}> comp:hasSelectedInternal <{node.Id}> ."));

    // Save the commissioning package data to RDFox
    await RdfoxApi.LoadData(conn, data.ToString());

    // Return success response
    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
});

//Update commissioning package - updating information like name, color and id while persisting the calculated internal nodes, and boundaries. 
// Update commissioning package - updating information like name, color, and id while persisting the calculated internal nodes, and boundaries.
app.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage) =>
{
    // Retrieve existing package data from RDFox (pseudo-code)
    var existingPackage = await RdfoxApi.GetPackageById(conn, updatedPackage.Id);

    // Check if the package exists
    if (existingPackage == null)
    {
        return Results.NotFound($"Commissioning package with ID {updatedPackage.Id} not found.");
    }

    // Delete the old triples for the mutable properties
    var deleteData = new StringBuilder();
    deleteData.AppendLine($@"<{existingPackage.Id}> comp:hasName ""{existingPackage.Name}"" .");
    deleteData.AppendLine($@"<{existingPackage.Id}> comp:hasColour ""{existingPackage.Colour}"" .");
    await RdfoxApi.DeleteData(conn, deleteData.ToString());

    // Construct the new triples with the updated properties
    var insertData = new StringBuilder();
    insertData.AppendLine($@"<{updatedPackage.Id}> comp:hasName ""{updatedPackage.Name}"" .");
    insertData.AppendLine($@"<{updatedPackage.Id}> comp:hasColour ""{updatedPackage.Colour}"" .");

    // Insert the new data for updated properties
    await RdfoxApi.LoadData(conn, insertData.ToString());

    // Return success response
    return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
});

//Delete commissioning package 
app.MapDelete("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
    var deleteBoundary = "DELETE WHERE { ?boundary comp:isBoundaryOf " + commissioningPackageId + " . }";
    var deleteInternal = "DELETE WHERE { ?internal comp:isInPackage " + commissioningPackageId + " . }";
    var deleteSelectedInternal = "DELETE WHERE { ?selectedInternal comp:isSelectedInternal " + commissioningPackageId +
      " . }";
    var deleteName = "DELETE WHERE { <${ commissioningPackageId}> comp:hasName? name . }";
    var deleteColor = "DELETE WHERE { <${ commissioningPackageId}> comp:hasColor? color . }";

    await RdfoxApi.DeleteData(conn, deleteBoundary);
    await RdfoxApi.DeleteData(conn, deleteInternal);
    await RdfoxApi.DeleteData(conn, deleteSelectedInternal);
    await RdfoxApi.DeleteData(conn, deleteName);
    await RdfoxApi.DeleteData(conn, deleteColor);

    // Return success response
    return Results.Ok($"Commissioning package {commissioningPackageId} deleted");
});

//Get commissioning package
app.MapGet("/commissioning-package/{commissioningPackageId}", (string commissioningPackageId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});


app.Run();
