using static Boundaries.RdfoxApi;

namespace Backend.Utils;

public static class QueryUtils
{

    #region Boundary actions
    public static async Task<bool> IsBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .}}");

    public static async Task DeleteisBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
        => await DeleteData(conn, $@"<{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .");

    public static async Task AddisBounaryOf(string packageId, string nodeId, ConnectionSettings conn)
    => await LoadData(conn, $@"<{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .");

    #endregion

    #region SelectedInternal actions
    public static async Task<bool> IsSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> . }}");

    public static async Task DeleteIsSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
    => await DeleteData(conn, $@"<{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .");

    public static async Task AddSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await LoadData(conn, $@"<{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .");
    #endregion

    #region IsInPackage actions 
    public static async Task<bool> NodeIsInPackage(string packageId, string nodeId, ConnectionSettings conn)
    => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> . }}");

    public static async Task DeleteNodeFromPackage(string packageId, string nodeId, ConnectionSettings conn) 
        => await LoadData(conn, $"<{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .");
    #endregion

    #region CommissioningPackage actions
    public static async Task<bool> CommissioningPackageExists(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{packageId}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} . }}");

    #endregion
}
