# .NET Web API Template

This is a comprehensive .NET 10 Web API template designed for building modern, scalable, and maintainable web services. The template follows clean architecture principles and includes industry best practices for API development.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Solution Structure](#solution-structure)
- [Configuration](#configuration)
- [Features](#features)
- [Architecture](#architecture)
- [Testing](#testing)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)

## 🎯 Overview

This template provides a ready-to-use foundation for building .NET Web APIs with the following capabilities:
- RESTful API endpoints with comprehensive Swagger documentation
- Entity Framework Core integration with SQL Server
- JWT Authentication support
- Global exception handling with ProblemDetails
- Structured logging with Serilog
- Health checks for monitoring
- Metrics and monitoring with Prometheus
- CORS configuration
- Unit and Integration testing setup
- ActiveMQ message broker integration

## 📦 Prerequisites

Before using this template, ensure you have:

- **.NET 10 SDK** or later installed
- **Visual Studio 2026** (18.5.0 or later) or **Visual Studio Code**
- **SQL Server** (for database connectivity) - In your case PostgreSQL
- **Git** for version control
- **Docker** (optional, for containerized deployment)

## 🚀 Getting Started

### 1. Clone or Use the Template

```powershell
# Clone the repository
git clone <repository-url>
cd <solution-directory>
```

### 2. Configure Environment Variables

Create a `.env` file in the `GIT.TransactionIdempotency` project directory based on your database configuration:

```env
# Transaction Idempotency Database
TRANIDEMPOTENCY_SERVER_NAME=your_server_name
TRANIDEMPOTENCY_DATABASE=your_database_name
TRANIDEMPOTENCY_DB_USER=your_username
TRANIDEMPOTENCY_DB_PASSWORD=your_password

# IBIS Database (if using)
IBIS_SERVER_NAME=your_server_name
IBIS_DATABASE=your_database_name
IBIS_DB_USER=your_username
IBIS_DB_PASSWORD=your_password
```

### 3. Configure Application Settings

Review and update `appsettings.json` file with your specific configuration:
- Database connection strings
- JWT authentication settings
- Logging configuration
- Health check endpoints
- HTTP client configurations

### 4. Restore Dependencies

```powershell
dotnet restore
```

### 5. Build the Solution

```powershell
dotnet build
```

### 6. Run the Application

```powershell
dotnet run --project GIT.TransactionIdempotency
```

The API will start and Swagger UI will be available at: `https://localhost:<port>/` (non-production environments only)

## 📁 Solution Structure

The solution is organized into three main projects:

### **GIT.TransactionIdempotency** (Main API Project)

The main Web API project following a layered architecture:

```
GIT.TransactionIdempotency/
├── API/
│   └── Controllers/          # API Controllers
│       ├── BaseController/   # Base controller classes
│       ├── TransactionsController.cs
│       ├── WeatherForecastController.cs
│       └── ResultExamplesController.cs
├── BL/                       # Business Logic Layer
│   ├── Services/             # Service implementations
│   └── ServiceInterfaces/    # Service interfaces
├── DL/                       # Data Layer
│   ├── Entities/             # Database entities
│   │   └── TranIdempotency/  # Entity Framework contexts
│   ├── DTO/                  # Data Transfer Objects
│   ├── Models/               # Domain models
│   └── Mapper/               # Object mapping configuration (Mapster)
├── IoC/                      # Inversion of Control
│   ├── Extensions/           # Service extension methods
│   │   ├── Authentication/   # JWT authentication setup
│   │   ├── CORS/             # CORS configuration
│   │   ├── Controllers/      # Controllers configuration
│   │   ├── Databases/        # Database context setup
│   │   ├── Environment/      # Environment utilities
│   │   ├── ExceptionHandling/ # Global error handling
│   │   ├── Health/           # Health checks
│   │   ├── HTTP/             # HTTP clients & header propagation
│   │   ├── HTTPMetricsExtension/ # Metrics collection
│   │   ├── Logging/          # Serilog configuration
│   │   ├── Security/         # Security headers & CSP
│   │   └── Swagger/          # Swagger/OpenAPI setup
│   ├── Middleware/           # Custom middleware
│   │   └── IncludeCorrelationIDMiddleware.cs
│   └── DependencyContainer.cs # Main DI container
├── Exceptions/               # Exception handling
│   ├── Custom/               # Custom exception types
│   ├── Validations/          # Validation result pattern
│   └── GlobalExceptionHandler.cs
├── Helpers/                  # Utility classes
│   ├── Constants/            # Application constants
│   └── Utils/                # Helper methods
├── Program.cs                # Application entry point
└── appsettings.json          # Application configuration
```

### **UnitTests**

Contains unit tests for individual components:
- Service layer tests
- Helper method tests
- Middleware tests
- Extension method tests
- Controller tests

Uses:
- **xUnit** as the testing framework
- **NSubstitute** for mocking
- **FluentAssertions** for readable assertions

### **IntegrationTests**

Contains integration tests for API endpoints:
- End-to-end API testing
- `ApplicationFactory` for test server setup
- Mock implementations for external dependencies

## ⚙️ Configuration

### Environment Variables (.env file)

The application uses the `dotenv.net` library to load environment variables from a `.env` file. This file should contain:
- Database connection parameters
- Sensitive configuration data
- Environment-specific settings

**Important:** Never commit the `.env` file to version control. Use `.env.example` or `.env.template` for reference.

### appsettings.json

Configure application behavior in `appsettings.json`:
- **Logging levels** for different namespaces
- **Connection strings** (can reference environment variables)
- **JWT settings** (issuer, audience, secret key)
- **Health check endpoints**
- **HTTP client configurations**
- **Serilog sinks** (Console, Splunk, Elasticsearch)

### Conditional Compilation Symbols

The template uses preprocessor directives for different project types:
- `#if (IsAPI)` - API-specific features (CORS, etc.)
- `#if (IsSVC)` - Service-specific features (Database, etc.)
- `#if (!IsClean)` - Full-featured version with examples

## ✨ Features

### 1. **API Documentation (Swagger/OpenAPI)**
- Automatic API documentation generation
- Interactive Swagger UI (available in non-production environments)
- XML documentation comments support
- Custom operation filters

### 2. **Authentication & Authorization**
- JWT Bearer token authentication
- Configurable authentication schemes
- Protected endpoints with `[Authorize]` attribute

### 3. **Global Exception Handling**
- Centralized exception handling using `IExceptionHandler`
- RFC 7807 ProblemDetails responses
- Custom exception types (`ValidationError`, `NotFoundError`, `InternalServerError`)
- Automatic status code mapping

### 4. **Result Pattern**
- `Result<T>` type for operation outcomes
- Clear success/failure handling
- Validation error support
- Used in service layer for robust error handling

### 5. **Logging**
- Structured logging with **Serilog**
- Multiple sinks: Console, Debug, Splunk, Elasticsearch
- Request/Response logging
- Correlation ID tracking across requests
- Header enrichment

### 6. **Health Checks**
- Self health check endpoint
- Database connectivity checks
- Custom health check endpoints
- Integration with monitoring systems

### 7. **Metrics & Monitoring**
- Prometheus metrics collection
- HTTP request metrics
- Custom application metrics
- OpenTelemetry integration

### 8. **Security**
- Content Security Policy (CSP) configuration
- Security headers
- HTTPS redirection
- CORS policy management

### 9. **Correlation ID**
- Automatic correlation ID generation
- Correlation ID propagation across services
- Included in logs and responses

### 10. **Database Integration**
- Entity Framework Core with SQL Server
- Multiple database context support
- Connection string management via environment variables
- Database health checks

### 11. **HTTP Clients**
- Typed HTTP clients with dependency injection
- Header propagation (correlation IDs, auth tokens)
- Resilience and retry policies
- Custom message handlers

### 12. **Object Mapping**
- **Mapster** for high-performance object mapping
- Centralized mapping configuration
- DTO to Entity mappings

### 13. **Message Broker (ActiveMQ)**
- Apache ActiveMQ integration
- Message publishing and consumption
- Configurable broker settings

## 🏗️ Architecture

### Layered Architecture

The template follows a clean, layered architecture:

1. **API Layer** (`API/`)
   - Controllers that handle HTTP requests
   - Input validation
   - Response formatting

2. **Business Logic Layer** (`BL/`)
   - Business rules and logic
   - Service interfaces and implementations
   - Domain operations

3. **Data Layer** (`DL/`)
   - Database entities
   - Data Transfer Objects (DTOs)
   - Entity Framework contexts
   - Data access logic

4. **Cross-Cutting Concerns** (`IoC/`, `Helpers/`, `Exceptions/`)
   - Dependency injection configuration
   - Middleware
   - Exception handling
   - Utilities and helpers

### Dependency Injection

All dependencies are registered in `DependencyContainer.cs`:
```csharp
services
    .AddControllersExtension()
    .AddExceptionHandlingExtension(env)
    .AddHealthCheckExtension(configuration)
    .AddSwaggerExtension()
    .AddAuthenticationExtension(configuration)
    .AddDatabaseExtension(configuration)
    .AddHTTPExtension(configuration);
```

Each extension method encapsulates specific service registrations for better organization.

### Request Pipeline

The request pipeline in `Program.cs` is configured as follows:
1. Load environment variables
2. Configure services
3. Apply middleware (Correlation ID, Exception handling)
4. Configure security (CSP, HTTPS)
5. Add metrics collection
6. Map health check endpoints
7. Enable CORS (for API projects)
8. Map controllers

## 🧪 Testing

### Running Unit Tests

```powershell
dotnet test UnitTests/UnitTests.csproj
```

Unit tests are organized by:
- **Services**: Business logic testing
- **Controllers**: API controller testing
- **Helpers**: Utility method testing
- **Middleware**: Middleware behavior testing
- **Extensions**: Extension method testing

### Running Integration Tests

```powershell
dotnet test IntegrationTests/IntegrationTests.csproj
```

Integration tests use `WebApplicationFactory<Program>` to create a test server and test actual HTTP endpoints.

### Writing Tests

**Unit Test Example:**
```csharp
[Fact]
public async Task GetTransactionByID_ValidID_ReturnsTransaction()
{
    // Arrange
    var mockContext = CreateMockDbContext();
    var service = new TransactionsService(mockContext);

    // Act
    var result = await service.GetTransactionByID(1);

    // Assert
    result.IsSuccessful.Should().BeTrue();
}
```

**Integration Test Example:**
```csharp
[Fact]
public async Task GetWeatherForecast_ReturnsSuccess()
{
    // Arrange
    var client = _factory.CreateClient();

    // Act
    var response = await client.GetAsync("/api/weatherforecast");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);
}
```

## 📝 Development Guidelines

### Creating a New Controller

1. Create controller in `API/Controllers/`
2. Inherit from `BaseResuItController` or `ControllerBase`
3. Add route attribute `[Route("api/[controller]")]`
4. Document with XML comments for Swagger
5. Use dependency injection for services

```csharp
[ApiController]
[Route("api/[controller]")]
public class MyController(IMyService myService) : BaseResuItController
{
    private readonly IMyService _myService = myService;

    [HttpGet]
    [ProducesResponseType(typeof(MyDTO), StatusCodes.Status200OK)]
    public async Task<ActionResult<MyDTO>> Get()
    {
        var result = await _myService.GetData();
        return result.IsSuccessful ? Ok(result.Value) : HTTPExceptiontFromResult(result);
    }
}
```

### Creating a New Service

1. Define interface in `BL/ServiceInterfaces/`
2. Implement in `BL/Services/`
3. Register in `DependencyContainer.cs`
4. Use `Result<T>` pattern for operations that can fail

```csharp
// Interface
public interface IMyService
{
    Task<Result<MyDTO>> GetData();
}

// Implementation
public class MyService : IMyService
{
    public async Task<Result<MyDTO>> GetData()
    {
        try
        {
            // Business logic here
            return Result<MyDTO>.Success(data);
        }
        catch (Exception ex)
        {
            return Result<MyDTO>.Failure("Error message");
        }
    }
}

// Registration in DependencyContainer.cs
services.AddScoped<IMyService, MyService>();
```

### Adding a New Database Entity

1. Create entity class in `DL/Entities/`
2. Add DbSet to your DbContext
3. Configure mapping (if needed)
4. Create and apply migration

```powershell
# Create migration
dotnet ef migrations add AddMyEntity --project GIT.TransactionIdempotency

# Update database
dotnet ef database update --project GIT.TransactionIdempotency
```

### Creating DTOs

1. Create DTO in `DL/DTO/`
2. Configure Mapster mapping in `MapsterConfiguration.cs` if needed

```csharp
public class MyDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

### Custom Exception Handling

Create custom exceptions by inheriting from base exception types:

```csharp
public class MyCustomException : Exception
{
    public MyCustomException(string message) : base(message) { }
}
```

Map to HTTP status codes in `ExceptionToStatusCodeHelper.cs`.

## 🚀 Deployment

### Prerequisites for Deployment

- Target server with .NET 10 runtime
- SQL Server instance accessible from application
- Environment variables configured
- SSL certificate for HTTPS (production)

### Publishing the Application

```powershell
# Publish for production
dotnet publish GIT.TransactionIdempotency/GIT.TransactionIdempotency.csproj -c Release -o ./publish

# The published files will be in ./publish directory
```

### Environment-Specific Configuration

Use different `appsettings.{Environment}.json` files:
- `appsettings.Development.json`
- `appsettings.Staging.json`
- `appsettings.Production.json`

Set the `ASPNETCORE_ENVIRONMENT` environment variable on the target server.

### Docker Deployment (Optional)

If you create a Dockerfile, you can containerize the application:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GIT.TransactionIdempotency.dll"]
```

## 📚 Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [Serilog Documentation](https://serilog.net/)
- [Mapster Documentation](https://github.com/MapsterMapper/Mapster)
- [xUnit Documentation](https://xunit.net/)

## 🤝 Contributing

When contributing to this template:
1. Follow the existing code structure and patterns
2. Write unit tests for new functionality
3. Update documentation as needed
4. Follow C# coding conventions
5. Ensure all tests pass before submitting changes

## 📄 License

[Specify your license here]

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Refer to the internal documentation

---

**Happy Coding! 🎉**
