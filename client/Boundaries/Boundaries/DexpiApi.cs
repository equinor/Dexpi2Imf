using IriTools;

namespace Boundaries;

public static class DexpiApi
{
    public static async Task<string> GetCommissioningPackage(string internalComponentLabel, IriReference[] borderComponentIris, string dexpiFilePath)
    {
        var datalogCreator = new DatalogCreator();
        var datalog = datalogCreator.CreateBoundaryDatalogRule(internalComponentLabel, borderComponentIris);
        var conn = RdfoxApi.GetDefaultConnectionSettings();
        await RdfoxApi.LoadDatalog(conn, datalog);

        var data = File.ReadAllText(dexpiFilePath);
        await RdfoxApi.LoadData(conn, data);

        var queryString = datalogCreator.CreateCommissioningSparqlQuery();
        var result = await RdfoxApi.QuerySparql(conn, queryString);

        await RdfoxApi.DeleteData(conn, data);
        await RdfoxApi.DeleteDatalog(conn, datalog);
        return result;
    }


    public static async Task<string> GetConnectedEquipment(string internalComponentLabel, string dexpiFilePath)
    {
        var datalogCreator = new DatalogCreator();
        var datalog = datalogCreator.CreateConnectedDatalogRule(internalComponentLabel);
        var conn = RdfoxApi.GetDefaultConnectionSettings();
        await RdfoxApi.LoadDatalog(conn, datalog);

        var data = File.ReadAllText(dexpiFilePath);
        await RdfoxApi.LoadData(conn, data);

        var queryString = datalogCreator.CreateConnectedSparqlQuery();
        var result = await RdfoxApi.QuerySparql(conn, queryString);

        await RdfoxApi.DeleteData(conn, data);
        await RdfoxApi.DeleteDatalog(conn, datalog);
        return result;
    }
}