# React 19 + Vite 7 SPA 빌드 후 nginx 로 서빙하는 멀티스테이지 Dockerfile.
# 빌드 컨텍스트는 hamster-front/ 디렉터리.

# Stage 1 - build (Node 22 = .nvmrc lts/jod)
FROM node:22-alpine AS build
WORKDIR /app

# 의존성 레이어 캐시: lockfile 먼저 복사 후 설치.
COPY package*.json ./
RUN npm ci

# 소스 복사 후 프로덕션 빌드(dist 생성).
COPY . .
RUN npm run build

# Stage 2 - runtime (nginx)
FROM nginx:1.27-alpine AS deploy
ENV TZ=Asia/Seoul

# SPA 라우팅 + /api 프록시 설정.
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 빌드 산출물(dist)을 nginx 정적 루트로 복사.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
