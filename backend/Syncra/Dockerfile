FROM maven:3.8.8-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/target/Syncra-0.0.1-SNAPSHOT.jar syncra.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "syncra.jar"]
