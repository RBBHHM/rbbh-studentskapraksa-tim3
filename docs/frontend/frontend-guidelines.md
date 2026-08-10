# Frontend smjernice (Blazor WebAssembly)

## Organizacija komponenti

```
Pages/       — Stranice sa @page direktivom
Layout/      — Layout komponente (MainLayout, NavMenu)
Components/
  Common/    — Zajedničke komponente (Spinner, Alert...)
  Forms/     — Formularne komponente
  Tables/    — Grid/tabela komponente
  Feedback/  — Toast, Dialog, Validation summary
Services/    — HTTP klijenti za API komunikaciju
```

## Pravila

1. **Stranice** su tanke — delegiraju na servise, ne pišu HTTP pozive direktno
2. **Komponente** su reusable — parametrizovane, ne ovise o konkretnim servisima
3. **Servisi** su injektovani kroz `@inject`, ne `new`
4. **StateContainer** ili Fluxor za dijeljeno stanje između stranica (kada zatreba)

## Primjer stranice

```razor
@page "/items"
@inject ItemService ItemService

<h1>Items</h1>

@if (_items == null)
{
    <LoadingSpinner />
}
else
{
    <DataTable Items="_items" />
}

@code {
    private IEnumerable<ItemDto>? _items;

    protected override async Task OnInitializedAsync()
    {
        _items = await ItemService.GetAllAsync();
    }
}
```

## Error handling

Koristite `try/catch` u `OnInitializedAsync` i prikažite `Alert` komponentu. Ne dozvolite unhandled exception-e koji ruše stranicu.

## TODO

- Odabrati UI biblioteku (MudBlazor je instaliran u BlazorApp — razmotriti za novi Web projekt)
- Definisati color palette i typography
