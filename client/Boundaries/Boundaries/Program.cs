using IriTools;

namespace Boundaries;

internal class Program
{
    private static async Task Main(string[] args)
    {
        if (args.Length < 2)
        {
            Console.WriteLine(
                "Usage \"dotnet run filename-for-dexpi-in-rdf \"label-of-internal-componenet\" iri-of-border-component ... iri-of-border-component ");
            Console.WriteLine(
                "For finding a commissioning package from boundary use f.ex. \"dotnet run  ../../../rml/pandid.trig \"T4750\" https://assetid.equinor.com/plantx#Nozzle-12 https://assetid.equinor.com/plantx#Nozzle-8 https://assetid.equinor.com/plantx#PlateHeatExchanger-1 https://assetid.equinor.com/plantx#ReciprocatingPump-1\"");
            Console.WriteLine("For finding directly connected equipemnt use f.ex. \"dotnet run  ../../../rml/pandid.trig \"P4711\"");
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
        var result = borderComponentIris.Any() ?
            await DexpiApi.GetCommissioningPackage(internalComponentLabel, borderComponentIris, dexpiFilePath)
            : await DexpiApi.GetConnectedEquipment(internalComponentLabel, dexpiFilePath);
        Console.WriteLine("Commissioning package:");
        Console.WriteLine(result);

    }
}