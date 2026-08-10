using System.Net.Http.Json;
using System.Text.Json;
using BlazorApp.Constants;

namespace BlazorApp.Services;

public abstract class BaseApiService
{
    protected static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly HttpClient _httpClient;
    private readonly ILogger _logger;
    private readonly ActiveRoleState? _activeRoleState;

    protected BaseApiService(
        IHttpClientFactory httpClientFactory,
        ILogger logger,
        string clientName = "BackendApi",
        ActiveRoleState? activeRoleState = null)
    {
        _httpClient = httpClientFactory.CreateClient(clientName);
        _logger = logger;
        _activeRoleState = activeRoleState;
    }

    /// <summary>
    /// Šalje aktivnu rolu (ActiveRoleState.ActiveRole) kao X-Active-Role header na svaki
    /// zahtjev — čisto informativno, za audit log (vidi AuditService.ResolveActiveRole na
    /// backend-u). Korisnik sa jednom rolom: isto kao i ActorRole, nema efekta. Korisnik sa
    /// više rola: backend zna POD KOJOM rolom je akcija stvarno izvršena, ne samo prvu iz tokena.
    /// </summary>
    private void ApplyActiveRoleHeader()
    {
        _httpClient.DefaultRequestHeaders.Remove(HttpHeaderNames.ActiveRole);
        if (!string.IsNullOrWhiteSpace(_activeRoleState?.ActiveRole))
            _httpClient.DefaultRequestHeaders.Add(HttpHeaderNames.ActiveRole, _activeRoleState.ActiveRole);
    }

    protected HttpClient Http
    {
        get
        {
            ApplyActiveRoleHeader();
            return _httpClient;
        }
    }

    private static string ParseErrorDetail(string errorContent)
    {
        try
        {
            var problem = JsonSerializer.Deserialize<Dictionary<string, object>>(errorContent, JsonOptions);
            return problem?.GetValueOrDefault("detail")?.ToString() ?? errorContent;
        }
        catch
        {
            return errorContent;
        }
    }

    protected async Task<Result<T>> GetWithResultAsync<T>(string endpoint) where T : class
    {
        try
        {
            var response = await Http.GetAsync(endpoint);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("GET {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result<T>.Failure(detail, (int)response.StatusCode);
            }
            var data = await response.Content.ReadFromJsonAsync<T>(JsonOptions);
            return data != null ? Result<T>.Success(data) : Result<T>.Failure("Prazan odgovor od servera");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET {Endpoint} threw exception", endpoint);
            return Result<T>.Failure(ex.Message);
        }
    }

    protected async Task<Result<List<T>>> GetListWithResultAsync<T>(string endpoint) where T : class
    {
        try
        {
            var response = await Http.GetAsync(endpoint);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("GET {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result<List<T>>.Failure(detail, (int)response.StatusCode);
            }
            var result = await response.Content.ReadFromJsonAsync<IEnumerable<T>>(JsonOptions);
            return Result<List<T>>.Success(result?.ToList() ?? []);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET {Endpoint} threw exception", endpoint);
            return Result<List<T>>.Failure(ex.Message);
        }
    }

    protected async Task<Result> PostWithResultAsync<TRequest>(string endpoint, TRequest data) where TRequest : class
    {
        try
        {
            var response = await Http.PostAsJsonAsync(endpoint, data);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("POST {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result.Failure(detail, (int)response.StatusCode);
            }
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "POST {Endpoint} threw exception", endpoint);
            return Result.Failure(ex.Message);
        }
    }

    protected async Task<Result<TResponse>> PostWithDataResultAsync<TRequest, TResponse>(string endpoint, TRequest data)
        where TRequest : class
        where TResponse : class
    {
        try
        {
            var response = await Http.PostAsJsonAsync(endpoint, data);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("POST {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result<TResponse>.Failure(detail, (int)response.StatusCode);
            }
            var result = await response.Content.ReadFromJsonAsync<TResponse>(JsonOptions);
            return result != null ? Result<TResponse>.Success(result) : Result<TResponse>.Failure("Prazan odgovor od servera");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "POST {Endpoint} threw exception", endpoint);
            return Result<TResponse>.Failure(ex.Message);
        }
    }

    protected async Task<Result<TResponse>> PostMultipartWithResultAsync<TResponse>(
        string endpoint, MultipartFormDataContent content) where TResponse : class
    {
        try
        {
            var response = await Http.PostAsync(endpoint, content);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("POST multipart {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result<TResponse>.Failure(detail, (int)response.StatusCode);
            }
            var result = await response.Content.ReadFromJsonAsync<TResponse>(JsonOptions);
            return result != null ? Result<TResponse>.Success(result) : Result<TResponse>.Failure("Prazan odgovor od servera");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "POST multipart {Endpoint} threw exception", endpoint);
            return Result<TResponse>.Failure(ex.Message);
        }
    }

    protected async Task<Result> PutWithResultAsync<TRequest>(string endpoint, TRequest data) where TRequest : class
    {
        try
        {
            var response = await Http.PutAsJsonAsync(endpoint, data);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("PUT {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result.Failure(detail, (int)response.StatusCode);
            }
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PUT {Endpoint} threw exception", endpoint);
            return Result.Failure(ex.Message);
        }
    }

    protected async Task<Result<TResponse>> PutWithDataResultAsync<TRequest, TResponse>(string endpoint, TRequest data)
        where TRequest : class
        where TResponse : class
    {
        try
        {
            var response = await Http.PutAsJsonAsync(endpoint, data);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("PUT {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result<TResponse>.Failure(detail, (int)response.StatusCode);
            }
            var result = await response.Content.ReadFromJsonAsync<TResponse>(JsonOptions);
            return result != null ? Result<TResponse>.Success(result) : Result<TResponse>.Failure("Prazan odgovor od servera");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PUT {Endpoint} threw exception", endpoint);
            return Result<TResponse>.Failure(ex.Message);
        }
    }

    protected async Task<Result<TResponse>> PatchWithResultAsync<TRequest, TResponse>(string endpoint, TRequest data)
        where TRequest : class
        where TResponse : class
    {
        try
        {
            var request = new HttpRequestMessage(new HttpMethod("PATCH"), endpoint)
            {
                Content = JsonContent.Create(data)
            };
            var response = await Http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("PATCH {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result<TResponse>.Failure(detail, (int)response.StatusCode);
            }
            var result = await response.Content.ReadFromJsonAsync<TResponse>(JsonOptions);
            return result != null ? Result<TResponse>.Success(result) : Result<TResponse>.Failure("Prazan odgovor od servera");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PATCH {Endpoint} threw exception", endpoint);
            return Result<TResponse>.Failure(ex.Message);
        }
    }

    protected async Task<Result> DeleteWithResultAsync(string endpoint)
    {
        try
        {
            var response = await Http.DeleteAsync(endpoint);
            if (!response.IsSuccessStatusCode)
            {
                var detail = ParseErrorDetail(await response.Content.ReadAsStringAsync());
                _logger.LogWarning("DELETE {Endpoint} failed {StatusCode}: {Detail}", endpoint, response.StatusCode, detail);
                return Result.Failure(detail, (int)response.StatusCode);
            }
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "DELETE {Endpoint} threw exception", endpoint);
            return Result.Failure(ex.Message);
        }
    }
}
