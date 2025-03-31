# 1단계: Node 환경에서 빌드
FROM node:20 as build
WORKDIR /app

# package 파일 먼저 복사 → 캐시 활용
COPY package.json package-lock.json ./
RUN npm install

# 소스코드 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# Nginx 설정 파일 덮어쓰기 (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx는 기본적으로 80포트 사용
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
