namespace Boundaries;


public interface IRdfoxApi
{
    public Task DeleteDatalog( string datalog);

    public Task LoadDatalog(string datalog);

    public Task DeleteData(string data);

    public Task LoadData(string data);

    public Task<string> QuerySparql(string query, string acceptHeader);

    public Task<bool> AskSparql(string query);

}