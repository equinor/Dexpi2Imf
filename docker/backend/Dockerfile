FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app
COPY client/Boundaries/Backend/. .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app
COPY --from=build /app/out ./
ENV ASPNETCORE_URLS=http://+:8000
EXPOSE 8000

ENTRYPOINT ["dotnet", "Backend.dll"]