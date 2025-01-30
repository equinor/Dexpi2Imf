namespace Backend.Model;

public class CommissioningPackage
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Color { get; set; }
    public List<Node>? InternalNodes { get; set; }
    public List<Node>? SelectedInternalNodes { get; set; }
    public List<Node>? BoundaryNodes { get; set; }

}
