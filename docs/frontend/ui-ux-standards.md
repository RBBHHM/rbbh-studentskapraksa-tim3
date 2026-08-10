# UI/UX standardi

## Responsive design

- Mobile-first pristup
- Bootstrap grid ili MudBlazor grid sistem
- Minimalni breakpointi: 576px (sm), 768px (md), 992px (lg), 1200px (xl)

## Boje i branding

TODO: Definisati sa timom/mentorom:
- Primary color
- Secondary color
- Error/Success/Warning/Info boje

## Tipografija

- Koristiti system font stack za performanse
- Headings: H1-H6 hijerarhija prema semantici
- Body text: minimalno 14px

## Loading stanja

Svaki async poziv mora imati:
1. Loading indikator (spinner ili skeleton)
2. Error poruku ako poziv ne uspije
3. Empty state ako nema podataka

## Forme

- Labele iznad inputa (ne placeholder umjesto labele)
- Inline validacione poruke ispod inputa
- Disabled Submit dok forma nije validna
- Confirm dijalog za destruktivne akcije (brisanje)

## Pristupačnost

- Koristiti semantičke HTML elemente
- ARIA labele za ikone bez teksta
- Keyboard navigacija mora raditi
- Kontrast boja prema WCAG AA standardu
