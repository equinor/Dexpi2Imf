using System.Text;
using System.Text.Json;
using Backend.Model;
using Backend.Utils;
using Boundaries;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Endpoints;

public static class CommissioningPackageEndpoints
{
    public static void MapCommissioningPackageEndpoints(this IEndpointRouteBuilder endpoints)
    {
         //Add commissioning package
         endpoints.MapPost("/commissioning-package", async (CommissioningPackage commissioningPackage, [FromServices] IRdfoxApi rdfoxApi) =>
         {
            var data = new StringBuilder();
            data.AppendLine($@"<{commissioningPackage.Id}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} .");
            data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasName} ""{commissioningPackage.Name}"" .");
            data.AppendLine($@"<{commissioningPackage.Id}> {PropertiesProvider.hasColor} ""{commissioningPackage.Color}"" .");

            await rdfoxApi.LoadData(data.ToString());

            return Results.Ok($"Commissioning package {commissioningPackage.Id} added successfully.");
        }).WithTags("Commissioning Package");


        // Update commissioning package - updating information like name and color while persisting the calculated internal nodes, and boundaries.
        endpoints.MapPut("/commissioning-package", async (CommissioningPackage updatedPackage, [FromServices] IRdfoxApi rdfoxApi) =>
        {
            var getQuery = $@"
            SELECT ?object WHERE {{
                {{ <{updatedPackage.Id}> {PropertiesProvider.hasColor} ?object . }}
                UNION
                {{ <{updatedPackage.Id}> {PropertiesProvider.hasName} ?object .  }}
            }}
            ";

            var result = await rdfoxApi.QuerySparql(getQuery);

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
            var deleteData = $@"<{updatedPackage.Id}> {PropertiesProvider.hasColor} ""{oldPackageColor}"" .
                                <{updatedPackage.Id}> {PropertiesProvider.hasName} ""{oldPackageName}"" . ";


            await rdfoxApi.DeleteData(deleteData);

            var data = $@"
                <{updatedPackage.Id}> {PropertiesProvider.hasName} ""{updatedPackage.Name}"" .
                <{updatedPackage.Id}> {PropertiesProvider.hasColor} ""{updatedPackage.Color}"" .
            ";

            await rdfoxApi.LoadData(data);

            return Results.Ok($"Commissioning package {updatedPackage.Id} updated successfully.");
        }).WithTags("Commissioning Package");


        //Get commissioning package
        endpoints.MapGet("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId, [FromServices] IRdfoxApi rdfoxApi) =>
        {
            commissioningPackageId = Uri.UnescapeDataString(commissioningPackageId);

            if (!await QueryUtils.CommissioningPackageExists(commissioningPackageId, rdfoxApi))
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

            var result = await rdfoxApi.QuerySparql(query);

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
        endpoints.MapDelete("/commissioning-package/{commissioningPackageId}", async (string commissioningPackageId, [FromServices] IRdfoxApi rdfoxApi) =>
        {
            commissioningPackageId = Uri.UnescapeDataString(commissioningPackageId);

            if (!await QueryUtils.CommissioningPackageExists(commissioningPackageId, rdfoxApi))
            {
                return Results.NotFound($"Commissioning package {commissioningPackageId} not found.");
            }

            var query = $@"
            SELECT ?x ?y WHERE {{
                {{ <{commissioningPackageId}> ?x ?y . }}
            }}";

            var result = await rdfoxApi.QuerySparql(query);
            var deleteQueryBuilder = new StringBuilder();


            using (var doc = JsonDocument.Parse(result))
            {
                var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

                foreach (var binding in bindings.EnumerateArray())
                {
                    var xValue = binding.GetProperty("x").GetProperty("value").GetString();
                    var yValue = binding.GetProperty("y").GetProperty("value").GetString();

                    if (yValue != null && yValue.Contains("http"))
                    {
                        deleteQueryBuilder.AppendLine($@"<{commissioningPackageId}> <{xValue}> <{yValue}> . ");
                    }
                    else
                    {
                        deleteQueryBuilder.AppendLine($@"<{commissioningPackageId}> <{xValue}> ""{yValue}"" . ");
                    }
                }
            }

            await rdfoxApi.DeleteData( deleteQueryBuilder.ToString());

            query = $@"
            SELECT ?x ?y WHERE {{
                {{ ?y ?x <{commissioningPackageId}> . }}
            }}";

            try
            {
                result = await rdfoxApi.QuerySparql(query);
                deleteQueryBuilder = new StringBuilder();

                using (var docDel = JsonDocument.Parse(result))
                {
                    var bindingsDel = docDel.RootElement.GetProperty("results").GetProperty("bindings");

                    foreach (var binding in bindingsDel.EnumerateArray())
                    {
                        var xValue = binding.GetProperty("x").GetProperty("value").GetString();
                        var yValue = binding.GetProperty("y").GetProperty("value").GetString();

                        deleteQueryBuilder.AppendLine($@"<{yValue}> <{xValue}> <{commissioningPackageId}> . ");
                    }
                }

                await rdfoxApi.DeleteData(deleteQueryBuilder.ToString());
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"An error occurred while executing the second SPARQL query: {ex.Message}");
            }

            return Results.Ok($"Commissioning package {commissioningPackageId} deleted successfully.");

        }).WithTags("Commissioning Package");


        //Get all commissioning packages
        endpoints.MapGet("/commissioning-package/all", async ([FromServices] IRdfoxApi rdfoxApi) =>
        {
            var query = $@"
                SELECT ?packageId WHERE {{
                    ?packageId rdf:type {PropertiesProvider.CommissioningPackage} .
                }}";

            var result = await rdfoxApi.QuerySparql(query);

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

                result = await rdfoxApi.QuerySparql(query);

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
        endpoints.MapGet("/commissioning-package/ids", async ([FromServices] IRdfoxApi rdfoxApi) =>
        {
            var query = $@"
                SELECT ?packageId WHERE {{
                    ?packageId rdf:type {PropertiesProvider.CommissioningPackage} .
                }}";

            var result = await rdfoxApi.QuerySparql(query);

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