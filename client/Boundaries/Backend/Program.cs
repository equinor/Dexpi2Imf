using Boundaries;
using Backend.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(policyBuilder => policyBuilder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
);
app.UseHttpsRedirection();

// Establish connection to Rdfox
var rdfoxConnectionSettings = RdfoxApi.GetDefaultConnectionSettings();

// Map endpoints
app.MapBoundaryEndpoints(rdfoxConnectionSettings);
app.MapCommissioningPackageEndpoints(rdfoxConnectionSettings);
app.MapGraphicalDataFormatEndpoints();

app.Run();
