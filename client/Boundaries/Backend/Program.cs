using Backend.Model;
using Boundaries;
using System.Text;
using Backend.Utils;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);
app.UseHttpsRedirection();

// Establish connection to Rdfox
var conn = RdfoxApi.GetDefaultConnectionSettings();


// Add node as boundary
app.MapPost("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    // Check if the packageID exists
    var checkQuery = $@"
        ASK ?type WHERE {{
             <{packageId}> {TypesProvider.type} ?type .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);

    if (!existsResult)
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple with subject {packageId} and object {nodeId} inserted successfully.");
});




//Add node as internal
app.MapPost("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    //Check if the packageID exists
    var checkQuery = $@"
        ASK WHERE {{
             <{packageId}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);

    if (!existsResult)
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
    ";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} inserted successfully.");
});

// Remove node as boundary
app.MapDelete("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    var checkQuery = $@"
        ASK WHERE {{
             <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);

    if (!existsResult)
    {
        return Results.NotFound($"Triple for package {packageId} and node {nodeId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

// Remove node as internal
app.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    var checkQuery = $@"
        ASK WHERE {{
             <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);

    if (!existsResult)
    {
        return Results.NotFound($"Triple for package {packageId} and node {nodeId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", async (string nodeId) =>
{
    nodeId = Uri.UnescapeDataString(nodeId);

    var query = $@"SELECT ?neighb WHERE {{ <{nodeId}> {PropertiesProvider.adjacentTo} ?neighb }}";

    await RdfoxApi.QuerySparql(conn, query);

    return Results.Ok($"Adjacent nodes for node {nodeId} retrieved successfully.");
});

//Add commissioning packageadd commision package endpoint?
app.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage) =>
{
    var data = new StringBuilder();
    data.AppendLine($@"<{commissioningPackage.Id}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .");
    data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasName} ""{commissioningPackage.Name}"" .");
    data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hascolor} ""{commissioningPackage.color}"" .");

    await RdfoxApi.LoadData(conn, data.ToString());

    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
});

//Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries. 
app.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage) =>
{ 
    var querycolor = $@"
        DELETE {{<{updatedPackage.Id}> {PropertiesProvider.hascolor} ?color .}} 
        INSERT {{ <{updatedPackage.Id}> {PropertiesProvider.hascolor} <{updatedPackage.Color}> }} 
        WHERE {{<{updatedPackage.Id}> {PropertiesProvider.hascolor} ?color .
        }}";

    var queryName = $@"
        DELETE {{<{updatedPackage.Id}> {PropertiesProvider.hasName} ?name.}} 
        INSERT {{ <{updatedPackage.Id}> {PropertiesProvider.hasName} <{updatedPackage.Name}> }} 
        WHERE {{<{updatedPackage.Id}> {PropertiesProvider.hasName} ?name .
        }}";


    await RdfoxApi.LoadData(conn, querycolor.ToString());
    await RdfoxApi.LoadData(conn, queryName.ToString());

    return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
});

//Delete commissioning package 
app.MapDelete("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
    commissioningPackageId = Uri.UnescapeDataString(commissioningPackageId);

    var deleteQuery = $@"
        DELETE WHERE {{
            <{commissioningPackageId}> ?predicate ?object .
        }}";

    await RdfoxApi.DeleteData(conn, deleteQuery);

    return Results.Ok($"Commissioning package {commissioningPackageId} deleted");
});

//Get commissioning package
app.MapGet("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
    commissioningPackageId = Uri.UnescapeDataString(commissioningPackageId);

    var query = $@"
            SELECT ?predicate ?object WHERE {{
                <{commissioningPackageId}> ?predicate ?object .
            }}";

    var result = await RdfoxApi.QuerySparql(conn, query);

    var commissioningPackage = new CommissioningPackage
    {
        Id = commissioningPackageId,
        Name = string.Empty,
        color = string.Empty,
        BoundaryIds = [],
        InternalIds = [],
        SelectedInternalIds = []
    };

    // Parse the SPARQL result line by line)
    var lines = result.Split('\n');
    foreach (var line in lines)
    {
        var parts = line.Split(' ');
        if (parts.Length < 3) continue;

        var predicate = parts[1];
        var obj = parts[2].Trim('<', '>');

        if (predicate == PropertiesProvider.hasName)
        {
            commissioningPackage.Name = obj;
        }
        else if (predicate == PropertiesProvider.hascolor)
        {
            commissioningPackage.color = obj;
        }
        else if (predicate == PropertiesProvider.isBoundaryOf)
        {
            commissioningPackage.BoundaryIds.Add(new Node { Id = obj });
        }
        else if (predicate == "comp:hasCalculatedInternal")
        {
            commissioningPackage.InternalIds.Add(new Node { Id = obj });
        }
        else if (predicate == "comp:hasSelectedInternal")
        {
            commissioningPackage.SelectedInternalIds.Add(new Node { Id = obj });
        }
    }

    return Results.Ok(commissioningPackage);
});

//Get the ID of all commissioning packages
app.MapGet("/commissioning-package/get-all-commisioning-packages-ids", async () =>
{
    var query = $@"
        SELECT ?packageId WHERE {{
            ?packageId rdf:type {PropertiesProvider.CommissioningPackage} .
        }}";

    var result = await RdfoxApi.QuerySparql(conn, query);

    return Results.Ok();
});

app.Run();
