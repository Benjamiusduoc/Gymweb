FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY ms-gateway/pom.xml .
COPY ms-gateway/src src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
