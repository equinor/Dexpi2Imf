namespace Backend.Endpoints;

public static class GraphicalDataFormatEndpoints
{
    public static void MapGraphicalDataFormatEndpoints(this IEndpointRouteBuilder endpoints)
    {
        // Get graphical data format by P&ID id
        endpoints.MapGet("/graphical-data-format/{id}", async (string id) =>
        {
            // return example file
            var filePath = Path.Combine(AppContext.BaseDirectory, "Example", "graphical-data-format-example.json");
            var jsonContent = await File.ReadAllTextAsync(filePath);
            return Results.Json(jsonContent);
        }).WithTags("Graphical Data Format");

        // Get all P&ID graphical data formats
        endpoints.MapGet("/graphical-data-format/all", () =>
        {
            throw new NotImplementedException("TODO: Not implemented...");
        });
    }
}