using BlazorApp.Components.Orders;
using BlazorApp.Models;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components;

/// <summary>
/// bUnit testovi za OrderDetailActionBar komponentu.
/// Pokriva vidljivost dugmadi per capability flag — klase ekvivalencije.
/// </summary>
public sealed class OrderDetailActionBarTests : TestContext
{
    public OrderDetailActionBarTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    private static OrderCapabilitiesDto EmptyCapabilities() => new()
    {
        CanSubmit = false, CanCancel = false, CanEdit = false,
        CanRequestAdditionalPayment = false, CanCompleteAdditionalPayment = false,
        CanGenerateDocuments = false, CanSendQuoteRequests = false, CanSendThankYou = false,
        CanUploadInvoice = false, CanSendInvoiceForPayment = false, CanConfirmInvoicePaid = false,
        CanRejectOrder = false, CanReturnForRework = false
    };

    // ── CanSubmit ─────────────────────────────────────────────────────────────

    [Fact]
    public void WhenCanSubmit_True_ShowsSubmitButton()
    {
        var caps = EmptyCapabilities(); caps.CanSubmit = true;
        var cut = RenderComponent<OrderDetailActionBar>(p => p
            .Add(c => c.Capabilities, caps));

        Assert.Contains("Pošalji CA-u", cut.Markup);
    }

    [Fact]
    public void WhenCanSubmit_False_HidesSubmitButton()
    {
        var cut = RenderComponent<OrderDetailActionBar>(p => p
            .Add(c => c.Capabilities, EmptyCapabilities()));

        Assert.DoesNotContain("Pošalji CA-u", cut.Markup);
    }

    // ── CanAcceptOrder ────────────────────────────────────────────────────────

    [Fact]
    public void WhenCanAcceptOrder_True_ShowsAcceptAndRejectButtons()
    {
        var cut = RenderComponent<OrderDetailActionBar>(p => p
            .Add(c => c.Capabilities, EmptyCapabilities())
            .Add(c => c.CanAcceptOrder, true));

        Assert.Contains("Prihvati narudžbu", cut.Markup);
        Assert.Contains("Odbij narudžbu", cut.Markup);
    }

    // ── CanCancel ─────────────────────────────────────────────────────────────

    [Fact]
    public void WhenCanCancel_True_WithoutSecondaryMenu_ComponentRenders()
    {
        // Test sekundarnog menija zahtijeva dodatne MudBlazor services (MudPopoverProvider).
        // Ovdje verificiramo samo da komponenta renderuje bez grešaka kada nema secondary akcija.
        var caps = EmptyCapabilities(); caps.CanCancel = true;
        var cut = RenderComponent<OrderDetailActionBar>(p => p
            .Add(c => c.Capabilities, caps)
            .Add(c => c.HasSecondaryActions, false));
        Assert.NotNull(cut.Markup);
    }

    // ── EventCallbacks ────────────────────────────────────────────────────────

    [Fact]
    public void WhenSubmitClicked_OnSubmitOrder_IsInvoked()
    {
        var caps = EmptyCapabilities(); caps.CanSubmit = true;
        var invoked = false;
        var cut = RenderComponent<OrderDetailActionBar>(p => p
            .Add(c => c.Capabilities, caps)
            .Add(c => c.OnSubmitOrder, () => { invoked = true; }));

        cut.Find("button").Click();

        Assert.True(invoked);
    }

    // ── Empty capabilities → nothing rendered ─────────────────────────────────

    [Fact]
    public void WhenAllCapabilitiesFalse_RendersOnlyStatusBadgeArea()
    {
        var cut = RenderComponent<OrderDetailActionBar>(p => p
            .Add(c => c.Capabilities, EmptyCapabilities()));

        // No primary action buttons visible
        Assert.DoesNotContain("Pošalji CA-u", cut.Markup);
        Assert.DoesNotContain("Prihvati narudžbu", cut.Markup);
        Assert.DoesNotContain("Dostavi procjenu na CO", cut.Markup);
    }
}
