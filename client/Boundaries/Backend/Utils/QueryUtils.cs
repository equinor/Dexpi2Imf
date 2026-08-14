using Backend.Model;
using Boundaries;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Backend.Utils;

public static class QueryUtils
{
    private static readonly Regex SafeIriRefContentPattern = new(@"^[^<>\s""{}|^`\\]+$", RegexOptions.Compiled);

    private static string AsSafeIriRefContent(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value) || !SafeIriRefContentPattern.IsMatch(value))
            throw new ArgumentException($"Invalid IRI reference content for parameter '{paramName}'.", paramName);

        return value;
    }

    #region Boundary actions
    public static async Task<bool> IsBoundaryOf(string packageId, string nodeId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        return await dagalogApi.AskSparql($@"ASK WHERE {{ <{safeNodeId}> {PropertiesProvider.isBoundaryOf} <{safePackageId}> .}}");
    }

    public static async Task DeleteIsBoundaryOf(string packageId, string nodeId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        await dagalogApi.DeleteData($@"<{safeNodeId}> {PropertiesProvider.isBoundaryOf} <{safePackageId}> .");
    }

    public static async Task AddIsBoundaryOf(string packageId, string nodeId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        await dagalogApi.InsertData($@"<{safeNodeId}> {PropertiesProvider.isBoundaryOf} <{safePackageId}> .");
    }

    #endregion

    #region SelectedInternal actions
    public static async Task<bool> IsSelectedInternalOf(string packageId, string nodeId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        return await dagalogApi.AskSparql($@"ASK WHERE {{ <{safeNodeId}> {PropertiesProvider.isSelectedInternalOf} <{safePackageId}> . }}");
    }

    public static async Task DeleteIsSelectedInternalOf(string packageId, string nodeId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        await dagalogApi.DeleteData($@"<{safeNodeId}> {PropertiesProvider.isSelectedInternalOf} <{safePackageId}> .");
    }

    public static async Task AddIsSelectedInternalOf(string packageId, string nodeId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        await dagalogApi.InsertData($@"<{safeNodeId}> {PropertiesProvider.isSelectedInternalOf} <{safePackageId}> .");
    }
    #endregion

    #region IsInPackage actions 
    public static async Task<bool> NodeIsInPackage(string packageId, string nodeId, DagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        return await dagalogApi.AskSparql($@"ASK WHERE {{ <{safeNodeId}> {PropertiesProvider.isInPackage} <{safePackageId}> . }}");
    }

    public static async Task DeleteNodeFromPackage(string packageId, string nodeId, DagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        var safeNodeId = AsSafeIriRefContent(nodeId, nameof(nodeId));
        await dagalogApi.InsertData($"<{safeNodeId}> {PropertiesProvider.isInPackage} <{safePackageId}> .");
    }
    #endregion

    #region CommissioningPackage actions
    public static async Task<bool> CommissioningPackageExists(string packageId, IDagalogApi dagalogApi)
    {
        var safePackageId = AsSafeIriRefContent(packageId, nameof(packageId));
        return await dagalogApi.AskSparql($@"ASK WHERE {{ <{safePackageId}> {TypesProvider.type} {PropertiesProvider.CommissioningPackage} . }}");
    }

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
