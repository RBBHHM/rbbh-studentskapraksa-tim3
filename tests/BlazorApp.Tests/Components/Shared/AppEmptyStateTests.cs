using BlazorApp.Components.Shared;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

public sealed class AppEmptyStateTests : TestContext
{
    public AppEmptyStateTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void RendersTitle()
    {
        var cut = RenderComponent<AppEmptyState>(p => p.Add(c => c.Title, "Nema podataka"));
        Assert.Contains("Nema podataka", cut.Markup);
    }

    [Fact]
    public void WhenChildContentProvided_RendersChildContent()
    {
        var cut = RenderComponent<AppEmptyState>(p => p
            .Add(c => c.Title, "Prazan")
            .AddChildContent("<p>Kreirajte prvu stavku.</p>"));

        Assert.Contains("Kreirajte prvu stavku.", cut.Markup);
    }

    [Fact]
    public void HasRoleStatusForAccessibility()
    {
        var cut = RenderComponent<AppEmptyState>(p => p.Add(c => c.Title, "Nema"));
        var div = cut.Find("div[role='status']");
        Assert.NotNull(div);
    }

    [Fact]
    public void WhenCustomIcon_UsesProvidedIcon()
    {
        var cut = RenderComponent<AppEmptyState>(p => p
            .Add(c => c.Title, "Nema")
            .Add(c => c.Icon, Icons.Material.Outlined.CheckCircle));

        Assert.Contains(Icons.Material.Outlined.CheckCircle, cut.Markup);
    }

    [Fact]
    public void WhenCustomIconColor_AppliesColor()
    {
        var cut = RenderComponent<AppEmptyState>(p => p
            .Add(c => c.Title, "Nema")
            .Add(c => c.IconColor, "#FF0000"));

        Assert.Contains("#FF0000", cut.Markup);
    }

    [Fact]
    public void DefaultIcon_IsInboxIcon()
    {
        var cut = RenderComponent<AppEmptyState>(p => p.Add(c => c.Title, "Nema"));
        Assert.Contains(Icons.Material.Outlined.Inbox, cut.Markup);
    }
}
