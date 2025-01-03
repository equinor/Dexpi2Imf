namespace Backend.Model;

public class CommissioningPackage
{
    public required string Id { get; set; }
    public required string Colour { get; set; }
    public List<Node>? Nodes { get; set; }
}
