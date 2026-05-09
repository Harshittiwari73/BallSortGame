FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/BallSortGame.API ./BallSortGame.API
COPY backend/BallSortGame.Application ./BallSortGame.Application
COPY backend/BallSortGame.Core ./BallSortGame.Core
COPY backend/BallSortGame.Infrastructure ./BallSortGame.Infrastructure

WORKDIR /src/BallSortGame.API

RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "BallSortGame.API.dll"]