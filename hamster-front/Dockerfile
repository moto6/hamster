FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
#RUN npm config set
RUN npm ci --loglevel verbose
COPY . .
ENV NODE_ENV=development
RUN npm run build:dev

FROM nginx:stable-alpine AS deploy
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]