namespace BlazorApp.Models;

public sealed class ImportPreviewResultDto
{
    public string  CodebookType  { get; set; } = "";
    public string  FileName      { get; set; } = "";
    public int     TotalRows     { get; set; }
    public int     NewCount      { get; set; }
    public int     UpdateCount   { get; set; }
    public int     SkipCount     { get; set; }
    public int     ErrorCount    { get; set; }
    public bool    HasErrors     { get; set; }
    public bool    IsValid       { get; set; }
    public string  PreviewToken  { get; set; } = "";
    public List<ImportRowErrorDto> Errors { get; set; } = [];
}

public sealed class ImportRowErrorDto
{
    public int    Row     { get; set; }
    public string Column  { get; set; } = "";
    public string Message { get; set; } = "";
}

public sealed class ImportConfirmRequestDto
{
    public string PreviewToken { get; set; } = "";
}

public sealed class ImportResultDto
{
    public string CodebookType     { get; set; } = "";
    public int    AddedCount       { get; set; }
    public int    UpdatedCount     { get; set; }
    public int    SkippedCount     { get; set; }
    public int    DeactivatedCount { get; set; }
    public string Message          { get; set; } = "";
}
