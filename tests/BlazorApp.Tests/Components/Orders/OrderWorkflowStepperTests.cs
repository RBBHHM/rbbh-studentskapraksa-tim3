using BlazorApp.Components.Orders;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Orders;

/// <summary>
/// bUnit testovi za OrderWorkflowStepper.
///
/// FL: 6 koraka (Prodaja, CA, Vještak, CO pregled, Faktura, Završeno)
/// PL: 8 koraka (Prodaja, CA, CO pristup, Ponude, Vještak, CO pregled, Faktura, Završeno)
///
/// StatusCode vrijednosti odgovaraju AppraisalOrderStatus enum-u:
///   Draft = 0, SubmittedBySales = 10, AcceptedByCA = 20,
///   AppraisalInProgress = 120, AppraisalReceived = 130,
///   ReadyForProcedure = 150, Completed = 200
/// </summary>
public sealed class OrderWorkflowStepperTests : TestContext
{
    public OrderWorkflowStepperTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    // ── FL — broj koraka ──────────────────────────────────────────────────────

    [Fact]
    public void FL_Renders6Steps()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 0)
            .Add(c => c.IsPl, false));

        var steps = cut.FindAll(".od-wf-step");
        Assert.Equal(6, steps.Count);
    }

    [Fact]
    public void FL_StepLabels_ContainProdajaCAVjeStakCO()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 0)
            .Add(c => c.IsPl, false));

        var markup = cut.Markup;
        Assert.Contains("Prodaja", markup);
        Assert.Contains("CA", markup);
        Assert.Contains("Vještak", markup);
        Assert.Contains("CO pregled", markup);
    }

    // ── PL — broj koraka ──────────────────────────────────────────────────────

    [Fact]
    public void PL_Renders8Steps()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 0)
            .Add(c => c.IsPl, true));

        var steps = cut.FindAll(".od-wf-step");
        Assert.Equal(8, steps.Count);
    }

    [Fact]
    public void PL_StepLabels_ContainCOPristupIPonude()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 0)
            .Add(c => c.IsPl, true));

        Assert.Contains("CO pristup", cut.Markup);
        Assert.Contains("Ponude", cut.Markup);
    }

    // ── Mapiranje statusa na korak ────────────────────────────────────────────

    [Theory]
    [InlineData(0, 0)]   // Draft → korak 0 (Prodaja)
    [InlineData(10, 0)]  // SubmittedBySales → korak 0 (Prodaja u toku)
    [InlineData(20, 1)]  // AcceptedByCA → korak 1 (CA)
    [InlineData(30, 1)]  // DocumentationReviewInProgress → korak 1 (CA)
    [InlineData(100, 2)] // OrderSentToAppraiser → korak 2 (Vještak)
    [InlineData(120, 2)] // AppraisalInProgress → korak 2 (Vještak)
    [InlineData(130, 3)] // AppraisalReceived → korak 3 (CO pregled)
    [InlineData(200, 5)] // Completed → korak 5 (Završeno)
    public void FL_StatusCode_MapsToCorrectCurrentStep(int statusCode, int expectedStep)
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, statusCode)
            .Add(c => c.IsPl, false));

        var currentSteps = cut.FindAll(".od-wf-step.current");
        Assert.Single(currentSteps);

        // Provjeri da postoji točan broj 'done' koraka
        var doneSteps = cut.FindAll(".od-wf-step.done");
        Assert.Equal(expectedStep, doneSteps.Count);
    }

    // ── StatusLabel prikaz ────────────────────────────────────────────────────

    [Fact]
    public void WhenStatusLabelProvided_RendersOnCurrentStep()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 20)
            .Add(c => c.IsPl, false)
            .Add(c => c.StatusLabel, "Pregled dokumentacije"));

        Assert.Contains("Pregled dokumentacije", cut.Markup);
    }

    [Fact]
    public void WhenNoStatusLabel_NoLabelRendered()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 20)
            .Add(c => c.IsPl, false)
            .Add(c => c.StatusLabel, (string?)null));

        // Samo korak labele (Prodaja, CA...) trebaju biti vidljive
        Assert.DoesNotContain("Pregled dokumentacije", cut.Markup);
    }

    // ── CurrentOwnerRole prikaz ───────────────────────────────────────────────

    [Fact]
    public void WhenCurrentOwnerRole_RendersOwnerInfo()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 20)
            .Add(c => c.IsPl, false)
            .Add(c => c.CurrentOwnerRole, "Kolateral administrator"));

        Assert.Contains("Kolateral administrator", cut.Markup);
        Assert.Contains("Trenutno odgovoran", cut.Markup);
    }

    [Fact]
    public void WhenNoCurrentOwnerRole_OwnerInfoNotRendered()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 20)
            .Add(c => c.IsPl, false)
            .Add(c => c.CurrentOwnerRole, (string?)null));

        Assert.DoesNotContain("Trenutno odgovoran", cut.Markup);
    }

    [Fact]
    public void WhenNextResponsibleRole_RendersNextStep()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 20)
            .Add(c => c.IsPl, false)
            .Add(c => c.CurrentOwnerRole, "CA")
            .Add(c => c.NextResponsibleRole, "Vještak"));

        Assert.Contains("Sljedeći korak", cut.Markup);
        Assert.Contains("Vještak", cut.Markup);
    }

    // ── HasAriaAttributes ─────────────────────────────────────────────────────

    [Fact]
    public void HasAriaLabel()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 0)
            .Add(c => c.IsPl, false));

        Assert.Contains("aria-label", cut.Markup);
        Assert.Contains("Tok obrade", cut.Markup);
    }

    [Fact]
    public void HasRoleList()
    {
        var cut = RenderComponent<OrderWorkflowStepper>(p => p
            .Add(c => c.StatusCode, 0)
            .Add(c => c.IsPl, false));

        Assert.Contains("role=\"list\"", cut.Markup);
    }
}
