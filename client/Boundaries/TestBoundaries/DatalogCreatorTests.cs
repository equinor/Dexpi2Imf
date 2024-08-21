namespace TestBoundaries;

public class DatalogCreatorTests
{
    [Fact]
    public void TestCreateDatalog()
    {
        var datalog = Boundaries.DatalogCreator.CreateBoundaryDatalogRule("T4750", new IriTools.IriReference[]
        {
            new IriTools.IriReference("https://assetid.equinor.com/plantx#Nozzle-12"),
            new IriTools.IriReference("https://assetid.equinor.com/plantx#Nozzle-8"),
            new IriTools.IriReference("https://assetid.equinor.com/plantx#PlateHeatExchanger-1"),
            new IriTools.IriReference("https://assetid.equinor.com/plantx#ReciprocatingPump-1")
        });
        Assert.Equal( """ 
                      prefix data: <https://assetid.equinor.com/plantx/document/12345#>

                      data:insideBoundaryX [?node] :- 
                          rdfs:label [?internal, "T4750"],
                          imf:connectedTo [?internal, ?node],
                          dexpi:PipingOrEquipment [?node].
                          
                      data:insideBoundaryX [?node] :- 
                          data:insideBoundaryX [?node1],
                          imf:connectedTo [?node1, ?node],
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#Nozzle-12>),
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#Nozzle-8>),
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#PlateHeatExchanger-1>),
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#ReciprocatingPump-1>),
                          dexpi:PipingOrEquipment [?node].
                      """ , datalog);
    }
}