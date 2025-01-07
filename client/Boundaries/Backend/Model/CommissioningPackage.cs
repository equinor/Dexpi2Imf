namespace Backend.Model;

public class CommissioningPackage
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Colour { get; set; }
    public List<Node>? CalculatedInternal { get; set; }
    public List<Node>? SelectedInternal { get; set; }
    public List<Node>? Boundary { get; set; }

}
