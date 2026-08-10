# Smjernice za komponente

## Kreiranje nove komponente

1. Smjestite je u odgovarajući `Components/` subfolder
2. Koristite `[Parameter]` atribute za customizaciju
3. Koristite `EventCallback` za event-ove prema roditelju
4. Nemojte injektovati servise u reusable komponente — proslijedite podatke kao parametar

## Primjer komponente

```razor
@* Components/Common/Alert.razor *@

<div class="alert alert-@Type.ToLower()" role="alert">
    @Message
</div>

@code {
    [Parameter] public string Message { get; set; } = string.Empty;
    [Parameter] public string Type { get; set; } = "info"; // info, success, warning, danger
}
```

## Parametri vs Inject

```razor
@* DOBRO — komponenta prima podatke *@
<DataTable Items="@_items" OnRowClick="HandleRowClick" />

@* LOŠE — komponenta sama vuče podatke *@
@code {
    @inject ItemService ItemService  // NE u reusable komponentama
}
```

## Lifecycle metode

- `OnInitializedAsync` — učitavanje podataka
- `OnParametersSetAsync` — reakcija na promjenu parametara
- `StateHasChanged` — ručno triggerovanje re-rendera (koristiti oprezno)

## Dokumentacija komponenti

Dodajte XML komentar za parametre:
```csharp
/// <summary>Prikaz alertnog bloka korisniku.</summary>
/// <param name="Message">Tekst koji se prikazuje.</param>
/// <param name="Type">Tip alerta: info | success | warning | danger.</param>
```
