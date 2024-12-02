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

The API will be available at http://localhost:5000/symbol/{id]
 
If you run in development mode, f.ex. by 
```bash
ASPNETCORE_ENVIRONMENT=Development dotnet run
```
then a swagger open api is at  http://localhost:5000/swagger/index.html

Individual Jsons can be fetched e.g. by calling http://localhost:5268/api/symbols/PF009A

## Running as docker container
If you have docker desktop or docker engine installed, you can also run with docker from this folder: 
```bash
docker build -t symbollib .
```
```bash
docker run symbollib 
```


