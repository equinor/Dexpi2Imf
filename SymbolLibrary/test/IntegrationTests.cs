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

    private Task<HttpResponseMessage> GetSymbolId(string symbolId)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"/symbol/{symbolId}");
        request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        
        // Act
        return _client.SendAsync(request);

    }
    
    [Fact]
    public async Task TestExistingSymbols()
    {
        // Act
        var response = await GetSymbolId("PF009A");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var symbol = JsonSerializer.Deserialize<SymbolData>(responseString);
        symbol.id.Should().Be("PF009A");
     }
    
    [Fact]
    public async Task TestNonExistentSymbol()
    {
        // Act
        var response = await GetSymbolId("InvalidId");
        
        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
     }
    
    
    [Fact]
    public async Task TesLabelA()
    {
        // Act
        var response = await GetSymbolId("ND0028");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var symbol = JsonSerializer.Deserialize<SymbolData>(responseString);
        symbol.labelAttributeA.Should().Be("<ObjectDisplayName>");
        symbol.labelAttributeB.Should().Be(String.Empty);
        
    }
    
    
    [Fact]
    public async Task TesLabelB()
    {
        // Act
        var response = await GetSymbolId("ND0009");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var symbol = JsonSerializer.Deserialize<SymbolData>(responseString);
        symbol.labelAttributeB.Should().Be("<ReferencedDrawingDescriptor>");
        
    }
    
    
    [Fact]
    public async Task TesLabelC()
    {
        // Act
        var response = await GetSymbolId("PF009A");
        
        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var symbol = JsonSerializer.Deserialize<SymbolData>(responseString);
        symbol.labelAttributeC.Should().Be("<TagSequence><TagSuffix>");
        
    }
}