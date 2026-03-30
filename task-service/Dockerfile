FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/task-service-0.0.1-SNAPSHOT.jar task-service.jar

EXPOSE 8082

ENTRYPOINT ["java","-jar","task-service.jar"]