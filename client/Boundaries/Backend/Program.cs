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


// ============ BOUNDARIES ============

//Update boundary 
app.MapPost("/commissioning-package/{packageId}/update-boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    if (!await QueryUtils.CommissioningPackageExists(packageId, conn))
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var isSelectedInternal = await QueryUtils.IsSelectedInternalOf(packageId, nodeId, conn);
    var isBoundary = await QueryUtils.IsBoundaryOf(packageId, nodeId, conn);

    if (isSelectedInternal)
        await QueryUtils.DeleteIsSelectedInternalOf(packageId, nodeId, conn);

    if (isBoundary)
    {
        await QueryUtils.DeleteIsBoundaryOf(packageId, nodeId, conn);
    }
    else
    {
        await QueryUtils.AddIsBoundaryOf(packageId, nodeId, conn);
    }

    return Results.Ok();
}).WithTags("Boundary");


// Add node as boundary
app.MapPost("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    if (!await QueryUtils.CommissioningPackageExists(packageId, conn))
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple with subject {packageId} and object {nodeId} inserted successfully.");
}).WithTags("Boundary");


// Remove node as boundary
app.MapDelete("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    if (!await QueryUtils.CommissioningPackageExists(packageId, conn))
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
}).WithTags("Boundary");


// ============ INTERNAL ============

//Update selected internal 
app.MapPost("/commissioning-package/{packageId}/update-internal/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    if (!await QueryUtils.CommissioningPackageExists(packageId, conn))
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var isSelectedInternal = await QueryUtils.IsSelectedInternalOf(packageId, nodeId, conn);
    var isBoundary = await QueryUtils.IsBoundaryOf(packageId, nodeId, conn);

    if (isBoundary)
        await QueryUtils.DeleteIsBoundaryOf(packageId, nodeId, conn);

    if (isSelectedInternal)
    {
        await QueryUtils.DeleteIsSelectedInternalOf(packageId, nodeId, conn);
    }
    else
    {
        await QueryUtils.AddIsSelectedInternalOf(packageId, nodeId, conn);
    }

    return Results.Ok();
}).WithTags("Internal");


//Add node as internal
app.MapPost("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    if (!await QueryUtils.CommissioningPackageExists(packageId, conn))
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
    ";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} inserted successfully.");
}).WithTags("Internal");


// Remove node as internal
app.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    packageId = Uri.UnescapeDataString(packageId);
    nodeId = Uri.UnescapeDataString(nodeId);

    if (!await QueryUtils.CommissioningPackageExists(packageId, conn))
    {
        return Results.NotFound($"Commissioning package {packageId} not found.");
    }

    var data = $@"
         <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);

    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
}).WithTags("Internal");


// ============ NODES ============

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
}).WithTags("Nodes");


// ============ COMMISSIONING PACKAGE ============

//Add commissioning package
app.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage) =>
{
    var data = new StringBuilder();
    data.AppendLine($@"<{commissioningPackage.Id}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .");
    data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasName} ""{commissioningPackage.Name}"" .");
    data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasColor} ""{commissioningPackage.Color}"" .");

    await RdfoxApi.LoadData(conn, data.ToString());

    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
}).WithTags("Commissioning Package");


// Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries.
app.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage) =>
{
    var getQuery = $@"
    SELECT ?object WHERE {{
        {{ <{updatedPackage.Id}> {PropertiesProvider.hasColor} ?object . }}
        UNION
        {{ <{updatedPackage.Id}> {PropertiesProvider.hasName} ?object .  }}
    }}
    ";

    var result = await RdfoxApi.QuerySparql(conn, getQuery);

    string oldPackageName = string.Empty;
    string oldPackageColor = string.Empty;

    using (JsonDocument doc = JsonDocument.Parse(result))
    {
        var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings").EnumerateArray().ToList();

        if (bindings.Count >= 2)
        {
            oldPackageName = bindings[0].GetProperty("object").GetProperty("value").GetString();
            oldPackageColor = bindings[1].GetProperty("object").GetProperty("value").GetString();
        }
    }

    // Log the existing color and name of the package
    var deleteData = $@"<{updatedPackage.Id}> {PropertiesProvider.hasColor} ""{oldPackageColor}"" .
                        <{updatedPackage.Id}> {PropertiesProvider.hasName} ""{oldPackageName}"" . ";


    await RdfoxApi.DeleteData(conn, deleteData);

    var data = $@"
        <{updatedPackage.Id}> {PropertiesProvider.hasName} ""{updatedPackage.Name}"" .
        <{updatedPackage.Id}> {PropertiesProvider.hasColor} ""{updatedPackage.Color}"" .
    ";

    await RdfoxApi.LoadData(conn, data);

    return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
}).WithTags("Commissioning Package");


//Get commissioning package
app.MapGet("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
    commissioningPackageId = Uri.UnescapeDataString(commissioningPackageId);

    if (!await QueryUtils.CommissioningPackageExists(commissioningPackageId, conn))
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

    CommissioningPackage commissioningPackage;

    try
    {
        commissioningPackage = QueryUtils.ParseCommissioningPackageQueryResult(commissioningPackageId, result);
    }
    catch (JsonException)
    {
        return Results.Problem("A json error occurred while parsing the SPARQL result.");
    }
    catch (Exception)
    {
        return Results.Problem("Null error occurred while parsing the SPARQL result.");
    }

    return Results.Ok(commissioningPackage);
}).WithTags("Commissioning Package");


//Delete commissioning package 
app.MapDelete("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
    commissioningPackageId = Uri.UnescapeDataString(commissioningPackageId);

    if (!await QueryUtils.CommissioningPackageExists(commissioningPackageId, conn))
    {
        return Results.NotFound($"Commissioning package {commissioningPackageId} not found.");
    }

    var query = $@"
    SELECT ?x ?y WHERE {{
        {{ <{commissioningPackageId}> ?x ?y . }}
    }}";

    var result = await RdfoxApi.QuerySparql(conn, query);
    var deleteQueryBuilder = new StringBuilder();

    
    using (JsonDocument doc = JsonDocument.Parse(result))
    {
        var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

        foreach (var binding in bindings.EnumerateArray())
        {
            var xValue = binding.GetProperty("x").GetProperty("value").GetString();
            var yValue = binding.GetProperty("y").GetProperty("value").GetString();

            if (yValue.Contains("http"))
            {
                deleteQueryBuilder.AppendLine($@"<{commissioningPackageId}> <{xValue}> <{yValue}> . ");
            }
            else
            {
                deleteQueryBuilder.AppendLine($@"<{commissioningPackageId}> <{xValue}> ""{yValue}"" . ");
            }
        }
    }

    await RdfoxApi.DeleteData(conn, deleteQueryBuilder.ToString());

    query = $@"
    SELECT ?x ?y WHERE {{
        {{ ?y ?x <{commissioningPackageId}> . }}
    }}";

    try
    {
        result = await RdfoxApi.QuerySparql(conn, query);
        deleteQueryBuilder = new StringBuilder();

        using (JsonDocument docDel = JsonDocument.Parse(result))
        {
            var bindingsDel = docDel.RootElement.GetProperty("results").GetProperty("bindings");

            foreach (var binding in bindingsDel.EnumerateArray())
            {
                var xValue = binding.GetProperty("x").GetProperty("value").GetString();
                var yValue = binding.GetProperty("y").GetProperty("value").GetString();

                deleteQueryBuilder.AppendLine($@"<{yValue}> <{xValue}> <{commissioningPackageId}> . ");
            }
        }

        await RdfoxApi.DeleteData(conn, deleteQueryBuilder.ToString());
    }
    catch (Exception ex)
    {
         Console.WriteLine($"An error occurred while executing the second SPARQL query: {ex.Message}");
    }

    return Results.Ok($"Commissioning package {commissioningPackageId} deleted successfully.");

}).WithTags("Commissioning Package");


//Get all commissioning packages
app.MapGet("/commissioning-package/all", async () =>
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

    var commissioningPackages = new List<CommissioningPackage>();

    foreach (string id in packageIds)
    {
        query = $@"
            SELECT ?x ?y WHERE {{
                {{ <{id}> ?x ?y . }}
                UNION
                {{ ?y ?x <{id}> . }}
            }}
        ";

        result = await RdfoxApi.QuerySparql(conn, query);

        CommissioningPackage commissioningPackage;

        try
        {
            commissioningPackage = QueryUtils.ParseCommissioningPackageQueryResult(id, result);
        }
        catch (JsonException)
        {
            return Results.Problem("A json error occurred while parsing the SPARQL result.");
        }
        catch (Exception)
        {
            return Results.Problem("Null error occurred while parsing the SPARQL result.");
        }
        commissioningPackages.Add(commissioningPackage);
    }

    return Results.Ok(commissioningPackages);
}).WithTags("Commissioning Package");


//Get the ID of all commissioning packages
app.MapGet("/commissioning-package/ids", async () =>
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
}).WithTags("Commissioning Package");

app.Run();
