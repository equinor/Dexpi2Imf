using System.Text.Json;
using Backend.Utils;
using Boundaries;

namespace Backend.Endpoints;

public static class BoundaryEndpoints
{
    public static void MapBoundaryEndpoints(this IEndpointRouteBuilder endpoints, RdfoxApi.ConnectionSettings connectionSettings)
    {
        #region Boundaries
        //Update boundary
        endpoints.MapPost("/commissioning-package/{packageId}/update-boundary/{nodeId}", async (string packageId, string nodeId) =>
        {
            packageId = Uri.UnescapeDataString(packageId);
            nodeId = Uri.UnescapeDataString(nodeId);

            if (!await QueryUtils.CommissioningPackageExists(packageId, connectionSettings))
            {
                return Results.NotFound($"Commissioning package {packageId} not found.");
            }

            var isSelectedInternal = await QueryUtils.IsSelectedInternalOf(packageId, nodeId, connectionSettings);
            var isBoundary = await QueryUtils.IsBoundaryOf(packageId, nodeId, connectionSettings);

            if (isSelectedInternal)
                await QueryUtils.DeleteIsSelectedInternalOf(packageId, nodeId, connectionSettings);

            if (isBoundary)
            {
                await QueryUtils.DeleteIsBoundaryOf(packageId, nodeId, connectionSettings);
            }
            else
            {
                await QueryUtils.AddIsBoundaryOf(packageId, nodeId, connectionSettings);
            }

            return Results.Ok();
        }).WithTags("Boundary");


        // Add node as boundary
        endpoints.MapPost("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
        {
            packageId = Uri.UnescapeDataString(packageId);
            nodeId = Uri.UnescapeDataString(nodeId);

            if (!await QueryUtils.CommissioningPackageExists(packageId, connectionSettings))
            {
                return Results.NotFound($"Commissioning package {packageId} not found.");
            }

            var data = $@"
                     <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .";

            await RdfoxApi.LoadData(connectionSettings, data);

            return Results.Ok($"Triple with subject {packageId} and object {nodeId} inserted successfully.");
        }).WithTags("Boundary");


        // Remove node as boundary
        endpoints.MapDelete("/commissioning-package/{packageId}/boundary/{nodeId}", async (string packageId, string nodeId) =>
        {
            packageId = Uri.UnescapeDataString(packageId);
            nodeId = Uri.UnescapeDataString(nodeId);

            if (!await QueryUtils.CommissioningPackageExists(packageId, connectionSettings))
            {
                return Results.NotFound($"Commissioning package {packageId} not found.");
            }

            var data = $@"
                     <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .
                ";

            await RdfoxApi.DeleteData(connectionSettings, data);

            return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
        }).WithTags("Boundary");
        #endregion

        #region Internal
        //Update selected internal
        endpoints.MapPost("/commissioning-package/{packageId}/update-internal/{nodeId}", async (string packageId, string nodeId) =>
        {
            packageId = Uri.UnescapeDataString(packageId);
            nodeId = Uri.UnescapeDataString(nodeId);

            if (!await QueryUtils.CommissioningPackageExists(packageId, connectionSettings))
            {
                return Results.NotFound($"Commissioning package {packageId} not found.");
            }

            var isSelectedInternal = await QueryUtils.IsSelectedInternalOf(packageId, nodeId, connectionSettings);
            var isBoundary = await QueryUtils.IsBoundaryOf(packageId, nodeId, connectionSettings);

            if (isBoundary)
                await QueryUtils.DeleteIsBoundaryOf(packageId, nodeId, connectionSettings);

            if (isSelectedInternal)
            {
                await QueryUtils.DeleteIsSelectedInternalOf(packageId, nodeId, connectionSettings);
            }
            else
            {
                await QueryUtils.AddIsSelectedInternalOf(packageId, nodeId, connectionSettings);
            }

            return Results.Ok();
        }).WithTags("Internal");


        //Add node as internal
        endpoints.MapPost("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
        {
            packageId = Uri.UnescapeDataString(packageId);
            nodeId = Uri.UnescapeDataString(nodeId);

            if (!await QueryUtils.CommissioningPackageExists(packageId, connectionSettings))
            {
                return Results.NotFound($"Commissioning package {packageId} not found.");
            }

            var data = $@"
                     <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
                ";

            await RdfoxApi.LoadData(connectionSettings, data);

            return Results.Ok($"Triple for package {packageId} and node {nodeId} inserted successfully.");
        }).WithTags("Internal");


        // Remove node as internal
        endpoints.MapDelete("/commissioning-package/{packageId}/internal/{nodeId}", async (string packageId, string nodeId) =>
        {
            packageId = Uri.UnescapeDataString(packageId);
            nodeId = Uri.UnescapeDataString(nodeId);

            if (!await QueryUtils.CommissioningPackageExists(packageId, connectionSettings))
            {
                return Results.NotFound($"Commissioning package {packageId} not found.");
            }

            var data = $@"
                     <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .
                ";

            await RdfoxApi.DeleteData(connectionSettings, data);

            return Results.Ok($"Triple for package {packageId} and node {nodeId} deleted successfully.");
        }).WithTags("Internal");
        #endregion

        #region Nodes
        //Get adjacent nodes
        endpoints.MapGet("/nodes/{nodeId}/adjacent", async (string nodeId) =>
        {
            nodeId = Uri.UnescapeDataString(nodeId);

            var query = $@"SELECT ?neighbour WHERE {{ <{nodeId}> {PropertiesProvider.adjacentTo} ?neighbour }}";

            var result = await RdfoxApi.QuerySparql(connectionSettings, query);

            var adjacentNodes = new List<string>();

            try
            {
                using var doc = JsonDocument.Parse(result);
                var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

                adjacentNodes.AddRange(bindings
                    .EnumerateArray()
                    .Select(binding => binding
                        .GetProperty("neighbour")
                        .GetProperty("value")
                        .GetString())
                    .OfType<string>()
                );
            }
            catch (JsonException e)
            {
                return Results.Problem("An error occurred while parsing the SPARQL result.");
            }

            return Results.Ok(adjacentNodes);
        }).WithTags("Nodes");
        #endregion
    }
}