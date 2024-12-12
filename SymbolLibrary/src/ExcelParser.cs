using ClosedXML.Excel;
using SymbolLibrary;

public static class ExcelParser{
    public static Dictionary<string, SymbolData> ReadExcelFile(string filePath)
    {
        var symbols = new Dictionary<string, SymbolData>();

        using (XLWorkbook workbook = new XLWorkbook(filePath))
        {
            var worksheet = workbook.Worksheet("Symbols"); // Change to desired worksheet number, name, or index

            // Skipping the first row that contains header data
            foreach (var row in worksheet.RowsUsed().Skip(1))
            {
                if (row.Cell(1).Value.IsBlank)
                    continue;
                var symbolId = row.Cell(1).Value.ToString();
                var description = row.Cell(4).Value.ToString();
                var rowData = new SymbolData()
                {
                    id = symbolId,
                    description = description,
                    labelAttributeA = row.Cell(27).Value.ToString() ?? string.Empty,
                    labelAttributeB = row.Cell(28).Value.ToString() ?? string.Empty,
                    labelAttributeC = row.Cell(29).Value.ToString() ?? string.Empty,
                    labelAttributeD = row.Cell(30).Value.ToString() ?? string.Empty,
                    labelAttributeE = row.Cell(31).Value.ToString() ?? string.Empty
                };
                symbols.Add(symbolId, rowData);
            }

            return symbols;
        }
    }
    
}