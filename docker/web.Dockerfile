FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/BlazorApp/BlazorApp.csproj", "src/BlazorApp/"]

# Override RBI internal NuGet feed with public nuget.org
RUN echo '<?xml version="1.0" encoding="utf-8"?><configuration><packageSources><clear /><add key="nuget.org" value="https://api.nuget.org/v3/index.json" /></packageSources></configuration>' \
    > /src/src/BlazorApp/nuget.config

RUN dotnet restore "src/BlazorApp/BlazorApp.csproj"

COPY . .

# Re-apply override after COPY (COPY overwrites nuget.config)
RUN echo '<?xml version="1.0" encoding="utf-8"?><configuration><packageSources><clear /><add key="nuget.org" value="https://api.nuget.org/v3/index.json" /></packageSources></configuration>' \
    > /src/src/BlazorApp/nuget.config

RUN dotnet publish "src/BlazorApp/BlazorApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BlazorApp.dll"]
