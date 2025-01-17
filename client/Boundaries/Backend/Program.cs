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
    // Add check for package existing
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

    // Define the SPARQL query to check if the triple exists
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

    // Define the data to delete
    var data = $@"
         <{nodeId}> comp:isBoundaryOf <{packageId}> .
    ";

    await RdfoxApi.DeleteData(conn, data);
    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

// Remove node as internal
app.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
{
    // Example triple in Turtle syntax to delete
    var data = $@"
        <{nodeId}> comp:isInPackage <{packageId}> .
    ";

    // Delete data from RDFox
    await RdfoxApi.DeleteData(conn, data);

    // Return success response
    return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", (string nodeId) =>
{
    // SELECT ?neighb WHERE {<nodeId> imf:adjacentTo ?neighb }
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

    // Save the commissioning package data to RDFox
    await RdfoxApi.LoadData(conn, data.ToString());

    // Return success response
    return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
});

//Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries. 
app.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage) =>
{
    var queryName = $@"
        SELECT ?name WHERE {{
            <{updatedPackage.Id}> comp:hasName ?name .
        }}";
    var existingPackageName = await RdfoxApi.QuerySparql(conn, queryName);


    // Check if the package exists
    if (existingPackageName == null)
    {
        return Results.NotFound($"Commissioning package with ID {updatedPackage.Id} not found.");
    }
    var queryColor = $@"
        SELECT ?name WHERE {{
            <{updatedPackage.Id}> comp:hasColor ?color .
        }}";
    var existingPackageColor = await RdfoxApi.QuerySparql(conn, queryColor);

    // DELETE {<{updatedPackage.Id}> comp:hasColor ?color .} INSERT { <{updatedPackage.Id}> comp:hasColor <{updatedPackage.Colour}> } } WHERE {<{updatedPackage.Id}> comp:hasColor ?color .}
    // Delete the old triples for the mutable properties
    var deleteData = new StringBuilder();
    deleteData.AppendLine($@"<{updatedPackage.Id}> comp:hasName ""{existingPackageName}"" .");
    deleteData.AppendLine($@"<{updatedPackage.Id}> comp:hasColour ""{existingPackageColor}"" .");
    await RdfoxApi.DeleteData(conn, deleteData.ToString());

    // Construct the new triples with the updated properties
    var insertData = new StringBuilder();
    insertData.AppendLine($@"<{updatedPackage.Id}> comp:hasName ""{updatedPackage.Name}"" .");
    insertData.AppendLine($@"<{updatedPackage.Id}> comp:hasColour ""{updatedPackage.Colour}"" .");

    await RdfoxApi.LoadData(conn, insertData.ToString());

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

    // Return success response
    return Results.Ok($"Commissioning package {commissioningPackageId} deleted");
});

//Get commissioning package
app.MapGet("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId) =>
{
    var query = $@"
            SELECT ?predicate ?object WHERE {{
                <{commissioningPackageId}> ?predicate ?object .
            }}";

    //NOTE, should it just return all the trippels associated with the package, or should it return a commissioning package object?
    // Execute the SPARQL query
    var result = await RdfoxApi.QuerySparql(conn, query);

    // Parse the result to populate the CommissioningPackage object
    var commissioningPackage = new CommissioningPackage
    {
        Id = commissioningPackageId,
        Name = string.Empty,
        Colour = string.Empty,
        Boundary = new List<Node>(),
        CalculatedInternal = new List<Node>(),
        SelectedInternal = new List<Node>()
    };

    // Parse the SPARQL result (assuming it's in a format that can be parsed line by line)
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

    // Return the populated CommissioningPackage object
    return Results.Ok(commissioningPackage);
});  

app.Run();
