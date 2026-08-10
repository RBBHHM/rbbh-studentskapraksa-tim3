using BlazorApp.Components.Shared;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

public sealed class AppAccessDeniedTests : TestContext
{
    public AppAccessDeniedTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void DefaultTitle_IsPristupOdbijen()
    {
        var cut = RenderComponent<AppAccessDenied>();
        Assert.Contains("Pristup odbijen", cut.Markup);
    }

    [Fact]
    public void DefaultMessage_ContainsOvlastenje()
    {
        var cut = RenderComponent<AppAccessDenied>();
        Assert.Contains("ovlaštenje", cut.Markup);
    }

    [Fact]
    public void WhenCustomTitle_RendersCustomTitle()
    {
        var cut = RenderComponent<AppAccessDenied>(p => p
            .Add(c => c.Title, "Nema pristupa stranici"));

        Assert.Contains("Nema pristupa stranici", cut.Markup);
        Assert.DoesNotContain("Pristup odbijen", cut.Markup);
    }

    [Fact]
    public void WhenCustomMessage_RendersCustomMessage()
    {
        var cut = RenderComponent<AppAccessDenied>(p => p
            .Add(c => c.Message, "Kontaktirajte administratora."));

        Assert.Contains("Kontaktirajte administratora.", cut.Markup);
    }

    [Fact]
    public void WhenChildContentProvided_RendersChildContent()
    {
        var cut = RenderComponent<AppAccessDenied>(p => p
            .AddChildContent("<a href='/login'>Prijavi se</a>"));

        Assert.Contains("Prijavi se", cut.Markup);
    }

    [Fact]
    public void ContainerHasCorrectCssClass()
    {
        var cut = RenderComponent<AppAccessDenied>();
        Assert.Contains("app-access-denied", cut.Markup);
    }
}
