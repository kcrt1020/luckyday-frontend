FROM node:20
WORKDIR /app

# 1️⃣ package.json과 package-lock.json만 먼저 복사 (캐시 활용)
COPY package.json package-lock.json ./

# 2️⃣ 캐시를 무효화하고 패키지 설치 강제 실행
RUN npm install --force

# 3️⃣ 나머지 소스 코드 복사
COPY . .  

# 4️⃣ Vite 개발 서버 실행
CMD ["npm", "run", "dev"]
