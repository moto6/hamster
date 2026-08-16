# 멀티모듈 Gradle 프로젝트(hamster-back) 빌드용 멀티스테이지 Dockerfile.
# 빌드 컨텍스트는 hamster-back/ 디렉터리 전체(settings.gradle, 모든 모듈, gradlew, gradle/ 포함).
# 실행 가능한 앱은 :hamster-api 모듈이며, bootJar 태스크로 산출물을 만든다.

# Stage 1 - build backend (JDK 21)
FROM gradle:8.14.3-jdk21 AS build-backend
WORKDIR /build

# 멀티모듈 프로젝트 전체를 복사(루트 settings.gradle + 각 모듈 디렉터리 + wrapper).
COPY . .

# wrapper 권한 보장 후 hamster-api 모듈만 bootJar 생성(테스트 제외).
# --no-daemon: 컨테이너 빌드에서는 데몬 불필요.
RUN chmod +x ./gradlew \
 && ./gradlew :hamster-api:bootJar -x test --no-daemon

# 실행 가능한 bootJar 만 app.jar 로 정리(라이브러리용 *-plain.jar 는 제외).
RUN mkdir -p /build/dist \
 && cp "$(ls hamster-api/build/libs/*.jar | grep -v -- '-plain\.jar' | head -n 1)" /build/dist/app.jar

# Stage 2 - runtime (JRE 21)
FROM eclipse-temurin:21-jre
WORKDIR /app
ENV TZ=Asia/Seoul
ENV app="hamster"

# hamster-api 모듈의 bootJar 산출물만 런타임 이미지로 복사.
COPY --from=build-backend /build/dist/app.jar ${app}.jar

# 프로파일은 이미지에 굽지 않는다(환경 중립). 실행 시 SPRING_PROFILES_ACTIVE env 로만 선택.
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar ${app}.jar"]
