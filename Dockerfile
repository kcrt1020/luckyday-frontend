FROM node:20
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# npm install 실행 (peer dependency 충돌 방지)
RUN npm install --force --legacy-peer-deps

# 프로젝트 코드 복사
COPY . .  

# Vite 개발 서버 실행
CMD ["npm", "run", "dev"]
