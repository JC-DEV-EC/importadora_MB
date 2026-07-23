# ---- Stage 1: Build frontend ----
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: Build backend ----
FROM maven:3.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests clean package

# ---- Stage 3: Runtime (nginx + JRE) ----
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache nginx

COPY --from=backend-builder /app/target/importadora-mb-backend-0.0.1-SNAPSHOT.jar /app/app.jar
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx-deploy.conf /etc/nginx/http.d/default.conf

RUN addgroup -S appgroup && adduser -S -G appgroup appuser && \
    chown -R appuser:appgroup /app /usr/share/nginx/html /var/lib/nginx /var/log/nginx /run && \
    chmod -R g+w /var/lib/nginx /var/log/nginx /run

USER appuser
EXPOSE 8080

CMD sh -c "nginx && java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -jar /app/app.jar"
