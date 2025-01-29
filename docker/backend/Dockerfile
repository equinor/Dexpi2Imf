FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app
COPY client/Boundaries/Backend/. ./Backend/
COPY client/Boundaries/Boundaries/. ./Boundaries/

RUN dotnet publish ./Backend -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app
COPY --from=build /app/out ./
ENV ASPNETCORE_URLS=http://+:8000
EXPOSE 12110

ENTRYPOINT ["dotnet", "Backend.dll"]