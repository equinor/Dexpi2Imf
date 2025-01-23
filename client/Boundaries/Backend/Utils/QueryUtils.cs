using static Boundaries.RdfoxApi;

namespace Backend.Utils;

public static class QueryUtils
{
    public static async Task<bool> IsBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> }}");

    public static async Task<bool> IsSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> }}");

    public static async Task DeleteSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await DeleteData(conn, $@"<{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .");

    public static async Task DeleteBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
        => await DeleteData(conn, $@"<{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .");

    public static async Task AddBounaryOf(string packageId, string nodeId, ConnectionSettings conn)
    => await LoadData(conn, $@"<{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .");

    public static async Task AddSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await LoadData(conn, $@"<{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .");

}
