namespace Backend.Model;

public class Node
{
    public required string Id { get; set; }
    public bool Internal { get; set; }
    public bool Boundary { get; set; }
}
