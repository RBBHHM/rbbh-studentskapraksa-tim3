using BlazorApp.Components.Shared;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

public sealed class AppFormFieldTests : TestContext
{
    public AppFormFieldTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void WhenLabelProvided_RendersLabel()
    {
        var cut = RenderComponent<AppFormField>(p => p.Add(c => c.Label, "Naziv klijenta"));
        Assert.Contains("Naziv klijenta", cut.Markup);
    }

    [Fact]
    public void WhenLabelNull_DoesNotRenderLabelElement()
    {
        var cut = RenderComponent<AppFormField>(p => p.Add(c => c.Label, (string?)null));
        Assert.DoesNotContain("app-field-label", cut.Markup);
    }

    [Fact]
    public void WhenLabelEmpty_DoesNotRenderLabelElement()
    {
        var cut = RenderComponent<AppFormField>(p => p.Add(c => c.Label, ""));
        Assert.DoesNotContain("app-field-label", cut.Markup);
    }

    [Fact]
    public void WhenRequired_True_RendersRequiredClass()
    {
        var cut = RenderComponent<AppFormField>(p => p
            .Add(c => c.Label, "Klijent")
            .Add(c => c.Required, true));

        Assert.Contains("app-field-required", cut.Markup);
    }

    [Fact]
    public void WhenRequired_False_DoesNotRenderRequiredClass()
    {
        var cut = RenderComponent<AppFormField>(p => p
            .Add(c => c.Label, "Klijent")
            .Add(c => c.Required, false));

        Assert.DoesNotContain("app-field-required", cut.Markup);
    }

    [Fact]
    public void WhenHelperText_NoErrorText_RendersHelper()
    {
        var cut = RenderComponent<AppFormField>(p => p
            .Add(c => c.Label, "Polje")
            .Add(c => c.HelperText, "Unesite puni naziv"));

        Assert.Contains("Unesite puni naziv", cut.Markup);
        Assert.Contains("app-field-helper", cut.Markup);
    }

    [Fact]
    public void WhenErrorText_HidesHelperText()
    {
        var cut = RenderComponent<AppFormField>(p => p
            .Add(c => c.Label, "Polje")
            .Add(c => c.HelperText, "Helper tekst")
            .Add(c => c.ErrorText, "Polje je obavezno"));

        Assert.DoesNotContain("Helper tekst", cut.Markup);
        Assert.Contains("Polje je obavezno", cut.Markup);
        Assert.Contains("app-field-error", cut.Markup);
    }

    [Fact]
    public void WhenBothHelperAndErrorNull_NeitherSectionRendered()
    {
        var cut = RenderComponent<AppFormField>(p => p.Add(c => c.Label, "Polje"));
        Assert.DoesNotContain("app-field-helper", cut.Markup);
        Assert.DoesNotContain("app-field-error", cut.Markup);
    }

    [Fact]
    public void RendersChildContent()
    {
        var cut = RenderComponent<AppFormField>(p => p
            .Add(c => c.Label, "Polje")
            .AddChildContent("<input type='text' id='my-input' />"));

        Assert.Contains("my-input", cut.Markup);
    }

    [Fact]
    public void AlwaysWrapsInAppFormFieldDiv()
    {
        var cut = RenderComponent<AppFormField>(p => p.Add(c => c.Label, "Test"));
        Assert.Contains("app-form-field", cut.Markup);
    }
}
