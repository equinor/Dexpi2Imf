using System.Text;

namespace Boundaries;


public class RdfoxApi(ConnectionSettings conn) : IRdfoxApi
{
    /// <summary>
    /// curl -i -X POST localhost:12110/datastores/boundaries/content?operation=delete-content -H "Content-Type: application/x.datalog" -T boundaries.dlog
    /// </summary>
    /// <param name="conn"></param>
    /// <param name="datalog"></param>
    public async Task DeleteDatalog(string datalog)
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
    public async Task LoadDatalog(string datalog)
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
    public  async Task DeleteData(string data)
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
    public  async Task LoadData(string data)
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
    public  async Task<string> QuerySparql(string query)
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

    public  async Task<bool> AskSparql(string query)
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

            return response.IsSuccessStatusCode;
        }
    }

}