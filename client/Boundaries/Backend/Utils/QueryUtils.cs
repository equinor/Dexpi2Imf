using Backend.Model;
using System.Text.Json;
using static Boundaries.RdfoxApi;

namespace Backend.Utils;

public static class QueryUtils
{

    #region Boundary actions
    public static async Task<bool> IsBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .}}");

    public static async Task DeleteIsBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
        => await DeleteData(conn, $@"<{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .");

    public static async Task AddIsBoundaryOf(string packageId, string nodeId, ConnectionSettings conn)
    => await LoadData(conn, $@"<{nodeId}> {PropertiesProvider.isBoundaryOf} <{packageId}> .");

    #endregion

    #region SelectedInternal actions
    public static async Task<bool> IsSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> . }}");

    public static async Task DeleteIsSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
    => await DeleteData(conn, $@"<{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .");

    public static async Task AddIsSelectedInternalOf(string packageId, string nodeId, ConnectionSettings conn)
        => await LoadData(conn, $@"<{nodeId}> {PropertiesProvider.isSelectedInternalOf} <{packageId}> .");
    #endregion

    #region IsInPackage actions 
    public static async Task<bool> NodeIsInPackage(string packageId, string nodeId, ConnectionSettings conn)
    => await AskSparql(conn, $@"ASK WHERE {{ <{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> . }}");

    public static async Task DeleteNodeFromPackage(string packageId, string nodeId, ConnectionSettings conn)
        => await LoadData(conn, $"<{nodeId}> {PropertiesProvider.isInPackage} <{packageId}> .");
    #endregion

    #region CommissioningPackage actions
    public static async Task<bool> CommissioningPackageExists(string packageId, ConnectionSettings conn)
        => await AskSparql(conn, $@"ASK WHERE {{ <{packageId}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} . }}");

    public static CommissioningPackage ParseCommissioningPackageQueryResult(string id, string queryResult)
    {
        var commissioningPackage = new CommissioningPackage
        {
            Id = id,
            Name = string.Empty,
            Color = string.Empty,
            BoundaryNodes = [],
            InternalNodes = [],
            SelectedInternalNodes = []
        };

        using JsonDocument doc = JsonDocument.Parse(queryResult);
        var bindings = doc.RootElement.GetProperty("results").GetProperty("bindings");

        foreach (var binding in bindings.EnumerateArray())
        {
            var xValue = binding.GetProperty("x").GetProperty("value").GetString() ?? throw new Exception("xValue is null");
            var yValue = binding.GetProperty("y").GetProperty("value").GetString() ?? throw new Exception("yValue is null");

            // Handle the predicates and corresponding values
            switch (xValue)
            {
                case "https://rdf.equinor.com/completion#hasName":
                    commissioningPackage.Name = yValue;
                    break;
                case "https://rdf.equinor.com/completion#hasColour":
                    commissioningPackage.Color = yValue;
                    break;
                case "https://rdf.equinor.com/completion#isBoundaryOf":
                    commissioningPackage.BoundaryNodes.Add(new Node { Id = yValue });
                    break;
                case "https://rdf.equinor.com/completion#isInPackage":
                    commissioningPackage.InternalNodes.Add(new Node { Id = yValue });
                    break;
                case "https://rdf.equinor.com/completion#isSelectedInternalOf":
                    commissioningPackage.SelectedInternalNodes.Add(new Node { Id = yValue });
                    break;
            }
        }
        return commissioningPackage;
    }
}


#endregion
