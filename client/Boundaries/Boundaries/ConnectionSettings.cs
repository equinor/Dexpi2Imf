using System.Net.Http.Headers;

namespace Boundaries;

public struct ConnectionSettings
{
    public string Host { get; set; }
    public int Port { get; set; }

    /// <summary>
    /// Name of the dagalog dataset to talk to (the "ds" default, or one created via the
    /// admin API - see docs/user/deployment.md#http-api-reference in the dagalog repo).
    /// </summary>
    public string Dataset { get; set; }

    /// <summary>
    /// Optional static API key (dagalog "Tier 1" auth, started with --api-key). Leave null
    /// or empty when the server runs without authentication (the default, "Tier 0").
    /// </summary>
    public string? ApiKey { get; set; }

    public HttpClient GetAuthenticatedClient()
    {
        var client = new HttpClient();
        if (!string.IsNullOrEmpty(ApiKey))
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
        }
        return client;
    }
 }
