using Boundaries;
using Backend.Endpoints;
using System.Text;
using Backend.Utils;
using System.Text.Json;
using Backend.Model;
using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.AddSingleton<IRdfoxApi>(sp =>
{
    var connectionSettings = new ConnectionSettings
    {
        Host = "rdfox",
        Port = 12110,
        Username = "admin",
        Password = "admin",
        Datastore = "boundaries"
    };

    return new RdfoxApi(connectionSettings);
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(policyBuilder => policyBuilder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);
app.UseHttpsRedirection();

app.MapBoundaryEndpoints();
app.MapCommissioningPackageEndpoints();
app.MapGraphicalDataFormatEndpoints();

app.Run();


// Necessary for integration testing
public partial class Program { }