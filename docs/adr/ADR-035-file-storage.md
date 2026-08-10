# ADR-035: File storage strategija

**Status:** ⚠ Needs Review  
**Kategorija:** G — Dokumenti i storage  
**Owner:** Arhitekta / DevOps  
**Datum donošenja:** Oktobar 2025  
**Posljednja izmjena:** Juli 2026  
**Kada revidirati:** Prije produkcijskog deploya — lokalni disk nije prihvatljiv za produkciju  
**Zahvaćeni moduli:** Infrastructure (IFileStorageProvider, LocalFileStorageProvider), Api, Docker  
**User Stories:** US-3 (upload dokumenta procjene), US-92 (document management)

---

## Kontekst

Sistem uploaduje, čuva i servira dokumente narudžbi: procjene, fakture, korigovane verzije. Volume dokumenata raste s brojem narudžbi — godišnji volume od 5000 narudžbi može generirati 10-30 GB dokumenata godišnje (PDF fajlovi 1-5 MB).

Produkcijski storage zahtjevi: visoka dostupnost, backup, replikacija, skalabilnost. Lokalni disk ne zadovoljava ni jedan od ovih zahtjeva za produkciju.

---

## Decision Drivers

- **Development simplicity** — lokalni disk je najjednostavniji za development i testiranje
- **Production readiness** — za produkciju je potreban storage koji podržava backup i može biti mountan na više instanci
- **Zamjenjivost** — storage provider mora biti zamjenjiv bez promjene business logike
- **Docker-native** — development setup mora raditi bez vanjskih cloud servisa

---

## Odluka

`IFileStorageProvider` port (vidi ADR-005) s trenutnom `LocalFileStorageProvider` implementacijom:

```csharp
// LocalFileStorageProvider čuva fajlove na /app/storage/
// Docker volume: api_storage:/app/storage
var path = Path.Combine(_options.BasePath, orderId.ToString(), fileName);
await File.WriteAllBytesAsync(path, bytes, ct);
```

**Health check** provjerava disk space (threshold: 1 GB slobodno) i write permission.

**Identificirani problemi**:
1. Lokalni disk nije dostupan u multi-instance deploymentu — svaka instanca ima vlastiti disk
2. Nema automatskog backup-a — Docker volume ostaje nebackupan
3. File dostupnost ovisi o jednoj mašini

**Planirana zamjena za produkciju**:
```csharp
// MinIO (self-hosted, S3-kompatibilan):
public sealed class MinioFileStorageProvider : IFileStorageProvider
{
    // AWSSDK.S3 ili Minio .NET SDK
    // PutObjectAsync → GetObjectAsync → DeleteObjectAsync
}
```

---

## Alternativna rješenja

| Opcija | Horizontal scale | Backup | Troškovi | Dev simplicity | Zašto nije izabrana / status |
|--------|-----------------|--------|---------|---------------|------------------------------|
| **Lokalni disk + Docker volume** ✓ | ✗ | Ručno | Nema | ✓ | Adekvatno za development — nedovoljno za produkciju |
| MinIO (self-hosted S3) | ✓ | ✓ | Minimalni (vlastiti server) | ✗ (dodatni Docker service) | Preporučeno za produkciju — nije implementirano |
| AWS S3 | ✓ | ✓ | Platiti per-GB/request | ✗ (cloud zavisnost) | Podaci o poslovnim dokumentima ne smiju biti na stranom cloud-u bez GDPR analize |
| Azure Blob | ✓ | ✓ | Platiti per-GB/request | ✗ (cloud zavisnost) | Ista GDPR razmatranja kao AWS S3 |

---

## Consequences

### Pozitivne (lokalni disk)
- Development i lokalno testiranje rade bez ikakve infrastrukturne konfiguracije
- `IFileStorageProvider` apstrakcija garantuje da zamjena na MinIO ne dirne business logiku

### Negativne
- Lokalni disk nije prihvatljiv za produkciju s više od jedne API instance
- Nema automatskog backup-a — disaster recovery plan nije definiran
- Docker volume migrate je netrivijalan ako se mašina mijenja

### Svjesno prihvaćeni kompromisi
- Prihvatamo lokalni disk za development i prototip deployment s jasnim razumijevanjem da je ovo privremeno rješenje s definiranim rokom zamjene.

---

## Tehnički dug

🟠 **VISOK PRIORITET** — Implementirati `MinioFileStorageProvider` kao preduslov za produkciju:

1. Dodati MinIO u `docker-compose.yml` (self-hosted S3)
2. Implementirati `MinioFileStorageProvider : IFileStorageProvider`
3. Konfigurirati DI kroz environment variable: `USE_MINIO=true`
4. Testirati migraciju postojećih fajlova iz lokalnog diska u MinIO bucket
5. Konfigurirati MinIO lifecycle policy za retention (npr. čuvanje 7 godina per regulativi)

---

## Migration Impact

- **Breaking Changes:** Zamjena storage provider-a zahtijeva migraciju postojećih fajlova
- **Rollback Plan:** `LocalFileStorageProvider` ostaje kao fallback kroz DI konfiguraciju
- **Compatibility:** `IFileStorageProvider` interfejs je stabilan — MinIO implementacija je drop-in zamjena

---

## Kada revidirati

- Odmah pri planiranju produkcijskog deploya — ovo je kritičan preduslov
- Identifikuje se sigurnosni zahtjev za enkriptiranjem fajlova at-rest — tada storage provider mora podržavati server-side encryption
