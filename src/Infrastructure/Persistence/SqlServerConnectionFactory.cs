using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace RBBH.CollateralAppraisal.Infrastructure.Persistence;

public static class SqlServerConnectionFactory
{
    public static string? Resolve(IConfiguration configuration)
    {
        var direct = configuration.GetConnectionString("Default");
        if (!string.IsNullOrWhiteSpace(direct)) return direct;
        var server = configuration["COLLATERAL_APPRAISAL_SERVER_NAME"];
        var database = configuration["COLLATERAL_APPRAISAL_DATABASE"];
        if (string.IsNullOrWhiteSpace(server) || string.IsNullOrWhiteSpace(database)) return null;
        var trusted = configuration.GetValue<bool?>("COLLATERAL_APPRAISAL_TRUSTED_CONNECTION") ?? true;
        var builder = new SqlConnectionStringBuilder
        {
            DataSource = server, InitialCatalog = database, IntegratedSecurity = trusted,
            Encrypt = true,
            TrustServerCertificate = configuration.GetValue<bool?>("COLLATERAL_APPRAISAL_TRUST_SERVER_CERTIFICATE") ?? false,
            MultipleActiveResultSets = true, ConnectTimeout = 15,
            ConnectRetryCount = 3, ConnectRetryInterval = 5,
            Pooling = true, MinPoolSize = 5, MaxPoolSize = 100
        };
        if (!trusted) { builder.UserID = configuration["COLLATERAL_APPRAISAL_DB_USER"]; builder.Password = configuration["COLLATERAL_APPRAISAL_DB_PASSWORD"]; }
        return builder.ConnectionString;
    }
}
