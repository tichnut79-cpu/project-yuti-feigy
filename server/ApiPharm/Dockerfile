# שלב Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# שלב Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app

COPY --from=build /app/publish .

ARG DB_PASSWORD
ARG DB_USER
ARG DB_NAME

ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_USER=$DB_USER
ENV DB_NAME=$DB_NAME

EXPOSE 5000

ENTRYPOINT ["dotnet", "ApiPharm.dll"]