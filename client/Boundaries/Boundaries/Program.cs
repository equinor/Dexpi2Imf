using IriTools;

namespace Boundaries;

internal class Program
{
    private static async Task Main(string[] args)
    {
        if (args.Length < 3)
        {
            Console.WriteLine(
                "Usage \"dotnet run filename-for-dexpi-in-rdf \"label-of-internal-componenet\" iri-of-border-component ... iri-of-border-component ");
            Console.WriteLine(
                "For example \"dotnet run  ../../../rml/pandid.trig \"T4750\" https://assetid.equinor.com/plantx#Nozzle-12 https://assetid.equinor.com/plantx#Nozzle-8 https://assetid.equinor.com/plantx#PlateHeatExchanger-1 https://assetid.equinor.com/plantx#ReciprocatingPump-1");
            return;
        }

        var dexpiFilePath = args[0];
        var internalComponentLabel = args[1];
        if (!File.Exists(dexpiFilePath))
        {
            Console.WriteLine(
                $"Could not find one of the input file {dexpiFilePath}");
            return;
        }

        var borderComponentIris = args.Skip(2).Select(iri => new IriReference(iri)).ToArray();
        var datalogCreator = new DatalogCreator();
        var datalog = datalogCreator.CreateBoundaryDatalogRule(internalComponentLabel, borderComponentIris);
        var conn = RdfoxApi.GetDefaultConnectionSettings();
        await RdfoxApi.LoadDatalog(conn, datalog);
        Console.WriteLine(datalog);
        var data = File.ReadAllText(dexpiFilePath);
        await RdfoxApi.LoadData(conn, data);

        var queryString = datalogCreator.CreateCommissioningSparqlQuery();
        var result = await RdfoxApi.QuerySparql(conn, queryString);
        Console.WriteLine("Commissioning package:");
        Console.WriteLine(result);
        
        await RdfoxApi.DeleteData(conn, data);
        await RdfoxApi.DeleteDatalog(conn, datalog);

    }
}