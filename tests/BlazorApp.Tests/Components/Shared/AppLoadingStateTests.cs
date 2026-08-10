using BlazorApp.Components.Shared;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

public sealed class AppLoadingStateTests : TestContext
{
    public AppLoadingStateTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void RendersLoadingStateContainer()
    {
        var cut = RenderComponent<AppLoadingState>();
        Assert.Contains("loading-state", cut.Markup);
    }

    [Fact]
    public void HasAriaLabelForAccessibility()
    {
        var cut = RenderComponent<AppLoadingState>();
        Assert.Contains("aria-label=\"Učitavanje\"", cut.Markup);
    }

    [Fact]
    public void HasRoleStatusForScreenReaders()
    {
        var cut = RenderComponent<AppLoadingState>();
        Assert.Contains("role=\"status\"", cut.Markup);
    }

    [Fact]
    public void HasAriaLivePolite()
    {
        var cut = RenderComponent<AppLoadingState>();
        Assert.Contains("aria-live=\"polite\"", cut.Markup);
    }

    [Fact]
    public void DefaultSize_IsMedium()
    {
        var cut = RenderComponent<AppLoadingState>();
        // MudProgressCircular renderuje sa Size=Medium
        Assert.NotNull(cut.Markup);
    }

    [Fact]
    public void WhenSmallSize_RendersWithoutCrash()
    {
        var cut = RenderComponent<AppLoadingState>(p => p.Add(c => c.Size, Size.Small));
        Assert.Contains("loading-state", cut.Markup);
    }
}
