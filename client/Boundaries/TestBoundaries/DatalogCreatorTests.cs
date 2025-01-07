namespace TestBoundaries;

public class DatalogCreatorTests
{
    [Fact]
    public void TestCreateDatalog()
    {
        var datalogCreator = new Boundaries.DatalogCreator();
        var graphIri = datalogCreator.BoundaryGraph;
        var datalog = datalogCreator.CreateBoundaryDatalogRule("T4750", new IriTools.IriReference[]
        {
            new IriTools.IriReference("https://assetid.equinor.com/plantx#Nozzle-12"),
            new IriTools.IriReference("https://assetid.equinor.com/plantx#Nozzle-8"),
            new IriTools.IriReference("https://assetid.equinor.com/plantx#PlateHeatExchanger-1"),
            new IriTools.IriReference("https://assetid.equinor.com/plantx#ReciprocatingPump-1")
        });
        Assert.Equal($$""" 

                      <{{graphIri}}> [?node] :- 
                          rdfs:label [?internal, "T4750"],
                          imf:connectedTo [?internal, ?node],
                          dexpi:PipingOrEquipment [?node].
                          
                      <{{graphIri}}> [?node] :- 
                          <{{graphIri}}> [?node1],
                          imf:connectedTo [?node1, ?node],
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#Nozzle-12>),
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#Nozzle-8>),
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#PlateHeatExchanger-1>),
                          NOT FILTER(?node1 = <https://assetid.equinor.com/plantx#ReciprocatingPump-1>),
                          dexpi:PipingOrEquipment [?node].
                      """, datalog);
    }
}