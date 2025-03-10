# FROM node:20
# WORKDIR /app
# COPY package.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]

FROM node:20
WORKDIR /app

# 1️⃣ package.json과 package-lock.json만 먼저 복사 (캐시 활용)
COPY package.json package-lock.json ./

# 2️⃣ 캐시를 활용해서 패키지 설치 (여기까지는 캐시가 남아있음)
RUN npm install  

# 3️⃣ 이제 나머지 소스 코드 복사 (이 단계에서만 새로 빌드됨)
COPY . .  

# 4️⃣ Vite 개발 서버 실행
CMD ["npm", "run", "dev"]

# CMD ["npm", "start"] 배포용