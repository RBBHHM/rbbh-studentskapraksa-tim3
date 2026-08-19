# OCP i IIS

Backend se gradi korijenskim `Dockerfile` fajlom i objavljuje standardnim OCP workflowima. Konfiguracija se ubrizgava na serveru. Frontend se gradi iz `src/Web` i predaje kao statički IIS paket. IIS treba HTTPS, SPA fallback na `index.html`, cache pravila za hashirane assete i runtime API URL prema OCP servisu.
