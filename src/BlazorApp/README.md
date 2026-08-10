# 🚀 Blazor Template Application

Clean Blazor Server template connected to GIT.TransactionIdempotency backend API.

> 📖 **NEW TO THIS TEMPLATE?** Start here: **[INDEX.md](INDEX.md)** - Complete documentation index

---

## 📚 Quick Documentation Links

- **⚡ [QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **🎓 [STUDENT_GUIDE.md](STUDENT_GUIDE.md)** - Complete guide for students (2000+ lines)
- **📝 [TODO.md](TODO.md)** - First assignments and exercises
- **🔧 [CONFIG_GUIDE.md](CONFIG_GUIDE.md)** - Configuration guide
- **📋 [CHANGELOG.md](CHANGELOG.md)** - List of changes
- **📊 [CLEANING_SUMMARY.md](CLEANING_SUMMARY.md)** - What was cleaned and why

---

## 📋 Prerequisites

- .NET 10 SDK
- Visual Studio 2026 or later
- Running instance of GIT.TransactionIdempotency API (default: https://localhost:7101)

## 🏗️ Project Structure

```
BlazorApp/
├── Components/
│   ├── Layout/
│   │   └── MainLayout.razor          # Main application layout with MudBlazor
│   ├── Pages/
│   │   ├── Home.razor                # Home page with API connection example
│   │   ├── Counter.razor             # Simple counter demo
│   │   └── Weather.razor             # Weather forecast demo
│   ├── App.razor                     # Root component
│   └── Routes.razor                  # Routing configuration
├── Auth/                             # Authentication utilities (OIDC)
├── IoC/
│   └── DependencyContainer.cs        # Dependency injection setup
├── Middlewares/
│   └── RequestMessageHandler.cs      # HTTP request middleware
├── Services/
│   ├── BaseApiService.cs             # Base service for API calls
│   └── Result.cs                     # Result wrapper pattern
└── Program.cs                        # Application startup

```

## 🔧 Configuration

### appsettings.json

```json
{
  "BackendApiUri": "https://localhost:7101",
  "OpenIDConnectSettings": {
    "Authority": "https://your-keycloak-server/realms/your-realm",
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret"
  }
}
```

**Update these values:**
- `BackendApiUri`: Your backend API URL
- `Authority`: Your Keycloak/OIDC server
- `ClientId` & `ClientSecret`: Your OIDC credentials

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone

### 2. Restore dependencies
```bash
dotnet restore
```

### 3. Update configuration
Edit `appsettings.json` and set your backend API URL and OIDC settings.

### 4. Run the application
```bash
dotnet run
```

Navigate to: `https://localhost:5001` (or port shown in console)

## 🔐 Authentication (Optional)

Authentication is **currently disabled** for easier development. To enable:

### In `Program.cs`, uncomment:
1. Authentication configuration section (lines ~35-180)
2. `app.UseAuthentication()` (line ~230)
3. `app.UseAuthorization()` (line ~231)
4. `.RequireAuthorization()` in routing (line ~236)

### Configure Keycloak:
1. Update `appsettings.json` with your Keycloak details
2. Ensure backend API is configured for OIDC
3. Test login flow

## 📡 Backend API Integration

### HttpClient is pre-configured:

```csharp
@inject IHttpClientFactory HttpClientFactory

var client = HttpClientFactory.CreateClient("BackendApi");
var response = await client.GetAsync("/your-endpoint");
```

### Example in Home.razor:
The home page includes a working example of calling the backend health check endpoint.

## 🎨 UI Components (MudBlazor)

This template uses **MudBlazor** for UI components:
- [Documentation](https://mudblazor.com/)
- [Component Gallery](https://mudblazor.com/components/list)

### Example usage:
```razor
<MudButton Variant="Variant.Filled" Color="Color.Primary">
    Click Me
</MudButton>

<MudTable Items="@items" Hover="true">
    <HeaderContent>
        <MudTh>Column 1</MudTh>
    </HeaderContent>
    <RowTemplate>
        <MudTd>@context.Value</MudTd>
    </RowTemplate>
</MudTable>
```

## 📝 Creating Your Own Services

### 1. Create a service interface:
```csharp
public interface IYourService
{
    Task<Result<YourModel>> GetDataAsync();
}
```

### 2. Implement the service:
```csharp
public class YourService : BaseApiService, IYourService
{
    public YourService(IHttpClientFactory httpClientFactory, ILogger<YourService> logger)
        : base(httpClientFactory, logger)
    {
    }

    public async Task<Result<YourModel>> GetDataAsync()
    {
        return await GetAsync<YourModel>("/api/your-endpoint");
    }
}
```

### 3. Register in DependencyContainer.cs:
```csharp
services.AddScoped<IYourService, YourService>();
```

### 4. Inject in Razor component:
```razor
@inject IYourService YourService

@code {
    private async Task LoadData()
    {
        var result = await YourService.GetDataAsync();
        if (result.IsSuccess)
        {
            // Use result.Data
        }
    }
}
```

## 🧪 Testing

### Run tests:
```bash
dotnet test
```

## 📦 Included Packages

- **MudBlazor** - Material Design components
- **Serilog** - Logging
- **Microsoft.AspNetCore.Authentication.OpenIdConnect** - OIDC auth (optional)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📚 Additional Resources

- [Blazor Documentation](https://learn.microsoft.com/en-us/aspnet/core/blazor/)
- [MudBlazor Components](https://mudblazor.com/)
- [OIDC with Blazor](https://learn.microsoft.com/en-us/aspnet/core/blazor/security/)

## ❓ Common Issues

### API Connection Failed
- Ensure backend API is running
- Check `BackendApiUri` in appsettings.json
- Verify CORS settings on backend

### Authentication Issues
- Verify Keycloak is running and accessible
- Check OIDC settings in appsettings.json
- Review browser console and application logs

## 📄 License

Internal use only - Raiffeisen Bank Bosnia and Herzegovina

---

**Happy Coding! 🎉**
