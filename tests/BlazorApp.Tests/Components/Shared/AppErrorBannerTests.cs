using BlazorApp.Components.Shared;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

public sealed class AppErrorBannerTests : TestContext
{
    public AppErrorBannerTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void RendersMessage()
    {
        var cut = RenderComponent<AppErrorBanner>(p => p
            .Add(c => c.Message, "Greška pri učitavanju podataka."));

        Assert.Contains("Greška pri učitavanju podataka.", cut.Markup);
    }

    [Fact]
    public void HasRoleAlertForAccessibility()
    {
        var cut = RenderComponent<AppErrorBanner>(p => p.Add(c => c.Message, "Greška"));
        var div = cut.Find("[role='alert']");
        Assert.NotNull(div);
    }

    [Fact]
    public void WhenOnRetryHasDelegate_ShowsRetryButton()
    {
        var cut = RenderComponent<AppErrorBanner>(p => p
            .Add(c => c.Message, "Greška")
            .Add(c => c.OnRetry, () => { }));

        Assert.Contains("Pokušaj ponovo", cut.Markup);
    }

    [Fact]
    public void WhenOnRetryHasNoDelegate_HidesRetryButton()
    {
        var cut = RenderComponent<AppErrorBanner>(p => p
            .Add(c => c.Message, "Greška"));
            // OnRetry nije dodan = nema delegate-a

        Assert.DoesNotContain("Pokušaj ponovo", cut.Markup);
    }

    [Fact]
    public void WhenRetryClicked_InvokesOnRetry()
    {
        var retried = false;
        var cut = RenderComponent<AppErrorBanner>(p => p
            .Add(c => c.Message, "Greška")
            .Add(c => c.OnRetry, () => { retried = true; }));

        cut.Find("button").Click();

        Assert.True(retried);
    }

    [Fact]
    public void WhenCustomRetryLabel_RendersCustomLabel()
    {
        var cut = RenderComponent<AppErrorBanner>(p => p
            .Add(c => c.Message, "Greška")
            .Add(c => c.RetryLabel, "Osvježi")
            .Add(c => c.OnRetry, () => { }));

        Assert.Contains("Osvježi", cut.Markup);
        Assert.DoesNotContain("Pokušaj ponovo", cut.Markup);
    }

    [Fact]
    public void WhenNullMessage_RendersWithoutCrash()
    {
        var cut = RenderComponent<AppErrorBanner>(p => p
            .Add(c => c.Message, (string?)null));

        Assert.NotNull(cut.Markup);
    }
}
