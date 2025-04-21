FROM maven:3.9.6-eclipse-temurin-21-slim AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
COPY --from=build /target/Syncra-0.0.1-SNAPSHOT.jar Syncra.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","Syncra.jar"]