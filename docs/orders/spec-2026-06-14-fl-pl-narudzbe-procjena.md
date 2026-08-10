# Specifikacija: Narudžbe procjena — odvajanje Pravna lica (PL) / Fizička lica (FL)

> Napomena: ovo je sirova specifikacija dobijena od korisnika 2026-06-14 (kopirana iz
> Word/PowerPoint dokumenta sa slikama — referencirane "slike" i "prilozi" NISU
> sačuvani, samo tekstualni opis). Poruka je bila odsječena na 50.000 karaktera, pa je
> ovo SAMO PRVI DIO originalnog dokumenta (do negdje u sekciji "Postupak i odgovornosti
> učesnika u procesu" za CA, prije nego što je opisano polje "Ime Procjenitelja").
> Sačuvano kao referentni kontekst za gap-analizu trenutne implementacije.
>
> Dopuna 2026-06-14: korisnik je dostavio i originalni PDF "USER STORY amela_FL_PL
> finalna verzija" (18 str., pokriva isti sadržaj kao sekcije 1-7 ovog dokumenta) koji
> sadrži i procesne dijagrame (slika 4-FL, slika 4.1-PL) i potvrđuje raspored
> "5 kućica" — vidi sekciju 4 ispod.

## 1. Aplikacija — odvojeni klijenti Pravna lica i Fizička lica

Aplikacija "Narudžbe procjena": prijava (user + password) → otvara se forma sa dvije
kućice: **Pravna lica** i **Fizička lica**.

U lijevom uglu ulazne forme aplikacije nalaze se kućice:

- **Izvještaji** — sadrži:
  - Izvještaj svih polja iz protokola narudžbe, uključujući automatski izračun
    vremena za svakog učesnika u procesu po pojedinačnoj narudžbi i ukupno
  - Izvještaj koncentracije vještaka
  - Reminder vještaci
- **Dokumentacija** — sve check liste, urnek za izradu procjene i dokumentacija za
  narudžbe po tipovima
- **Šifarnici** — šifarnik vještaka, šifarnik tipova kolaterala, šifarnik filijala,
  šifarnik CO/CA
- **Reminder vještaku** — izvještaj koji klikom i odabirom vještaka šalje reminder
  vještaku da treba dostaviti procjenu za klijenta XY (automatski povlači iz
  protokola narudžbi za tog klijenta); može biti i unutar kućice "Izvještaji"

### Kućica Pravna lica — naslov "PL Narudžbe procjena", sadrži 5 kućica
1. Prodaja
2. Kolateral administrator (Narudžbe procjena)
3. Vještak
4. Kolateral oficir
5. Faktura/Protokol

(potvrđeno iz PDF "finalna verzija": "PL Narudžbe procjena" je naslov/oznaka grupe
kućica, ne posebna 6. kućica — isto vrijedi za "FL Narudžbe procjena" ispod)

### Kućica Fizička lica — naslov "FL Narudžbe procjena", sadrži 5 kućica
1. Prodaja
2. Kolateral administrator (Narudžbe procjena)
3. Vještak
4. Kolateral oficir
5. Faktura/Protokol

## 2. Skraćenice

| Skraćenica | Objašnjenje |
|---|---|
| RBBH | Raiffeisen BANK dd Bosna i Hercegovina |
| Prodaja | ROK za FL, Univerzalni bankar za PI klijente (UB), Viši rukovodilac/Rukovodilac za prodaju sa Corporate/SME/fizičkim/Premium klijentima (SM), Viši rukovodilac/Rukovodilac za poslovanje Corporate/SME klijenata (AM) |
| CO | Kolateral oficir |
| CA | Kolateral administrator |
| CM | Specijalisti za upravljanje portfoliom kolaterala |
| SM | Viši rukovodilac/Rukovodilac za prodaju (Corporate/SME/fizička lica/Premium) |
| AM | Viši rukovodilac/Rukovodilac za poslovanje (Corporate/SME) |
| UB | Univerzalni bankar za PI klijente (fizička lica) |
| FL | Fizička lica |
| PL | Pravna lica |

## 3. Opšta pravila aplikacije

- Definisana polja dostupna učesnicima prema ovlasti (RBAC po polju), uz funkcije
  ovlasti za svakog učesnika.
- Mogućnost taska (zadatka) prema učesnicima u procesu.
- Uvoz dokumenata isključivo u **PDF** formatu + preuzimanje istih.
- Mogućnost vraćanja na korekcije/dorade (workflow "vrati na doradu").
- Notifikacija koja zamjenjuje e-mail (in-app notifikacije + mail).
- **Automatska dodjela vještaka za FL** algoritmom prema šifarniku vještaka i
  gradova (prilog 4, nije dostavljen u ovom dijelu).
- **Dodjela vještaka za PL bez algoritma, taskom** (manuelno).
- Unos/preuzimanje dokumenata prema ovlaštenjima umjesto slanja mailom.
- Zatvaranje taska.
- Obavezno vraćanje na doradu (da IT Banke ne mora čistiti inbox sa pogrešnim
  taskovima).
- Ažuriranje šifarnika vještaka od strane CMD u svakom momentu.
- **Masovni update** dosadašnjih narudžbi (Excel tabela) — implementirati vertikalne
  kolone, dodati nove, preslikati iz "kućica" učesnika (Prodaja, CA, Vještak, CO,
  Faktura/Protokol) u Protokol narudžbi sa istim i dorađenim rasporedom.
- **Automatsko kreiranje broja protokola** za svakog narednog klijenta (svaki klijent
  mora imati svoj broj protokola), na osnovu unesenih podataka kroz aplikaciju.
- Formiranje izvještaja: Protokol narudžbi (na osnovu svih unosa), izvještaj
  koncentracije vještaka, reminder izvještaj.

## 4. Inicijativa CMD: Automatizacija naloga za procjenu

### Proces FL
AM/SM/UB šalje notifikaciju na CA → CA pregleda dokumentaciju → klikom na task
automatski se šalje narudžba eksternom vještaku prema šifarniku vještaka i
parametrima → procjena ide CO na odobrenje i print.

### Proces PL
AM/SM/UB šalje notifikaciju na CA → CA šalje na provjeru pristupa na CO ODMAH ako je
u pitanju poslovni objekat/zemljište/kuća → CO određuje max. 3 vještaka kojima se
šalju ponude (ako je sve u redu) i određuje rok za dostavu ponude → bira se vještak sa
najpovoljnijom cijenom i rokom → CA dostavlja saglasnost na potpis (sa cijenom) na
AM/SM/UB → narudžba procjene standardnom procedurom prema izabranom vještaku.

Mogućnost vraćanja na dorade — ovlasti isključivo CA i CO.

### Dijagrami toka procesa (slika 4-FL i slika 4.1-PL)

**FL tok (slika 4-FL)** — linearan, 5 koraka:
Klijent → Prodaja → Kolateral administrator → Vještak → Kolateral oficir

**PL tok (slika 4.1-PL)** — 9 koraka, sa povratnom petljom za provjeru pristupa:
Klijent → Prodaja → Kolateral administrator → Kolateral oficir → Kolateral
administrator → Prodaja → Kolateral administrator → Vještak → Kolateral oficir

(Petlja CA → CO → CA → Prodaja → CA odgovara koraku "provjera pristupa prije
narudžbe": CA šalje CO na provjeru pristupa, CO vraća odgovor CA-u, CA dostavlja
saglasnost na potpis AM/SM/UB-u (Prodaja), zatim CA šalje narudžbu odabranom
vještaku, a finalna procjena ide na CO za odobrenje/print.)

## 5. NARUDŽBE PROCJENA FL i PL — uvod

Potrebno omogućiti import svih postojećih podataka iz Excel tabele ("Excel tabela
protokol narudžbi za masovni update", prilog 1) u dio aplikacije **"Protokol
narudžbi"**. Nakon importa, novi podaci (nove narudžbe) se nastavljaju automatski
preslikavati iz kućica učesnika u "Protokol narudžbi" prema ovlaštenjima, sa
automatskim kreiranjem narednog broja protokola.

- Masovni update se radi sa SVIM kolonama iz tabele — kolone bez podataka ostaju
  blank, podaci se prenose automatski (kontinuitet ažurnosti).
- "Protokol narudžbi" je dostupan **isključivo službi kolaterala**.

### Login flow (nakon implementacije)
Prijava → naziv usera → password → prijava → Pravna lica / Fizička lica (slika 6,
6.1).

### Početni ekran nakon prijave (slika 7) — za FL i PL identičan koncept/stil
5 kućica (istim redosljedom za FL i PL):
1. Prodaja
2. Kolateral administrator (Narudžbe procjena)
3. Vještak
4. Kolateral oficir
5. Faktura/Protokol

Plus nova kućica **"Protokol narudžbi"** (slika 7.1) gdje se vrši update svih kolona
i podataka.

## 6. Sekcija 1 — Iniciranje zadatka od Prodaje (AM/SM/UB) prema CA

Tok: FIZIČKA LICA/PRAVNA LICA → Prodaja → task na kraju kućice Prodaja → "Iniciraj
zadatak".

### Naslov taska/notifikacije (mail na CA)
```
Narudžba procjene za STAN (kolona G ili H) za klijenta XY (kolona C) grad XY (kolona I)
```

Podaci se čitaju iz "Protokol narudžbi" (gdje su preslikani iz kućice "Prodaja").

- Tip kolaterala/nekretnine — kolona G
- Tip kolaterala/nekretnine kombinovano — kolona H (ako popunjeno, ima prioritet)
- Klijent (naziv) — kolona C
- Grad nekretnine — kolona I

### Šifarnik klijenata
- **Klijent** (naslov taska/notifikacije) treba automatski čitati iz šifarnika:
  - **FL**: BOOPER → Šifarnici → Klijenti → Građani (postoje već smjernice za ovo)
  - **PL**: PROBIS → Šifarnici → Klijenti PL (podatak unose kolege iz likvidature)
- Prodaja je OBAVEZNA unijeti klijenta u šifarnik PRIJE slanja narudžbe, kako bi se
  podatak mogao automatski povući u kućicu "Prodaja".

## 7. Sekcija 2 — Postupak i odgovornosti učesnika: Prodaja (AM/SM/UB)

Tok: prijava → kućica "Prodaja" (Narudžbe procjena PL/FL) → popuniti mandatorna polja
→ podaci se automatski preslikavaju u "Protokol narudžbi" (prvi naredni slobodni red)
→ klik na task "Iniciraj zadatak".

### Mandatorna polja (Prodaja — AM/SM/UB), zajednička za FL i PL
1. **Naziv Klijenta** — mandatorno, automatski iz šifarnika klijenata (BOOPER za FL /
   PROBIS za PL); Prodaja mora prethodno unijeti klijenta u šifarnik.
2. **Ime AM/SM/UB** — mandatorno, automatski povučeno (user koji vrši unos), iz
   šifarnika prodaje (TODO: konsultacija sa kolegama iz prodaje odakle čitati).
3. **Segment PL/FL** — mandatorno (da li je klijent pravno ili fizičko lice).
4. **Grad kolaterala/nekretnine** — mandatorno, ručni unos.
5. **Adresa kolaterala/nekretnine** — mandatorno, ručni unos.
6. **Kontakt broj klijenta za izlazak na teren** — mandatorno, ručni unos.
7. **Ime i prezime osobe u poslovnici za dostavu original procjene** i **ime AM na
   kojeg se šalje procjena mailom** — mandatorno, oba imenom i prezimenom.
8. **Adresa poslovnice i grad** na koju treba dostaviti original procjenu —
   mandatorno, automatski iz šifarnika poslovnica/filijala (šifre org. jed. — prilog
   2, kolona A "šifra novo", zavisno iz koje filijale je inicirana narudžba).
   - Polje "Šifra" = poslovnica.
9. **Datum i vrijeme prijema zahtjeva u Prodaji od klijenta** — automatski (trenutak
   unosa klijenta u šifarnik); ranije se unosilo ručno.
10. **Datum i vrijeme slanja zahtjeva od Prodaje prema kolateralima** — automatski
    (trenutak iniciranja narudžbe prema CA); ranije ručno.
11. **Datum i vrijeme prijema original procjene u poslovnici** — automatski, popunjava
    se upload-om završene procjene na kraju procesa.
12. **Prijem original procjene u poslovnicu DA/NE** — klik "DA" od odgovorne osobe u
    poslovnici → automatski upiše ime/prezime osobe koja je preuzela procjenu.

### Polja samo za PL
- Unos broja kvadrata poslovnog dijela
- Unos broja kvadrata stambenog dijela

### Dokumentacija — kućica Prodaja (upload, PDF only)

Zajedničko FL i PL:
- **ZK** — upload više dokumenata, mandatorno; padajući meni s komentarima:
  - "Ne stariji od mjesec dana"
  - "Čitak dokument"
  - "Otkup druge banke (procjena se može naručiti samo ako se vrši otkup)"
  - dodatno: napomena o doživotnom izdržavanju u B/C listu (ZK/LN) — ako postoji, NE
    naručivati procjenu, provjeriti sa CO
  - dodatno: ako u C teretnom listu stoji "zabilježena je zabrana opterećenja i
    otuđenja predmetne nekretnine bez izričite i posebne njene pismene saglasnosti" —
    NE naručivati procjenu, potrebno brisati C list prije narudžbe
  - + mogućnost manuelnog unosa komentara mimo padajućeg menija (5 opcija + manuelni)
- **KKP** — mandatorno za stambene/poslovne objekte (NE za stan); upload više
  dokumenata; padajući meni: "Ne stariji od 90 dana"
- **Uplata (FL) / Saglasnost (PL)** — mandatorno, prema cjenovniku (prilog 3); iznos sa
  uplatnice/saglasnosti se preslikava u Protokol narudžbi → kolona "Naknada" (kolona
  U, prilog 1)
  - Cjenovnik: Stan = 200 KM, Stambeni objekat/kuća = 350 KM, Garaža = cijena stana
    (dodatnu cijenu određuje vještak), Stambeno-poslovni objekat (preovladava
    stambeni dio) = 450 KM
  - Cjenovnik treba biti upload-ovan u kućici "Dokumentacija" na početnom ekranu,
    sa mogućnošću ažuriranja/uploada novog cjenovnika od strane službe kolaterala
  - Za PL: cijena se određuje uz konsultaciju sa CO prema ponudama vještaka
- **Kupoprodajni ugovor** — upload više dokumenata, NIJE mandatorno (osim ako je
  predmet kupoprodaje → DA)
- **Ostala dokumentacija** — upload više dokumenata
- **Certifikat o energetskim performansama (EPC)** — upload; mandatorno AKO postoji,
  inače nije

Samo PL:
- **Slike** — upload više slika
- **Ugovor o najmu** — upload više dokumenata, nije mandatorno (koristi se kao uporedni
  primjer ako se izračun vrijednosti vrši na osnovu najma)
- **Dokumenti za PP** (pristupni put / dodatni ZK) — najviše 5 dokumenata, samo 1
  mandatoran ako CO zahtijeva
- **Identifikacija parcela** — upload, nije mandatorno
- **Urbanistička i građevinska dozvola** (sa pečatom pravosnažnosti) — upload, nije
  mandatorno
- **Vlasnička i saobraćajna dozvola/dokumentacija** — upload, mandatorno za vozila,
  zalihe, opremu
- **Servisna knjižica** — upload, nije mandatorno
- **Lager lista** — upload, mandatorno za zalihe
- **Račun** — upload, mandatorno za opremu/zalihe
- **Lista osnovnih sredstava** — upload, mandatorno za opremu

### Dokumentacija po tipu nekretnine (primjer FL)
- **Stan, apartman, garaža, ostava**: ZK/IIKU (ne stariji od mjesec dana), EPC (ako
  postoji), kupoprodajni ugovor/predugovor (ako primjenjivo), Uplata
- **Kuća, vikendica, stambeno-poslovni objekti**: ZK i/ili LN (ne stariji od mjesec
  dana), KKP i Posjedovni list (PL), EPC (ako postoji), identifikacija starog/novog
  premjera katastarskih čestica (po potrebi), kupoprodajni ugovor/predugovor (ako
  primjenjivo), Uplata

Pristup dokumentaciji u kućici Prodaja: AM/SM/UB + CA + CO (CA/CO prenose
dokumentaciju u foldere vještaka/klijenta).

### Taskovi — kućica Prodaja (FL i PL)
- Iniciraj zadatak
- Završi unos
- Podaci dopunjeni
- Dopuna izvršena
- Preuzet original procjene u poslovnicu
- Molim mišljenje CO i Pravne službe na procjenu
- Popuni saglasnost (samo PL)
- Reminder vještaku

Sva polja iz kućice Prodaja preslikavaju se u "Protokol narudžbi" (postojeće kolone +
nove kolone). Nove kolone (blank, bez podataka iz masovnog update-a, popunjavaju se
automatski tek od sada): **H, J, K, L, M, N, O, Q, X, Y, AA, AC, AE, AJ**. Postojeće
kolone koje se popunjavaju podacima iz masovnog update-a: **A, B, C, D, E, F, G, I, P,
R, S, T, U, V, W, Z, AB, AD, AF, AG, AH, AI** (prilog 1, nije dostavljen kao fajl u
ovom dijelu specifikacije).

### Pravila/validacije
- Polja iz kućice Prodaja su mandatorna ISKLJUČIVO za AM/SM/UB; vidljiva svim
  učesnicima OSIM eksternim vještacima.
- "Iniciraj zadatak" → notifikacija na CA mail: "Narudžba procjene za STAN (kolona G
  ili H) za klijenta XY (kolona C) grad XY (kolona I)".
- Svaki dokument upload-uje se POJEDINAČNO, ISKLJUČIVO PDF, mora biti čitak i
  novijeg datuma — napomena treba biti vidljiva pored svakog polja za upload.
- "Završi unos" dostupan SAMO AM/SM/UB; ne moguće kliknuti dok sva mandatorna polja
  nisu popunjena i mandatorna dokumentacija nije upload-ovana (zavisno od tipa
  kolaterala i FL/PL).
- "Završi unos" → notifikacija na "narudžbe procjena" mail: "Izvršeno iniciranje
  narudžbe od strane AM/SM/UB" + naslov "Narudžba procjene za STAN/kombinacija (kolona
  G ili H) za klijenta XY (kolona C) grad XY (kolona I)".
- Kombinacije tipa kolaterala (npr. stan + garaža + ostava) čitaju se iz kolone H
  ("tip kolaterala/nekretnine kombinovano") ako je popunjena, inače iz kolone G.
  Padajući meni "tip kolaterala/nekretnine kombinovano" treba sadržavati opcije:
  - APP-stan, garaža i ostava
  - APP-stan i garaža
  - APP-stan i ostava

## 8. Sekcija 3 — Postupak i odgovornosti učesnika: CA (Kolateral administrator)

CA prima notifikaciju mailom na "NARUDŽBE PROCJENA":
```
Dobili ste zadatak iniciranje narudžbe procjene od strane AM/SM/UB (kolona AJ) za STAN
(npr. kolona H) za klijenta XY (kolona C) grad XY (kolona I), klikom na link
pristupite zadatku
```

CA pristupa aplikaciji → kućica "Kolateral administrator (Narudžbe procjena)" → task
**"Prihvati zadatak"**.

### Provjera dokumentacije (CA)
- Da li su dokumenti novijeg datuma
- Da li su čitki i kompletni
- ZK/LN — B/C list ne sadrži doživotno izdržavanje (ako sadrži → NE naručivati
  procjenu, konsultacija sa CO)
- C teretni list — ako sadrži klauzulu o zabrani opterećenja/otuđenja → NE naručivati
  procjenu, potrebno brisanje C lista (konsultacija sa CO prije brisanja)

### Task "Dopuna podataka" (CA → AM/SM/UB)
Padajući meni (8 opcija + manuelni unos), neograničen broj karaktera za komentar,
neograničen broj ciklusa dopune:
1. ZK ne smije biti stariji od mjesec dana
2. KKP ne smije biti stariji od 90 dana
3. Dokument nije čitak
4. Dokument nije kompletan
5. U ZK izvadku ili LN ne smije biti navedeno doživotno izdržavanje u B/C listu (ako
   ima → ne naručivati procjenu, provjeriti sa CO)
6. C teretni list sadrži klauzulu o zabrani opterećenja/otuđenja → brisati C list
7. Nisu navedeni svi podaci potrebni za narudžbu
8. Otkup druge banke
9. Manuelni unos komentara (CA)

AM/SM/UB prima notifikaciju "potrebna dopuna podataka" → dopunjava → task "Podaci
dopunjeni" (na kraju kućice Prodaja) → notifikacija CA "Dopuna izvršena".

### Task "Završi pregled" (CA)
Kada je dokumentacija u redu → CA klikne "Završi pregled" → notifikacija SM/AM/UB
"Dokumentacija uredna" (nadovezuje se na prethodni mail tog klijenta).

### Task "Provjera pristupa prije narudžbe" (CA → CO)
- Ako se narudžba odnosi na: stambeni objekat (kuća), vikend kuća, stambeno-poslovni
  objekat, poslovni objekat, zemljište (NE stan) → CA OBAVEZNO šalje task na CO
  "Provjera pristupa prije narudžbe" PRIJE narudžbe.
- Notifikacija CO: "Provjera pristupa prije narudžbe za klijenta XY (kolona C)"
- Uvid u dokumente: AM/SM/UB, CA, CO + mogućnost prenošenja dokumenata.
- Svi taskovi u kućici "Kolateral administrator (Narudžbe procjena)" zasivljeni za
  sve OSIM CA.

## 9. Sekcija 4 — CO (Kolateral oficir): Provjera pristupa

Nakon notifikacije CO pristupa aplikaciji, prihvata task (na kraju kućice "Kolateral
oficir"), pregleda dokumentaciju (kroz kućicu Prodaja gdje je upload-ovana).

### Task "Uredan pristup, procjena se može naručiti" (CO)
- Ako je sve uredno → CO zatvara task klikom "Uredan pristup, procjena se može
  naručiti" → notifikacija na CA: "Pristup uredan, procjena se može naručiti za
  klijenta XY (kolona C)".
- Svi taskovi kućice "Kolateral oficir" zasivljeni za sve OSIM CO.
- Ako pristup uredan → standardna procedura narudžbe procjene (kao za stan).

### Task "Dopuna" (CO → CA/AM/SM/UB)
Padajući meni razloga vraćanja (+ manuelni unos, neograničen broj karaktera,
neograničen broj dopuna):
1. ZK ne smije biti stariji od mjesec dana
2. KKP ne smije biti stariji od 90 dana
3. Dokument nije čitak
4. Dokument nije kompletan
5. Doživotno izdržavanje u B/C listu (ZK/LN) → ne naručivati, provjeriti sa CO
6. C teretni list sa klauzulom zabrane → brisati C list
7. Nisu navedeni svi podaci potrebni za narudžbu
8. Otkup druge banke
9. Identifikacija parcela
10. Fotografija
11. Manuelni unos komentara (CO)

Tok: CO "Dopuna" → notifikacija SM/AM/UB + CA → AM/SM/UB dopunjava (upload + komentar,
neograničen broj karaktera) → task "Završi dopunu" → notifikacija CO "Dopuna
izvršena" → AM/SM/UB klik "Podaci dopunjeni" → notifikacija CO "Dopuna izvršena za
klijenta XY (kolona C)".

CO nakon provjere → "Pristup uredan" (slika 16.1) → notifikacija "Pristup uredan za
klijenta XY (kolona C), može se nastaviti sa procesom narudžbe" na CA i SM/AM/UB.

### Specifičnost za PL (proces ponuda vještaka)
Ako PL i nije u pitanju stan → CO usmeno koordinira sa CA koje vještake (obično 3)
treba kontaktirati za ponude. Slanje ponuda NIJE automatsko — CA manuelno šalje
ponude, ali kroz istu aplikaciju.

## 10. Sekcija 5 (započeto) — Kolateral administrator (Narudžbe procjena): mandatorna
polja po prijemu "Pristup uredan"

Polja koja CA popunjava nakon "Pristup uredan":
- **Ime CA** — automatski, nakon što CA izvrši unos (šifarnik CO/CA)
- **Ime Procjenitelja** — automatski, popunjava se nakon izbora vještaka iz Protokol
  Narudžb... *(specifikacija je ovdje odsječena na 50.000 karaktera — nastavak
  nedostaje)*

## 11. Otvorena pitanja / TODO iz specifikacije
- Prilog 1 (Excel tabela protokola narudžbi za masovni update, sa tačnim kolonama A-AJ)
  nije dostavljen kao fajl.
- Prilog 2 (šifarnik filijala/poslovnica sa kolonom "šifra novo") nije dostavljen.
- Prilog 3 / 3.1 (cjenovnik procjena + lista dokumentacije po tipu nekretnine) nije
  dostavljen.
- Prilog 4 (algoritam automatske dodjele vještaka za FL prema šifarniku vještaka i
  gradova) nije dostavljen.
- "Ime AM/SM/UB" — TODO: konsultacija sa kolegama iz prodaje odakle čitati podatak.
- Nastavak specifikacije (od "Ime Procjenitelja" nadalje, uključujući kompletan opis
  kućica Vještak, Kolateral oficir (puna), Faktura/Protokol, Izvještaji, Šifarnici,
  Reminder vještaku) NIJE primljen u ovoj poruci.
