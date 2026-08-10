.PHONY: help run-api run-web test migrate docker-up docker-down docker-logs \
        research-today research-doctor

help:
	@echo ""
	@echo "  Razvoj"
	@echo "  ------"
	@echo "  make run-api        Pokreni API server  (http://localhost:5000)"
	@echo "  make run-web        Pokreni Blazor UI   (http://localhost:5001)"
	@echo "  make test           Pokreni sve testove"
	@echo "  make migrate        Primijeni EF Core migracije"
	@echo ""
	@echo "  Docker"
	@echo "  ------"
	@echo "  make docker-up      Pokreni sve servise (api + web + db)"
	@echo "  make docker-down    Zaustavi i ukloni containere"
	@echo "  make docker-logs    Prati logove svih servisa"
	@echo ""
	@echo "  Research agent"
	@echo "  --------------"
	@echo "  make research-today    Statistike danas"
	@echo "  make research-doctor   Health check agenta"
	@echo ""

run-api:
	dotnet run --project src/Api

run-web:
	dotnet run --project src/Web

test:
	dotnet test src/ --verbosity minimal

migrate:
	dotnet ef database update --project src/Api

docker-up:
	docker compose -f docker/docker-compose.yml up --build

docker-down:
	docker compose -f docker/docker-compose.yml down

docker-logs:
	docker compose -f docker/docker-compose.yml logs -f

research-today:
	npm run research:today

research-doctor:
	npm run research:doctor
