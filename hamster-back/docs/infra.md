```
docker run -d \
  --name postgres-local \
  -p 5432:5432 \
  -e POSTGRES_DB=library \
  -e POSTGRES_USER=localuser \
  -e POSTGRES_PASSWORD=localpass \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:16
```

```yaml
version: "3.9"

services:
  postgres:
    image: postgres:16
    container_name: postgres-local
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: library
      POSTGRES_USER: localuser
      POSTGRES_PASSWORD: localpass
      TZ: Asia/Seoul
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    ports:
      - "5050:5050"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@local.dev
      PGADMIN_DEFAULT_PASSWORD: admin
    depends_on:
      - postgres
volumes:
  postgres-data:
```
```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/library
    username: localuser
    password: localpass
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        format_sql: true
```