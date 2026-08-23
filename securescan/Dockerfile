# Build the Spring Boot application
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

COPY src ./src

RUN mvn clean package -DskipTests


# Run the Spring Boot application
FROM eclipse-temurin:21-jre-jammy

# Install Nmap inside the backend container
RUN apt-get update \
    && apt-get install -y --no-install-recommends nmap \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Run the application as a non-root user
RUN useradd --system --uid 10001 securescan-user

USER securescan-user

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]