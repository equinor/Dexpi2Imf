namespace Backend.Model;

public enum NodeType
{
    None,
    Internal,
    Boundary
}
public class Node
{
    public required string Id { get; set; }
    public required NodeType Type { get; set; }
}
