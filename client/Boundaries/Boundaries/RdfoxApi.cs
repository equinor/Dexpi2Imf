using System.Text;
using IriTools;

namespace Boundaries;


public class RdfoxApi
{
    public struct ConnectionSettings
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Datastore { get; set; }

    }

    public static ConnectionSettings GetDefaultConnectionSettings()
    {
        return new ConnectionSettings
        {
            Host = "localhost",
            Port = 12110,
            Username = "admin",
            Password = "admin",
            Datastore = "boundaries"
        };
    }


    /// <summary>
    /// curl -i -X POST localhost:12110/datastores/boundaries/content?operation=delete-content -H "Content-Type: application/x.datalog" -T boundaries.dlog
    /// </summary>
    /// <param name="conn"></param>
    /// <param name="datalog"></param>
    public static async Task DeleteDatalog(ConnectionSettings conn, string datalog)
    {
        using (var client = new HttpClient())
        {
            var uri = new Uri($"http://{conn.Host}:{conn.Port}/datastores/{conn.Datastore}/content?operation=delete-content");
            var content = new StringContent(datalog, Encoding.UTF8, "application/x.datalog");

            var request = new HttpRequestMessage(HttpMethod.Patch, uri)
            {
                Content = content
            };

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }

    /// <summary>
    /// curl -i -X POST localhost:12110/datastores/boundaries/content -H "Content-Type: application/x.datalog" -T boundaries.dlog
    /// </summary>
    /// <param name="conn"></param>
    /// <param name="datalog"></param>
    public static async Task LoadDatalog(ConnectionSettings conn, string datalog)
    {
        using (var client = new HttpClient())
        {
            var uri = new Uri($"http://{conn.Host}:{conn.Port}/datastores/{conn.Datastore}/content");
            var content = new StringContent(datalog, Encoding.UTF8, "application/x.datalog");

            var request = new HttpRequestMessage(HttpMethod.Post, uri)
            {
                Content = content
            };


            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }

    /// <summary>
    /// curl -i -X PATCH localhost:12110/datastores/boundaries/content?operation=delete-content -H "Content-Type: application/trig" -T boundaries.dlog
    /// </summary>
    /// <param name="conn"></param>
    /// <param name="datalog"></param>
    public static async Task DeleteData(ConnectionSettings conn, string data)
    {
        using (var client = new HttpClient())
        {
            var uri = new Uri($"http://{conn.Host}:{conn.Port}/datastores/{conn.Datastore}/content?operation=delete-content");
            var content = new StringContent(data, Encoding.UTF8, "application/trig");

            var request = new HttpRequestMessage(HttpMethod.Patch, uri)
            {
                Content = content
            };


            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }

    /// <summary>
    /// curl -i -X POST localhost:12110/datastores/boundaries/content -H "Content-Type: application/trig" -T boundaries.dlog
    /// </summary>
    /// <param name="conn"></param>
    /// <param name="datalog"></param>
    public static async Task LoadData(ConnectionSettings conn, string data)
    {
        using (var client = new HttpClient())
        {
            var uri = new Uri($"http://{conn.Host}:{conn.Port}/datastores/{conn.Datastore}/content");
            var content = new StringContent(data, Encoding.UTF8, "application/trig");

            var request = new HttpRequestMessage(HttpMethod.Post, uri)
            {
                Content = content
            };


            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }

    /// <summary>
    /// curl -i -X POST localhost:12110/datastores/boundaries/sparql -H "Accept: application/x.sparql-results+turtle-abbrev" -d "query=SELECT ?S ?P ?O WHERE { ?S ?P ?O }"
    /// </summary>
    /// <param name="conn"></param>
    /// <param name="query"></param>
    /// <returns></returns>
    public static async Task<string> QuerySparql(ConnectionSettings conn, string query)
    {
        using (var client = new HttpClient())
        {
            var uri = new Uri($"http://{conn.Host}:{conn.Port}/datastores/{conn.Datastore}/sparql");
            var content = new StringContent(query, Encoding.UTF8, "application/sparql-query");

            var request = new HttpRequestMessage(HttpMethod.Post, uri)
            {
                Content = content
            };

            var response = await client.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                throw new Exception(await response.Content.ReadAsStringAsync());
            return await response.Content.ReadAsStringAsync();
        }
    }

}