.PHONY: run migration database

migration: 
			dotnet ef --project src/Infrastructure/Infrastructure.csproj --startup-project src/Web/Web.csproj migrations add $(name)
				dotnet ef database update --project src/Infrastructure/Infrastructure.csproj --startup-project src/Web/Web.csproj

run: 
		docker compose up -d --build

database:
	docker compose up -d postgres