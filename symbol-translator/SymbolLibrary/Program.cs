using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using SymbolLibrary;

var builder = WebApplication.CreateBuilder(args);

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

var symbols = ExcelParser.ParseExcelFile("Data/Symbols.xlsm");

app.MapGet("/symbol/{id}", (string id) =>
    {
        if (symbols.ContainsKey(id))
            return Results.Ok(symbols[id]);
        else 
            return Results.NotFound();
    })
    .WithName("Symbol")
    .WithOpenApi();

app.Run();
