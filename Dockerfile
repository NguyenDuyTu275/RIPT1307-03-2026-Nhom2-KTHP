# ============================================
# Stage 1: Build - Biên dịch ứng dụng
# ============================================
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy Maven wrapper và pom.xml trước để tận dụng Docker cache
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Cấp quyền thực thi cho Maven wrapper + fix line endings (CRLF -> LF)
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Tải dependencies trước (cache layer này nếu pom.xml không đổi)
RUN ./mvnw dependency:resolve -DskipTests

# Copy toàn bộ source code
COPY src src

# Build ứng dụng, bỏ qua test
RUN ./mvnw clean package -DskipTests

# ============================================
# Stage 2: Run - Chạy ứng dụng (image nhẹ hơn)
# ============================================
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# Tạo user non-root để chạy app (bảo mật hơn)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy file JAR từ stage build
COPY --from=build /app/target/*.jar app.jar

# Đổi quyền sở hữu file cho user non-root
RUN chown appuser:appgroup app.jar

# Chuyển sang user non-root
USER appuser

# Expose port mặc định của Spring Boot
EXPOSE 8080

# Chạy ứng dụng với các tùy chọn JVM tối ưu cho container
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
