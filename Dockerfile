# 1단계: 빌드 단계
FROM node:18 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 2단계: 프로덕션 단계
FROM nginx:alpine

# 빌드 단계에서 생성된 파일을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 포트 공개
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
