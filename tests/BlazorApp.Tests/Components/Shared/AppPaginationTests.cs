using BlazorApp.Components.Shared;
using Bunit;
using MudBlazor;
using MudBlazor.Services;
using Xunit;

namespace Praksa.BlazorApp.Tests.Components.Shared;

public sealed class AppPaginationTests : TestContext
{
    public AppPaginationTests()
    {
        Services.AddMudServices();
        JSInterop.Mode = JSRuntimeMode.Loose;
    }

    [Fact]
    public void WhenTotalPagesOne_RendersNothingOrCount()
    {
        // TotalPages <= 1 → nema navigacijskih dugmadi
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 1)
            .Add(c => c.TotalPages, 1)
            .Add(c => c.TotalCount, 5));

        Assert.DoesNotContain("app-pagination-nav", cut.Markup);
    }

    [Fact]
    public void WhenTotalPagesZero_RendersEmpty()
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 1)
            .Add(c => c.TotalPages, 0)
            .Add(c => c.TotalCount, 0));

        Assert.DoesNotContain("app-pagination-nav", cut.Markup);
    }

    [Fact]
    public void WhenTotalPagesMany_RendersNavigation()
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 1)
            .Add(c => c.TotalPages, 5)
            .Add(c => c.TotalCount, 50));

        Assert.Contains("app-pagination-nav", cut.Markup);
    }

    [Fact]
    public void WhenPage1_PreviousButtonIsDisabled()
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 1)
            .Add(c => c.TotalPages, 5)
            .Add(c => c.TotalCount, 50));

        var prevBtn = cut.Find("button[aria-label='Prethodna stranica']");
        Assert.True(prevBtn.HasAttribute("disabled"));
    }

    [Fact]
    public void WhenOnLastPage_NextButtonIsDisabled()
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 5)
            .Add(c => c.TotalPages, 5)
            .Add(c => c.TotalCount, 50));

        var nextBtn = cut.Find("button[aria-label='Sljedeća stranica']");
        Assert.True(nextBtn.HasAttribute("disabled"));
    }

    [Fact]
    public void WhenMiddlePage_BothButtonsEnabled()
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 3)
            .Add(c => c.TotalPages, 5)
            .Add(c => c.TotalCount, 50));

        var prevBtn = cut.Find("button[aria-label='Prethodna stranica']");
        var nextBtn = cut.Find("button[aria-label='Sljedeća stranica']");

        Assert.False(prevBtn.HasAttribute("disabled"));
        Assert.False(nextBtn.HasAttribute("disabled"));
    }

    [Fact]
    public void WhenNextClicked_OnPageChangeInvokedWithPagePlusOne()
    {
        var pages = new List<int>();
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 2)
            .Add(c => c.TotalPages, 5)
            .Add(c => c.TotalCount, 50)
            .Add(c => c.OnPageChange, (int pg) => pages.Add(pg)));

        cut.Find("button[aria-label='Sljedeća stranica']").Click();

        Assert.Single(pages);
        Assert.Equal(3, pages[0]);
    }

    [Fact]
    public void WhenPrevClicked_OnPageChangeInvokedWithPageMinusOne()
    {
        var pages = new List<int>();
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 3)
            .Add(c => c.TotalPages, 5)
            .Add(c => c.TotalCount, 50)
            .Add(c => c.OnPageChange, (int pg) => pages.Add(pg)));

        cut.Find("button[aria-label='Prethodna stranica']").Click();

        Assert.Single(pages);
        Assert.Equal(2, pages[0]);
    }

    [Fact]
    public void CurrentPage_MarkedWithActiveCssClass()
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, 2)
            .Add(c => c.TotalPages, 3)
            .Add(c => c.TotalCount, 30));

        // Aktivna stranica ima CSS klasu 'active'
        var activeBtn = cut.Find("button.active");
        Assert.Contains("2", activeBtn.TextContent);
    }

    [Theory]
    [InlineData(1, 5)]
    [InlineData(3, 5)]
    [InlineData(5, 5)]
    public void AllPagesInRange_RenderedWhenTotalPagesUpTo7(int page, int total)
    {
        var cut = RenderComponent<AppPagination>(p => p
            .Add(c => c.Page, page)
            .Add(c => c.TotalPages, total)
            .Add(c => c.TotalCount, total * 10));

        // Svih 5 stranica treba biti prikazano
        for (var i = 1; i <= total; i++)
        {
            Assert.Contains($"aria-label=\"Stranica {i}\"", cut.Markup);
        }
    }
}
