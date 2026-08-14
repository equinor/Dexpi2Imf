using System.Text;
using System.Text.Json;
using Backend.Model;
using Backend.Utils;
using Boundaries;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Endpoints;

public static class CommissioningPackageEndpoints
{
    private static string ToSafeIri(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("IRI value cannot be null or whitespace.");

        if (value.IndexOfAny(['<', '>', '"', '{', '}', '|', '\\', '^', '`']) >= 0 || value.Any(char.IsWhiteSpace))
            throw new ArgumentException("IRI contains invalid characters.");

        return Uri.IsWellFormedUriString(value, UriKind.Absolute)
            ? value
            : Uri.EscapeUriString(value);
    }

    private static string EscapeSparqlLiteral(string value)
    {
        if (value is null) return string.Empty;
        return value
            .Replace("\\", "\\\\")
            .Replace("\"", "\\\"")
            .Replace("\r", "\\r")
            .Replace("\n", "\\n")
            .Replace("\t", "\\t");
    }
    public static void MapCommissioningPackageEndpoints(this IEndpointRouteBuilder endpoints)
    {
        //Add commissioning package
        endpoints.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage, [FromServices] IDagalogApi dagalogApi) =>
        {
            var safeId = ToSafeIri(commissioningPackage.Id);
            var safeName = EscapeSparqlLiteral(commissioningPackage.Name);
            var safeColor = EscapeSparqlLiteral(commissioningPackage.Color);

            var data = new StringBuilder();
            data.AppendLine($@"<{safeId}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .");
            data.AppendLine($@"<{safeId}> {PropertiesProvider.hasName} ""{safeName}"" .");
            data.AppendLine($@"<{safeId}> {PropertiesProvider.hasColor} ""{safeColor}"" .");

            try
            {
                await dagalogApi.InsertData(data.ToString());
                return Results.Ok(new { message = $"Commissioning package {commissioningPackage.Id} added successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[POST /commissioning-package] Exception: {ex}");
                return Results.Problem("Failed to create commissioning package.");
            }
        }).WithTags("Commissioning Package");


        // Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries.
        endpoints.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage, [FromServices] IDagalogApi dagalogApi) =>
        {
            var safeUpdatedId = ToSafeIri(updatedPackage.Id);
            var safeUpdatedName = EscapeSparqlLiteral(updatedPackage.Name);
            var safeUpdatedColor = EscapeSparqlLiteral(updatedPackage.Color);

            var getQuery = $@"
            SELECT ?object WHERE {{
                {{ <{safeUpdatedId}> {PropertiesProvider.hasColor} ?object . }}
                UNION
                {{ <{safeUpdatedId}> {PropertiesProvider.hasName} ?object .  }}
            }}
            ";

            var result = await dagalogApi.QuerySparql(getQuery);

            var oldPackageName = string.Empty;
            var oldPackageColor = string.Empty;

            using (var doc = JsonDocument.Parse(result))
            {
                var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings").EnumerateArray().ToList();

                if (bindings.Count >= 2)
                {
                    oldPackageName = bindings[0].GetProperty("object").GetProperty("value").GetString();
                    oldPackageColor = bindings[1].GetProperty("object").GetProperty("value").GetString();
                }
            }

            // Log the existing color and name of the package
            var deleteData = $@"<{safeUpdatedId}> {PropertiesProvider.hasColor} ""{EscapeSparqlLiteral(oldPackageColor)}"" .
                                <{safeUpdatedId}> {PropertiesProvider.hasName} ""{EscapeSparqlLiteral(oldPackageName)}"" . ";


            await dagalogApi.DeleteData(deleteData);

            var data = $@"
                <{safeUpdatedId}> {PropertiesProvider.hasName} ""{safeUpdatedName}"" .
                <{safeUpdatedId}> {PropertiesProvider.hasColor} ""{safeUpdatedColor}"" .
            ";

            await dagalogApi.InsertData(data);

            return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
        }).WithTags("Commissioning Package");


        //Get commissioning package
        endpoints.MapGet("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId, [FromServices] IDagalogApi dagalogApi) =>
        {
            commissioningPackageId = ToSafeIri(Uri.UnescapeDataString(commissioningPackageId));

            if (!await QueryUtils.CommissioningPackageExists(commissioningPackageId, dagalogApi))
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

            var result = await dagalogApi.QuerySparql(query);

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
        endpoints.MapDelete("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId, [FromServices] IDagalogApi dagalogApi) =>
        {
            commissioningPackageId = ToSafeIri(Uri.UnescapeDataString(commissioningPackageId));

            if (!await QueryUtils.CommissioningPackageExists(commissioningPackageId, dagalogApi))
            {
                return Results.NotFound($"Commissioning package {commissioningPackageId} not found.");
            }

            var query = $@"
            SELECT ?x ?y WHERE {{
                {{ <{commissioningPackageId}> ?x ?y . }}
            }}";

            var result = await dagalogApi.QuerySparql(query);
            var deleteQueryBuilder = new StringBuilder();


            using (var doc = JsonDocument.Parse(result))
            {
                var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

                foreach (var binding in bindings.EnumerateArray())
                {
                    var xValue = binding.GetProperty("x").GetProperty("value").GetString();
                    var yValue = binding.GetProperty("y").GetProperty("value").GetString();

                    var safeX = ToSafeIri(xValue ?? string.Empty);
                    if (yValue != null && yValue.Contains("http"))
                    {
                        var safeYIri = ToSafeIri(yValue);
                        deleteQueryBuilder.AppendLine($@"<{commissioningPackageId}> <{safeX}> <{safeYIri}> . ");
                    }
                    else
                    {
                        deleteQueryBuilder.AppendLine($@"<{commissioningPackageId}> <{safeX}> ""{EscapeSparqlLiteral(yValue ?? string.Empty)}"" . ");
                    }
                }
            }

            await dagalogApi.DeleteData( deleteQueryBuilder.ToString());

            query = $@"
            SELECT ?x ?y WHERE {{
                {{ ?y ?x <{commissioningPackageId}> . }}
            }}";

            try
            {
                result = await dagalogApi.QuerySparql(query);
                deleteQueryBuilder = new StringBuilder();

                using (var docDel = JsonDocument.Parse(result))
                {
                    var bindingsDel = docDel.RootElement.GetProperty("results").GetProperty("bindings");

                    foreach (var binding in bindingsDel.EnumerateArray())
                    {
                        var xValue = binding.GetProperty("x").GetProperty("value").GetString();
                        var yValue = binding.GetProperty("y").GetProperty("value").GetString();

                        deleteQueryBuilder.AppendLine($@"<{ToSafeIri(yValue ?? string.Empty)}> <{ToSafeIri(xValue ?? string.Empty)}> <{commissioningPackageId}> . ");
                    }
                }

                await dagalogApi.DeleteData(deleteQueryBuilder.ToString());
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"An error occurred while executing the second SPARQL query: {ex.Message}");
            }

            return Results.Ok($"Commissioning package {commissioningPackageId} deleted successfully.");

        }).WithTags("Commissioning Package");


        //Get all commissioning packages
        endpoints.MapGet("/commissioning-package/all", async ([FromServices] IDagalogApi dagalogApi) =>
        {
            var query = $@"
                SELECT ?packageId WHERE {{
                    ?packageId rdf:type {PropertiesProvider.CommissioningPackage} .
                }}";

            var result = await dagalogApi.QuerySparql(query);

            var jsonResponse = JsonDocument.Parse(result);
            var packageIds = jsonResponse.RootElement
                .GetProperty("results")
                .GetProperty("bindings")
                .EnumerateArray()
                .Select(binding => binding.GetProperty("packageId").GetProperty("value").GetString())
                .ToList();

            var commissioningPackages = new List<CommissioningPackage>();

            foreach (var id in packageIds)
            {
                query = $@"
                    SELECT ?x ?y WHERE {{
                        {{ <{id}> ?x ?y . }}
                        UNION
                        {{ ?y ?x <{id}> . }}
                    }}
                ";

                result = await dagalogApi.QuerySparql(query);

                CommissioningPackage commissioningPackage;

                try
                {
                    commissioningPackage = QueryUtils.ParseCommissioningPackageQueryResult(id ?? throw new InvalidOperationException(), result);
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
        endpoints.MapGet("/commissioning-package/ids", async ([FromServices] IDagalogApi dagalogApi) =>
        {
            var query = $@"
                SELECT ?packageId WHERE {{
                    ?packageId rdf:type {PropertiesProvider.CommissioningPackage} .
                }}";

            var result = await dagalogApi.QuerySparql(query);

            var jsonResponse = JsonDocument.Parse(result);
            var packageIds = jsonResponse.RootElement
                .GetProperty("results")
                .GetProperty("bindings")
                .EnumerateArray()
                .Select(binding => binding.GetProperty("packageId").GetProperty("value").GetString())
                .ToList();

            return Results.Ok(packageIds);
        }).WithTags("Commissioning Package");
    }
}