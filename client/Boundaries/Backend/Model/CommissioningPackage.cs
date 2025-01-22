namespace Backend.Model;

public class CommissioningPackage
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Color { get; set; }
    public List<Node>? InternalIds { get; set; }
    public List<Node>? SelectedInternalIds { get; set; }
    public List<Node>? BoundaryIds { get; set; }

}
