FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY src/Api/RBBH.CollateralAppraisal.Api.csproj Api/
COPY src/Application/RBBH.CollateralAppraisal.Application.csproj Application/
COPY src/Domain/RBBH.CollateralAppraisal.Domain.csproj Domain/
COPY src/Infrastructure/RBBH.CollateralAppraisal.Infrastructure.csproj Infrastructure/
RUN dotnet restore Api/RBBH.CollateralAppraisal.Api.csproj
COPY src/Api/ Api/
COPY src/Application/ Application/
COPY src/Domain/ Domain/
COPY src/Infrastructure/ Infrastructure/
RUN dotnet publish Api/RBBH.CollateralAppraisal.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .

# Kreiraj storage direktorij koji Docker volume mount koristi.
# Bez ovoga, standalone docker run bez volume monta ne bi imao direktorij
# i FileStorageHealthCheck bi odmah vratio Unhealthy.
RUN mkdir -p /app/storage

# curl treba CD pipeline-u za docker exec health-check (aspnet base image ga nema
# po defaultu) — bez ovoga "docker exec tim3_api curl ..." puca sa "executable not found".
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# OpenShift pokreće container sa proizvoljnim non-root UID-em iz namespacea.
# Grupa 0 zato mora imati ista prava kao vlasnik nad runtime direktorijima.
RUN chgrp -R 0 /app && chmod -R g=u /app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "RBBH.CollateralAppraisal.Api.dll"]
