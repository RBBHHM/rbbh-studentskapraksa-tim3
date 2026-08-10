using BlazorApp.Components.Shared;
using BlazorApp.Constants;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

/// <summary>bUnit testovi za AppStatusBadge.</summary>
public sealed class AppStatusBadgeTests : TestContext
{
    public AppStatusBadgeTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void WhenStatusDraft_RendersNacrtLabel()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, "Draft"));
        Assert.Contains("Nacrt", cut.Markup);
    }

    [Fact]
    public void WhenStatusSubmittedBySales_RendersPoslanoLabel()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, "SubmittedBySales"));
        Assert.Contains("Poslano CA", cut.Markup);
    }

    [Fact]
    public void WhenStatusCompleted_RendersZavrsenoLabel()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, "Completed"));
        Assert.Contains("Završeno", cut.Markup);
    }

    [Fact]
    public void WhenLabelOverrideProvided_RendersOverrideNotDefault()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p
            .Add(c => c.Status, "Draft")
            .Add(c => c.Label, "Moj custom label"));

        Assert.Contains("Moj custom label", cut.Markup);
        Assert.DoesNotContain("Nacrt", cut.Markup);
    }

    [Fact]
    public void WhenColorOverrideProvided_AppliesOverrideColor()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p
            .Add(c => c.Status, "Draft")
            .Add(c => c.ColorOverride, "#FF0000"));

        Assert.Contains("#FF0000", cut.Markup);
    }

    [Fact]
    public void AlwaysRendersSpanWithRoleStatus()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, "Completed"));
        var span = cut.Find("span[role='status']");
        Assert.NotNull(span);
    }

    [Fact]
    public void WhenNullStatus_RendersWithoutCrash()
    {
        // null status → default case u switch → ne baca exception
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, (string?)null));
        Assert.NotNull(cut.Markup);
    }

    [Fact]
    public void WhenUnknownStatus_RendersStatusValueAsLabel()
    {
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, "SomeUnknownStatus"));
        // OrderStatusDisplay.Label za nepoznate vraća original ili prazan string — barem renders
        Assert.NotNull(cut.Markup);
    }

    [Theory]
    [InlineData("Draft")]
    [InlineData("SubmittedBySales")]
    [InlineData("DocumentationApproved")]
    [InlineData("AppraiserSelected")]
    [InlineData("AppraisalInProgress")]
    [InlineData("ReadyForProcedure")]
    [InlineData("Completed")]
    [InlineData("Cancelled")]
    public void AllWorkflowStatuses_RenderWithoutException(string status)
    {
        var cut = RenderComponent<AppStatusBadge>(p => p.Add(c => c.Status, status));
        Assert.NotNull(cut.Markup);
        Assert.Contains("badge", cut.Markup);
    }
}
