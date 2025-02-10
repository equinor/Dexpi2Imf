using System.Net.Http.Headers;
using System.Text;

namespace Boundaries;

public struct ConnectionSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Datastore { get; set; }
    
    public AuthenticationHeaderValue GetRequestAuthHeader()
    {
        var credentials = $"{Username}:{Password}";
        var base64Credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes(credentials));
        return new AuthenticationHeaderValue("Basic", base64Credentials);
    }
    public HttpClient GetAuthenticatedClient()
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = GetRequestAuthHeader();
        return client;
    }
 }