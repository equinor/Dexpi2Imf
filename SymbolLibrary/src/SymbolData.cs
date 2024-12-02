namespace SymbolLibrary;

public struct SymbolData
{
    public SymbolData(String id, String description, String labelA, String labelB, String labelC, String labelD, String labelE)
    {
        
        ID = id;
        Description = description;
        LabelAttributeA = labelA;
        LabelAttributeB = labelB;
        LabelAttributeC = labelC;
        LabelAttributeD = labelD;
        LabelAttributeE = labelE;
        
    }
    
    public string ID;
    public string Description;
    public string LabelAttributeA;
    public string LabelAttributeB;
    public string LabelAttributeC;
    public string LabelAttributeD;
    public string LabelAttributeE;
}