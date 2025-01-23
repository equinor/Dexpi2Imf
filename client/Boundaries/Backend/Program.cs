using Backend.Model;
using Boundaries;
using System.Text;
using Backend.Utils;
using System.Text.Json;


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
        ASK WHERE {{
             <{packageId}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .
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

    var result = await RdfoxApi.QuerySparql(conn, query);

    var adjacentNodes = new List<string>();

    try
    {
        using (JsonDocument doc = JsonDocument.Parse(result))
        {
            var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

            foreach (var binding in bindings.EnumerateArray())
            {
                var neighb = binding.GetProperty("neighb").GetProperty("value").GetString();
                adjacentNodes.Add(neighb);
            }
        }
    }
    catch (JsonException e)
    {
        return Results.Problem("An error occurred while parsing the SPARQL result.");
    }

    return Results.Ok(adjacentNodes);
});


//Add commissioning packageadd commision package endpoint?
app.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage) =>
{
    var data = new StringBuilder();
    data.AppendLine($@"<{commissioningPackage.Id}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .");
    data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasName} ""{commissioningPackage.Name}"" .");
    data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasColor} ""{commissioningPackage.Color}"" .");

    await RdfoxApi.LoadData(conn, data.ToString());

    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
});

// Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries.
app.MapPut("/put-commissioning-package", async (CommissioningPackage updatedPackage) =>
{

    var deleteColorData = $@"<{updatedPackage.Id}> {PropertiesProvider.hasColor} ?color . ";
    var deleteNameData = $@"<{updatedPackage.Id}> {PropertiesProvider.hasName} ?name . ";

    await RdfoxApi.DeleteData(conn, deleteColorData);
    await RdfoxApi.DeleteData(conn, deleteNameData);

    /*var data = new StringBuilder();
    data.AppendLine($@"<{updatedPackage.Id}> {PropertiesProvider.hasName} ""{updatedPackage.Name}"" .");
    data.AppendLine($@"<{updatedPackage.Id}> {PropertiesProvider.hasColor} ""{updatedPackage.Color}"" .");

    await RdfoxApi.LoadData(conn, data.ToString());*/

    return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
});

//Delete commissioning package 
app.MapDelete(" /commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
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

    // Check if the packageID exists
    var checkQuery = $@"
        ASK WHERE {{
             <{commissioningPackageId}> {TypesProvider.type} ?type .
        }}";

    var existsResult = await RdfoxApi.AskSparql(conn, checkQuery);

    if (!existsResult)
    {
        return Results.NotFound($"Commissioning package {commissioningPackageId} not found.");
    }

    var query = $@"
    SELECT ?x ?y WHERE {{
        {{ <{commissioningPackageId}> ?x ?y . }}
        UNION
        {{ ?y ?x <{commissioningPackageId}> . }}
    }}
";



    var result = await RdfoxApi.QuerySparql(conn, query);

    var commissioningPackage = new CommissioningPackage
    {
        Id = commissioningPackageId,
        Name = string.Empty,
        Color = string.Empty,
        BoundaryIds = [],
        InternalIds = [],
        SelectedInternalIds = []
    };

    try
    {
        using (JsonDocument doc = JsonDocument.Parse(result))
        {
            var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

            foreach (var binding in bindings.EnumerateArray())
            {
                var xValue = binding.GetProperty("x").GetProperty("value").GetString();
                var yValue = binding.GetProperty("y").GetProperty("value").GetString();

                // Handle the predicates and corresponding values
                if (xValue == "https://rdf.equinor.com/completion#hasName")
                {
                    commissioningPackage.Name = yValue;
                }
                else if (xValue == "https://rdf.equinor.com/completion#hasColour")
                {
                    commissioningPackage.Color = yValue;
                }
                else if (xValue == "https://rdf.equinor.com/completion#isBoundaryOf")
                {
                    commissioningPackage.BoundaryIds.Add(new Node { Id = yValue });
                }

                else if (xValue == "https://rdf.equinor.com/completion#isInPackage")
                {
                    commissioningPackage.InternalIds.Add(new Node { Id = yValue });
                }
                else if (xValue == "yourPredicateUriForSelectedInternal")
                {
                    commissioningPackage.SelectedInternalIds.Add(new Node { Id = yValue });
                }
            }
        }
    }
    catch (JsonException e)
    {
        return Results.Problem("An error occurred while parsing the SPARQL result.");
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

    var jsonResponse = JsonDocument.Parse(result);
    var packageIds = jsonResponse.RootElement
        .GetProperty("results")
        .GetProperty("bindings")
        .EnumerateArray()
        .Select(binding => binding.GetProperty("packageId").GetProperty("value").GetString())
        .ToList();

    return Results.Ok(packageIds);
});

app.Run();
