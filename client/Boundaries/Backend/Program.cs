using Backend.Model;
using Boundaries;
using System.Text;


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

    var data = $@"
         <{nodeId}> comp:isBoundaryOf <{packageId}> .
    ";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple with subject {packageId} and object {nodeId} inserted successfully.");
});



//Add node as internal
app.MapPost("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    var data = $@"
         <{nodeId}> comp:isInPackage <{packageId}> .
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
             <{nodeId}> comp:isBoundaryOf <{packageId}> .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);
    // Check if the triple exists
    if (!existsResult)
    {
        return Results.NotFound($"Triple for package {packageId} and node {nodeId} not found.");
    }

    var data = $@"
         <{nodeId}> comp:isBoundaryOf <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);
    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

// Remove node as internal
app.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    var data = $@"
        <{nodeId}> comp:isInPackage <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", async (string nodeId) =>
{

    var quey = $@"SELECT ?neighb WHERE {{ <{nodeId}> imf:adjacentTo ?neighb }}";

    await RdfoxApi.QuerySparql(conn, quey);

    return Results.Ok($"Adjacent nodes for node {nodeId} retrieved successfully.");
});

//Add commissioning packageadd commision package endpoint?
app.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage) =>
{
    var data = new StringBuilder();
    data.AppendLine($@"<{commissioningPackage.Id}> rdf:type comp:CommissioningPackage .");
    data.AppendLine($@"<{commissioningPackage.Id}> comp:hasName ""{commissioningPackage.Name}"" .");
    data.AppendLine($@"<{commissioningPackage.Id}> comp:hasColour ""{commissioningPackage.Colour}"" .");

    await RdfoxApi.LoadData(conn, data.ToString());

    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
});

//Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries. 
app.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage) =>
{
    var queryColor = $@"
        DELETE {{<{updatedPackage.Id}> comp:hasColor ?color .}} 
        INSERT {{ <{updatedPackage.Id}> comp:hasColor <{updatedPackage.Colour}> }} 
        WHERE {{<{updatedPackage.Id}> comp:hasColor ?color .
        }}";

    var queryName = $@"
        DELETE {{<{updatedPackage.Id}> comp:hasName ?name.}} 
        INSERT {{ <{updatedPackage.Id}> comp:hasName <{updatedPackage.Name}> }} 
        WHERE {{<{updatedPackage.Id}> comp:hasName ?name .
        }}";


    await RdfoxApi.LoadData(conn, queryColor.ToString());
    await RdfoxApi.LoadData(conn, queryName.ToString());

    return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
});

//Delete commissioning package 
app.MapDelete("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
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

        switch (predicate)
        {
            case "comp:hasName":
                commissioningPackage.Name = obj.Trim('"');
                break;
            case "comp:hasColour":
                commissioningPackage.Colour = obj.Trim('"');
                break;
            case "comp:hasBoundary":
                commissioningPackage.Boundary.Add(new Node { Id = obj });
                break;
            case "comp:hasCalculatedInternal":
                commissioningPackage.CalculatedInternal.Add(new Node { Id = obj });
                break;
            case "comp:hasSelectedInternal":
                commissioningPackage.SelectedInternal.Add(new Node { Id = obj });
                break;
        }
    }

    return Results.Ok(commissioningPackage);
});

app.Run();
