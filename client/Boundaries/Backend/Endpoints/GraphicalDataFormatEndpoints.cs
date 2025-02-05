namespace Backend.Endpoints;

public static class GraphicalDataFormatEndpoints
{
    public static void MapGraphicalDataFormatEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/graphical-data-format", async () =>
        {
            var filePath = Path.Combine(AppContext.BaseDirectory, "Example", "graphical-data-format-example.json");
            var jsonContent = await File.ReadAllTextAsync(filePath);
            return Results.Json(jsonContent);
        }).WithTags("Graphical Data Format");
    }
}