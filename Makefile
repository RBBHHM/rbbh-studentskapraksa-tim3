.PHONY: restore build test run-api run-web

restore:
	dotnet restore RBBH.CollateralAppraisal.slnx
	cd src/Web && pnpm install

build:
	dotnet build RBBH.CollateralAppraisal.slnx -c Release --no-restore
	cd src/Web && pnpm build

test:
	dotnet test RBBH.CollateralAppraisal.slnx --no-restore
	cd src/Web && pnpm test

run-api:
	dotnet run --project src/Api/RBBH.CollateralAppraisal.Api.csproj

run-web:
	cd src/Web && pnpm dev
