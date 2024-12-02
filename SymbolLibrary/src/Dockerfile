FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

COPY . .
RUN curl -o /app/Data/Symbols.xlsm https://github.com/equinor/NOAKADEXPI/raw/refs/heads/main/Symbols.xlsm
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build-env /app/out ./
COPY --from=build-env /app/Data/Symbols.xlsm ./Data/Symbols.xlsm

# Set the ASP.NET Core URL to listen on port 8000
ENV ASPNETCORE_URLS=http://+:5000

EXPOSE 5000

ENTRYPOINT ["dotnet", "SymbolLibrary.dll"]
