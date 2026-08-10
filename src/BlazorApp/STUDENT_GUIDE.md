# 📚 STUDENT GUIDE - Blazor Template

Dobrodošli! Ovaj template je pripremljen za razvoj Blazor Server aplikacija koje komuniciraju sa GIT.TransactionIdempotency backend API-jem.

---

## 🎯 ŠTA JE OVO?

Ovo je **kompletna Blazor Server aplikacija** koja uključuje:
- ✅ **MudBlazor UI komponente** - moderne i responsive
- ✅ **Konekciju sa backend API-jem** - već podešeno
- ✅ **OIDC Autentifikaciju** (opciono) - možete je uključiti kasnije
- ✅ **Best practices** - strukturirani kod, Result pattern, error handling

---

## 🚀 BRZI START (3 koraka)

### 1️⃣ Pokrenite backend API
```bash
cd GIT.TransactionIdempotency
dotnet run
```
Backend će biti dostupan na: `https://localhost:7101`

### 2️⃣ Pokrenite Blazor aplikaciju
```bash
cd BlazorApp
dotnet run
```

### 3️⃣ Otvorite browser
Idite na: `https://localhost:5001` (ili port prikazan u terminalu)

---

## 📁 STRUKTURA PROJEKTA

```
BlazorApp/
│
├── Components/              # Blazor komponente
│   ├── Layout/
│   │   └── MainLayout.razor    # Glavni layout (navigacija, header)
│   ├── Pages/
│   │   ├── Home.razor          # Početna stranica (sa API primjerom)
│   │   ├── Counter.razor       # Primjer counter-a
│   │   └── Weather.razor       # Primjer tabele
│   ├── App.razor               # Root komponenta
│   └── Routes.razor            # Routing
│
├── Services/                # Business logika
│   ├── BaseApiService.cs       # Base klasa za API pozive
│   ├── Result.cs               # Result pattern (Success/Failure)
│   └── ExampleService.cs       # ⭐ PRIMJER: Kako napraviti servis
│
├── DTO/                     # Data Transfer Objects
│   └── ExampleDto.cs           # ⭐ PRIMJER: Kako napraviti DTO
│
├── Auth/                    # Autentifikacija (OIDC)
│   └── ...                     # Već podešeno, trenutno isključeno
│
├── IoC/
│   └── DependencyContainer.cs  # ⭐ Dependency Injection registracija
│
├── Shared/                  # 👈 OVDJE DODAJTE VAŠE KOMPONENTE!
│   └── COMPONENTS_README.md    # Upute za komponente
│
└── wwwroot/                 # Statički resursi (CSS, JS, slike)

```

---

## 🛠️ KAKO KREIRATI VLASTITU STRANICU?

### Korak 1: Kreirajte novu Razor stranicu

**Fajl:** `BlazorApp/Components/Pages/MyPage.razor`

```razor
@page "/mypage"
@rendermode InteractiveServer
@inject IExampleService ExampleService

<PageTitle>My Page</PageTitle>

<MudText Typo="Typo.h3">My Awesome Page</MudText>

<MudButton Variant="Variant.Filled" Color="Color.Primary" OnClick="LoadData">
    Load Data
</MudButton>

@if (data != null)
{
    <MudTable Items="@data" Hover="true">
        <HeaderContent>
            <MudTh>ID</MudTh>
            <MudTh>Name</MudTh>
        </HeaderContent>
        <RowTemplate>
            <MudTd>@context.Id</MudTd>
            <MudTd>@context.Name</MudTd>
        </RowTemplate>
    </MudTable>
}

@code {
    private List<ExampleDto>? data;

    private async Task LoadData()
    {
        var result = await ExampleService.GetAllAsync();
        if (result.IsSuccess)
        {
            data = result.Data;
        }
    }
}
```

### Korak 2: Dodajte link u navigaciju

**Fajl:** `BlazorApp/Components/Layout/MainLayout.razor`

Pronađite `<MudNavMenu>` i dodajte:
```razor
<MudNavLink Href="/mypage" Icon="@Icons.Material.Filled.Star">My Page</MudNavLink>
```

---

## 🎨 KAKO KORISTITI MUDBLAZOR?

MudBlazor je UI biblioteka sa pregršt gotovih komponenti:

### Primjer: Button
```razor
<MudButton Variant="Variant.Filled" Color="Color.Primary">Click Me</MudButton>
```

### Primjer: Card
```razor
<MudPaper Elevation="2" Class="pa-4">
    <MudText Typo="Typo.h6">Card Title</MudText>
    <MudText>Card content here...</MudText>
</MudPaper>
```

### Primjer: Dialog
```razor
@inject IDialogService DialogService

<MudButton OnClick="OpenDialog">Open Dialog</MudButton>

@code {
    private void OpenDialog()
    {
        DialogService.Show<MyDialogComponent>("Dialog Title");
    }
}
```

**📚 Dokumentacija:** https://mudblazor.com/components/list

---

## 🔌 KAKO POZVATI BACKEND API?

### Opcija 1: Kreirajte servis (PREPORUČENO)

#### 1. Definirajte DTO
**Fajl:** `BlazorApp/DTO/ProductDto.cs`
```csharp
namespace BlazorApp.DTO;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
```

#### 2. Kreirajte servis interfejs
**Fajl:** `BlazorApp/Services/IProductService.cs`
```csharp
using BlazorApp.DTO;
using DataProductsPortal.Services;

namespace BlazorApp.Services;

public interface IProductService
{
    Task<Result<List<ProductDto>>> GetAllProductsAsync();
    Task<Result<ProductDto>> GetProductByIdAsync(int id);
}
```

#### 3. Implementirajte servis
**Fajl:** `BlazorApp/Services/ProductService.cs`
```csharp
using BlazorApp.DTO;
using DataProductsPortal.Services;

namespace BlazorApp.Services;

public class ProductService : BaseApiService, IProductService
{
    public ProductService(IHttpClientFactory httpClientFactory)
        : base(httpClientFactory, "BackendApi")
    {
    }

    public async Task<Result<List<ProductDto>>> GetAllProductsAsync()
    {
        return await GetListWithResultAsync<ProductDto>("/api/products");
    }

    public async Task<Result<ProductDto>> GetProductByIdAsync(int id)
    {
        return await GetWithResultAsync<ProductDto>($"/api/products/{id}");
    }
}
```

#### 4. Registrujte servis
**Fajl:** `BlazorApp/IoC/DependencyContainer.cs`

U metodi `RegisterService()`, dodajte:
```csharp
services.AddScoped<IProductService, ProductService>();
```

#### 5. Koristite u Razor stranici
```razor
@inject IProductService ProductService

@code {
    private List<ProductDto>? products;

    protected override async Task OnInitializedAsync()
    {
        var result = await ProductService.GetAllProductsAsync();

        if (result.IsSuccess)
        {
            products = result.Data;
        }
        else
        {
            // Handle error
            Console.WriteLine($"Error: {result.ErrorMessage}");
        }
    }
}
```

---

## 📊 RESULT PATTERN

Svi API pozivi vraćaju `Result<T>` objekat:

```csharp
var result = await ProductService.GetProductByIdAsync(5);

if (result.IsSuccess)
{
    var product = result.Data;  // ProductDto
    // ... use product
}
else
{
    var error = result.ErrorMessage;  // "Not found", "Server error", etc.
    var statusCode = result.StatusCode;  // 404, 500, etc.
}
```

### Dostupne metode u BaseApiService:

| Metoda | Opis | Vraća |
|--------|------|-------|
| `GetWithResultAsync<T>()` | GET jedan objekat | `Result<T>` |
| `GetListWithResultAsync<T>()` | GET listu | `Result<List<T>>` |
| `PostWithResultAsync()` | POST bez odgovora | `Result` |
| `PostWithDataResultAsync()` | POST sa odgovorom | `Result<T>` |
| `PutWithResultAsync()` | PUT | `Result` |
| `DeleteWithResultAsync()` | DELETE | `Result` |

---



### Korak 1: Ažurirajte appsettings.json
```json
{
  "OpenIDConnectSettings": {
    "Authority": "https://your-keycloak-server/realms/your-realm",
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret"
  }
}
```

### Korak 2: Odkomentirajte kod u Program.cs
1. Pronađite red `// Keycloak OIDC authentication - COMMENTED OUT`
2. Odkomentirajte **cijeli** blok autentifikacije (~150 linija)
3. Odkomentirajte:
   - `app.UseAuthentication();`
   - `app.UseAuthorization();`
   - `.RequireAuthorization();`

### Korak 3: Koristite autentifikaciju u komponentama
```razor
@attribute [Authorize]

<AuthorizeView>
    <Authorized>
        <MudText>Hello, @context.User.Identity?.Name!</MudText>
    </Authorized>
    <NotAuthorized>
        <MudText>Please log in.</MudText>
    </NotAuthorized>
</AuthorizeView>
```

---

## 🧪 TESTIRANJE

### Pokrenite testove:
```bash
dotnet test
```

---

## 📝 KONFIGURACIJA

### appsettings.json
```json
{
  "BackendApiUri": "https://localhost:7101",  // 👈 Backend API URL
  "OpenIDConnectSettings": {
    "Authority": "https://your-keycloak",     // 👈 Keycloak URL
    "ClientId": "your-client-id",            // 👈 Client ID
    "ClientSecret": "your-client-secret"     // 👈 Client Secret
  }
}
```

---

## ❓ ČESTA PITANJA

### 1. Backend API ne radi?
```bash
cd GIT.TransactionIdempotency
dotnet run
```
Provjerite da li radi na: `https://localhost:7101`

### 2. CORS greška?
Backend mora imati CORS podešen za Blazor app URL (obično `https://localhost:5001`)

### 3. Kako dodati novu stranicu?
1. Kreirajte `.razor` fajl u `Components/Pages/`
2. Dodajte `@page "/url"` na vrh
3. Dodajte link u `MainLayout.razor`

### 4. Gdje dodati CSS?
- Globalni CSS: `wwwroot/css/`
- Scoped CSS: `MyComponent.razor.css` (pored `.razor` fajla)

---

## 🎓 DODATNI RESURSI

- **Blazor Docs:** https://learn.microsoft.com/en-us/aspnet/core/blazor/
- **MudBlazor:** https://mudblazor.com/
- **C# Docs:** https://learn.microsoft.com/en-us/dotnet/csharp/

---

## 🤝 POMOĆ

Ako nešto ne radi:
1. Provjerite da backend API radi
2. Provjerite URL u `appsettings.json`
3. Provjerite konzolu u browseru (F12)
4. Provjerite Output window u Visual Studio

---

