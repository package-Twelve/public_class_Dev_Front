# Stage 1: Build
FROM node:18 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 파일 복사
COPY package.json package-lock.json ./

# 종속성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# Stage 2: Production Image
FROM nginx:latest

# Nginx 설정 파일을 Docker 이미지에 포함
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드 단계에서 생성된 파일을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 로그 파일을 호스트와 공유
VOLUME ["/var/log/nginx"]

# Nginx 포트 공개
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
