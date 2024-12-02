# Symbol translator 

This project is a local, temporary workaround while waiting for a proper DISC Symbol library
It reads the Symbol overview from the Excel file [Data/Symbols.xlsm](Data/Symbols.xlsm) and starts a HTTP Api with 
a single endpoint that can be used to read json representations of the lines in that file.

## Pre-requisites
1. DotNet v 8.0 or higher
2. Download the Symbols.xlsm file and place it in the Data folder.
## Usage
```bash
dotnet run
```

The API will be available at http://localhost:5268/swagger/index.html

Individual Jsons can be fetched e.g. by calling http://localhost:5268/api/symbols/PF009A

