using BlazorApp.Components.Shared;
using Bunit;
using Microsoft.AspNetCore.Components;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

/// <summary>bUnit testovi za AppPageHeader.</summary>
public sealed class AppPageHeaderTests : TestContext
{
    public AppPageHeaderTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void RendersTitle()
    {
        var cut = RenderComponent<AppPageHeader>(p => p.Add(c => c.Title, "Pregled narudžbi"));
        Assert.Contains("Pregled narudžbi", cut.Markup);
    }

    [Fact]
    public void WhenSubtitleProvided_RendersSubtitle()
    {
        var cut = RenderComponent<AppPageHeader>(p => p
            .Add(c => c.Title, "Naslov")
            .Add(c => c.Subtitle, "Podnaslov stranice"));

        Assert.Contains("Podnaslov stranice", cut.Markup);
    }

    [Fact]
    public void WhenSubtitleNull_DoesNotRenderSubtitleElement()
    {
        var cut = RenderComponent<AppPageHeader>(p => p
            .Add(c => c.Title, "Naslov")
            .Add(c => c.Subtitle, (string?)null));

        Assert.DoesNotContain("page-subtitle", cut.Markup);
    }

    [Fact]
    public void WhenSubtitleEmpty_DoesNotRenderSubtitleElement()
    {
        var cut = RenderComponent<AppPageHeader>(p => p
            .Add(c => c.Title, "Naslov")
            .Add(c => c.Subtitle, ""));

        Assert.DoesNotContain("page-subtitle", cut.Markup);
    }

    [Fact]
    public void WhenActionsProvided_RendersActionsSlot()
    {
        var cut = RenderComponent<AppPageHeader>(p => p
            .Add(c => c.Title, "Naslov")
            .Add(c => c.Actions, builder =>
            {
                builder.OpenElement(0, "button");
                builder.AddContent(1, "Nova akcija");
                builder.CloseElement();
            }));

        Assert.Contains("Nova akcija", cut.Markup);
        Assert.Contains("page-header-actions", cut.Markup);
    }

    [Fact]
    public void WhenActionsNull_DoesNotRenderActionsContainer()
    {
        var cut = RenderComponent<AppPageHeader>(p => p
            .Add(c => c.Title, "Naslov")
            .Add(c => c.Actions, (RenderFragment?)null));

        Assert.DoesNotContain("page-header-actions", cut.Markup);
    }
}
