using Backend.Model;
using Boundaries;
using System.Text;
using Backend.Utils;


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
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    //Check if the packageID exists
    var checkQuery = $@"
        ASK WHERE {{
             <{packageId}> {Types.type} {Types.CommissioningPackage} .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);
    // Check if the triple exists
    if (!existsResult)
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }


    var data = $@"
         <{nodeId}> {Types.isBoundaryOf} <{packageId}> .
    ";

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
             <{packageId}> {Types.type} {Types.CommissioningPackage} .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);
    // Check if the triple exists
    if (!existsResult)
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {Types.isInPackage} <{packageId}> .
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
             <{nodeId}> {Types.isBoundaryOf} <{packageId}> .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);
    // Check if the triple exists
    if (!existsResult)
    {
        return Results.NotFound($"Triple for package {packageId} and node {nodeId} not found.");
    }

    var data = $@"
         <{nodeId}> {Types.isBoundaryOf} <{packageId}> .
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
             <{nodeId}> {Types.isInPackage} <{packageId}> .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);
    // Check if the triple exists
    if (!existsResult)
    {
        return Results.NotFound($"Triple for package {packageId} and node {nodeId} not found.");
    }

    var data = $@"
         <{nodeId}> {Types.isInPackage} <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", async (string nodeId) =>
{
    nodeId = Uri.UnescapeDataString(nodeId);

    var query = $@"SELECT ?neighb WHERE {{ <{nodeId}> {Types.adjacentTo} ?neighb }}";

    await RdfoxApi.QuerySparql(conn, query);

    return Results.Ok($"Adjacent nodes for node {nodeId} retrieved successfully.");
});

//Add commissioning packageadd commision package endpoint?
app.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage) =>
{
    var data = new StringBuilder();
    data.AppendLine($@"<{commissioningPackage.Id}> {Types.type} {Types.CommissioningPackage} .");
    data.AppendLine($@"<{commissioningPackage.Id}> {Types.hasName} ""{commissioningPackage.Name}"" .");
    data.AppendLine($@"<{commissioningPackage.Id}> {Types.hasColour} ""{commissioningPackage.Colour}"" .");

    await RdfoxApi.LoadData(conn, data.ToString());

    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
});

//Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries. 
app.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage) =>
{
    var queryColour = $@"
        DELETE {{<{updatedPackage.Id}> {Types.hasColour} ?colour .}} 
        INSERT {{ <{updatedPackage.Id}> {Types.hasColour} <{updatedPackage.Colour}> }} 
        WHERE {{<{updatedPackage.Id}> {Types.hasColour} ?colour .
        }}";

    var queryName = $@"
        DELETE {{<{updatedPackage.Id}> {Types.hasName} ?name.}} 
        INSERT {{ <{updatedPackage.Id}> {Types.hasName} <{updatedPackage.Name}> }} 
        WHERE {{<{updatedPackage.Id}> {Types.hasName} ?name .
        }}";


    await RdfoxApi.LoadData(conn, queryColour.ToString());
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
        Colour = string.Empty,
        Boundary = [],
        CalculatedInternal = [],
        SelectedInternal = []
    };

    // Parse the SPARQL result line by line)
    var lines = result.Split('\n');
    foreach (var line in lines)
    {
        var parts = line.Split(' ');
        if (parts.Length < 3) continue;

        var predicate = parts[1];
        var obj = parts[2].Trim('<', '>');

        if (predicate == Types.hasName)
        {
            commissioningPackage.Name = obj;
        }
        else if (predicate == Types.hasColour)
        {
            commissioningPackage.Colour = obj;
        }
        else if (predicate == Types.isBoundaryOf)
        {
            commissioningPackage.Boundary.Add(new Node { Id = obj });
        }
        else if (predicate == "comp:hasCalculatedInternal")
        {
            commissioningPackage.CalculatedInternal.Add(new Node { Id = obj });
        }
        else if (predicate == "comp:hasSelectedInternal")
        {
            commissioningPackage.SelectedInternal.Add(new Node { Id = obj });
        }
    }

    return Results.Ok(commissioningPackage);
});

//Get the ID of all commissioning packages
app.MapGet("/commissioning-package/get-all-commisioning-packages-ids", async () =>
{
    var query = $@"
        SELECT ?packageId WHERE {{
            ?packageId rdf:type {Types.CommissioningPackage} .
        }}";

    var result = await RdfoxApi.QuerySparql(conn, query);

    return Results.Ok();
});

app.Run();
