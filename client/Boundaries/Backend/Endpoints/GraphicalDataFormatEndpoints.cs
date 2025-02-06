namespace Backend.Endpoints;

public static class GraphicalDataFormatEndpoints
{
    public static void MapGraphicalDataFormatEndpoints(this IEndpointRouteBuilder endpoints)
    {
        // Get graphical data format by P&ID id
        endpoints.MapGet("/graphical-data-format/{documentId}", async (string documentId) =>
        {
            var diagramId = Uri.UnescapeDataString(documentId);

            // return example file
            var filePath = Path.Combine(AppContext.BaseDirectory, "Example", "graphical-data-format-example.json");
            return Results.Stream(File.OpenRead(filePath), "application/json");
        }).WithTags("Graphical Data Format");

        // Get all P&ID graphical data formats
        endpoints.MapGet("/graphical-data-format/all", () =>
        {
            throw new NotImplementedException("TODO: Not implemented...");
        });
    }
}