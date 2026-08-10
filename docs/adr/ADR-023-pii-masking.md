# ADR-023: Audit PII masking — trostepena sanitizacija

**Status:** Accepted  
**Kategorija:** D — Sigurnost i autorizacija  
**Owner:** Arhitekta / Compliance Engineer  
**Datum donošenja:** Novembar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Ako se promijeni GDPR interpretacija ili interna politika zaštite podataka za bankarski sektor  
**Zahvaćeni moduli:** Infrastructure (AuditValueSanitizer), svi audit eventi  
**User Stories:** Sve — svaki audit event prolazi kroz sanitizator

---

## Kontekst

Audit log mora sadržavati dovoljno informacija za forensiku i debugging, ali ne smije sadržavati:
- Plaintext lozinke ili tokens
- Kompletne JMBG/identifikacijske brojeve
- Kompletne email adrese

GDPR i interna politika banke zahtijevaju minimizaciju osobnih podataka u log zapisima koji su dostupni tehničkim timovima (a ne samo ovlaštenim compliance radnicima).

---

## Decision Drivers

- **GDPR** — lični podaci u log fajlovima koji su dostupni devops/developer timovima moraju biti minimizirani
- **Traceability** — masking ne smije ukloniti mogućnost identificiranja osobe pri regulatornoj reviziji (djelimično maskiranje dovoljno za identifikaciju od strane ovlaštenih)
- **Debugging** — parcijalni podaci moraju biti dovoljni za identifikaciju zapisa (koji korisnik, koji klijent)

---

## Odluka

`AuditValueSanitizer` primjenjuje tri regex pass-a u fiksnom redoslijedu:

### Pass 1 — Potpuna redakcija

Polja identificirana kao credential ili session token:
```
password, lozinka, token, secret, api_key, authorization → ***REDACTED***
```

### Pass 2 — Parcijalni email masking

```
john.doe@company.com → jo***@company.com
```
(prvih 2 karaktera lokalnog dijela ostaju vidljivi)

### Pass 3 — Parcijalni JMBG/telefon masking

```
0101985100129 → 01***29
```
(prvih 2 i zadnjih 2 cifre ostaju vidljivi)

**Redoslijed je bitan**: Pass 1 mora biti prvi jer credentials mogu sadržavati email format ili numeričke niske.

### Integracija

`AuditValueSanitizer` je injektiran u `IAuditSink` implementacije — svaki audit event prolazi kroz sanitizaciju prije pohrane. Sanitizacija se primjenjuje na stringovne vrijednosti u `OldValues`, `NewValues` i `EntityDisplayName` poljima.

---

## Alternativna rješenja

| Opcija | Traceability | Debugging | Privacy | Compliance | Zašto nije izabrana |
|--------|-------------|-----------|---------|-----------|---------------------|
| **Parcijalni masking** ✓ | ✓ Dovoljan | ✓ | ✓ | ✓ | — |
| Potpuni masking (***) | ✗ | ✗ | ✓ | Upitno | Gubitak forenzičke vrijednosti; compliance revizija ne može identificirati osobu |
| Nema maskinga | ✓ | ✓ | ✗ | ✗ | Direktno krši GDPR i internu politiku |
| Tokenizacija (referentni ID umjesto PII) | ✓ | Srednja | ✓ | ✓ | Zahtijeva tokenizacijski servis; kompleksna implementacija za ovaj opseg |

---

## Consequences

### Pozitivne
- Audit log je GDPR-compliant — osobni podaci su parcijalnu maskirani
- Debugging ostaje moguć — `jo***@company.com` je dovoljno za identifikaciju konteksta
- Compliance revizija može identificirati osobu na osnovu parcijalnih podataka uz pristup originalnom sistemu

### Negativne
- Regex-based masking nije 100% pouzdana — neočekivani formati podataka (npr. nestandardni email formati) mogu proći bez maskinga
- Masking se primjenjuje na stringovne vrijednosti u JSONB audit polju — strukturirani JSONB objekti koji sadrže nested PII zahtijevaju pažljivu primjenu regex-a

### Svjesno prihvaćeni kompromisi
- Prihvatamo parcijalni (ne potpuni) masking jer je kompromis između traceability-a i privacy-a — potpuni masking eliminiše vrijednost audit loga za debugging.

---

## Tehnički dug

- Nema unit testa koji pokriva edge case: JMBG embeddiran unutar JSON string-a u `NewValues` polju
- Regex pass-ovi nisu konfigurabilni — promjena masking pravila zahtijeva izmjenu koda

---

## Migration Impact

- **Breaking Changes:** Promjena masking pravila ne utiče na API kontrakt
- **Rollback Plan:** `AuditValueSanitizer` može biti bypassed za debugging svrhe kroz konfiguraciju (trenutno nije implementirano)
- **Compatibility:** Historijski audit zapisi s maskiranim podacima ne mogu biti "un-masked" — to je namjerna dizajnirana karakteristika

---

## Kada revidirati

- GDPR interpretacija za bankarski sektor promijeni zahtjeve (npr. kompletan masking postane obavezan)
- Identifikuje se slučaj gdje regex masking propusti PII format koji bi trebao biti maskiran
- Uvede se novi tip osobnih podataka koji nije pokriven trenutnim regex pass-ovima
