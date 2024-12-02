using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using SymbolLibrary;

var builder = WebApplication.CreateBuilder(args: args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var symbols = ExcelParser.ReadExcelFile(filePath: "Data/Symbols.xlsm");

app.MapGet(pattern: "/symbol/{id}", (string id) =>
        {
            if (symbols.ContainsKey(id))
            {
                var symbol = symbols[id];
                var symbolString = symbol.ToString();
                var symbolJson = JsonSerializer.Serialize(symbol);
                return Results.Ok(symbol);
            }
            else
                return Results.NotFound();
        }
    )
    .WithName(endpointName: "Symbol")
    .WithOpenApi();
    

app.Run();
