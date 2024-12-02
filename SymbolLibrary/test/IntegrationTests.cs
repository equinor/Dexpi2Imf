using System.Net;
using DocumentFormat.OpenXml.Drawing.Charts;
using Xunit;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using SymbolLibrary;
using FluentAssertions;

namespace SymbolLibrary.Tests;

public class IntegrationTests : IClassFixture<WebApplicationFactory<TestHook>>
{
    private readonly HttpClient _client;

    public IntegrationTests(WebApplicationFactory<TestHook> factory)
    {
        _client = factory.CreateClient();
    }
    [Fact]
    public async Task TestExistingSymbols()
    {
        // Arrange
        var ID = "PF009A";
        var request = new HttpRequestMessage(HttpMethod.Get, $"/symbols/{ID}");
        
        // Act
        var response = await _client.SendAsync(request);
        
        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var symbol = JsonSerializer.Deserialize<SymbolData>(responseString);
        
    }
    
    [Fact]
    public async Task TestNonExistentSymbol()
    {
        // Arrange
        var ID = "InvalidId";
        var request = new HttpRequestMessage(HttpMethod.Get, $"/symbols/{ID}");
        
        // Act
        var response = await _client.SendAsync(request);
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        
    }
}