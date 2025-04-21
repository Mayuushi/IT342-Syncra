FROM maven:3.8.8-eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . /app
WORKDIR /app/backend/Syncra
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/backend/Syncra/target/Syncra-0.0.1-SNAPSHOT.jar syncra.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dhttps.protocols=TLSv1.2", "-jar", "syncra.jar"]
