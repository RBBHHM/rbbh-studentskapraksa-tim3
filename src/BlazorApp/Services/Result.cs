namespace BlazorApp.Services;

public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Data { get; init; }
    public string? ErrorMessage { get; init; }
    public int? StatusCode { get; init; }

    public static Result<T> Success(T data) => new() { IsSuccess = true, Data = data };

    public static Result<T> Failure(string error, int? statusCode = null) => new()
    {
        IsSuccess = false,
        ErrorMessage = error,
        StatusCode = statusCode
    };

    public static implicit operator bool(Result<T> result) => result.IsSuccess;
}

public class Result
{
    public bool IsSuccess { get; init; }
    public string? ErrorMessage { get; init; }
    public int? StatusCode { get; init; }

    public static Result Success() => new() { IsSuccess = true };

    public static Result Failure(string error, int? statusCode = null) => new()
    {
        IsSuccess = false,
        ErrorMessage = error,
        StatusCode = statusCode
    };

    public static implicit operator bool(Result result) => result.IsSuccess;
}
