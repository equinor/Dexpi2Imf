using Backend.Model;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


//Add node as boundary
app.MapPost("/nodes/{nodeId}/boundary", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented..."); 
});

//Add node as internal
app.MapPost("/nodes/{nodeId}internal", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Remove node as boundary
app.MapDelete("/nodes/{nodeId}/boundary", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Remove node as internal 
app.MapDelete("/nodes/{nodeId}/internal", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Get adjacent nodes
app.MapGet("/nodes/{nodeId}/adjacent", (string nodeId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Add commissioning package
app.MapPost("/commissioning-package", (CommissioningPackage commissioningPackage) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Delete commissioning package 
app.MapDelete("/commissioning-package/{commissioningPackageId}", (string commissioningPackageId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});

//Get commissioning package
app.MapGet("/commissioning-package/{commissioningPackageId}", (string commissioningPackageId) =>
{
    throw new NotImplementedException("TODO: Not implemented...");
});


app.Run();
