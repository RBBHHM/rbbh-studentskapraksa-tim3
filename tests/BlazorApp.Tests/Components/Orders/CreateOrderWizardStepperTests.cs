using BlazorApp.Components.Orders;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Orders;

/// <summary>
/// bUnit testovi za CreateOrderWizardStepper.
/// 4 koraka: Klijent (0), Nekretnina (1), Dokumentacija (2), Pregled (3).
/// </summary>
public sealed class CreateOrderWizardStepperTests : TestContext
{
    public CreateOrderWizardStepperTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private static (string Label, string Icon, int Idx)[] DefaultSteps =>
        CreateOrderWizardStepper.DefaultSteps;

    // ── Broj koraka ───────────────────────────────────────────────────────────

    [Fact]
    public void Renders4DefaultSteps()
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 0));

        var steps = cut.FindAll(".of-step");
        Assert.Equal(4, steps.Count);
    }

    // ── Labele koraka ─────────────────────────────────────────────────────────

    [Fact]
    public void RendersAllStepLabels()
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 0));

        Assert.Contains("Klijent", cut.Markup);
        Assert.Contains("Nekretnina", cut.Markup);
        Assert.Contains("Dokumentacija", cut.Markup);
        Assert.Contains("Pregled", cut.Markup);
    }

    // ── Trenutni korak označen ────────────────────────────────────────────────

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    public void CurrentStep_HasCurrentCssClass(int current)
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, current));

        var currentSteps = cut.FindAll(".of-step.current");
        Assert.Single(currentSteps);
    }

    // ── Prethodni koraci označeni kao "done" ──────────────────────────────────

    [Theory]
    [InlineData(0, 0)] // korak 0 → 0 prethodnih
    [InlineData(1, 1)] // korak 1 → 1 prethodni (done)
    [InlineData(2, 2)] // korak 2 → 2 prethodnih (done)
    [InlineData(3, 3)] // korak 3 → 3 prethodnih (done)
    public void PreviousSteps_HaveDoneCssClass(int current, int expectedDone)
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, current));

        var doneSteps = cut.FindAll(".of-step.done");
        Assert.Equal(expectedDone, doneSteps.Count);
    }

    // ── Brojevi koraka vs checkmark ───────────────────────────────────────────

    [Fact]
    public void WhenStep0IsCurrent_ShowsNumber1NotCheckmark()
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 0));

        var currentDot = cut.Find(".of-step.current .of-step-dot");
        // Trenutni i budući koraci prikazuju broj, ne checkmark
        Assert.Contains("1", currentDot.TextContent);
    }

    [Fact]
    public void WhenStep1IsCurrent_Step0ShowsCheckmark()
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 1));

        // Step 0 je done → treba checkmark (MudIcon.Check)
        var doneStep = cut.FindAll(".of-step.done")[0];
        Assert.DoesNotContain("1", doneStep.TextContent);
    }

    // ── EventCallback ─────────────────────────────────────────────────────────

    [Fact]
    public void WhenDoneStepClicked_OnStepClickInvoked()
    {
        var clickedStep = -1;
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 2)
            .Add(c => c.OnStepClick, (int s) => { clickedStep = s; }));

        // Klikni na korak 0 (done)
        cut.FindAll(".of-step")[0].Click();

        Assert.Equal(0, clickedStep);
    }

    [Fact]
    public void WhenStep1Clicked_InvokedWith1()
    {
        var clickedStep = -1;
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 3)
            .Add(c => c.OnStepClick, (int s) => { clickedStep = s; }));

        cut.FindAll(".of-step")[1].Click();

        Assert.Equal(1, clickedStep);
    }

    // ── Connecting lines ──────────────────────────────────────────────────────

    [Fact]
    public void Renders3ConnectorLinesBetween4Steps()
    {
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 0));

        var lines = cut.FindAll(".of-step-line");
        Assert.Equal(3, lines.Count);
    }

    [Fact]
    public void DoneConnectorLines_HaveDoneCssClass()
    {
        // Korak 2 → koraci 0 i 1 su done → 2 linije treba biti done
        var cut = RenderComponent<CreateOrderWizardStepper>(p => p
            .Add(c => c.Steps, DefaultSteps)
            .Add(c => c.CurrentStep, 2));

        var doneLines = cut.FindAll(".of-step-line.done");
        Assert.Equal(2, doneLines.Count);
    }
}
