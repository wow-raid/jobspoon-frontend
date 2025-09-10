# 1단계: 빌드
FROM node:20 AS builder

WORKDIR /app

# 소스 전체 복사
COPY . .
# 배포 환경 설정
ENV NODE_ENV=production
ENV MFE_CORS_ORIGIN=https://job-spoon.com

# 기타 환경 변수는 GitHub Secrets에서 자동으로 주입됨
# 로컬 개발 환경에서는 .env 파일에서 localhost 경로 사용
# 배포 환경에서는 GitHub Actions에서 설정된 환경 변수 사용

RUN npm install \
  && npm -ws run build -w @jobspoon/theme-bridge -w @jobspoon/app-state

# 예: Svelte 관련 앱 제외
RUN npm install \
  && echo "// 각 앱 publicPath 수정" \
  && find main-container navigation-bar-app vue-account-app vue-ai-interview-app studyroom-app mypage-app spoon-word-app -name "rspack.config.ts" \
       -exec sed -i'' -e 's|publicPath: "auto"|publicPath: "/"+__dirname.split("/").pop()+"/"|g' {} \; \
  && cd main-container && npm run build && cd .. \
  && cd navigation-bar-app && npm run build && cd .. \
  && cd vue-account-app && npm run build && cd .. \
  && cd vue-ai-interview-app && npm run build && cd .. \
  && cd studyroom-app && npm run build && cd .. \
  && cd mypage-app && npm run build && cd .. \
  && cd spoon-word-app && npm run build && cd ..


# 2단계: Nginx
FROM nginx:alpine

# nginx 설정 복사
COPY docker/nginx.conf /etc/nginx/nginx.conf

# 기본 conf 제거 (중요!)
RUN rm -f /etc/nginx/conf.d/default.conf

# 각 앱 dist를 nginx 경로에 맞게 복사
COPY --from=builder /app/main-container/dist /usr/share/nginx/html/html-container
COPY --from=builder /app/mypage-app/dist /usr/share/nginx/html/mypage-app
COPY --from=builder /app/navigation-bar-app/dist /usr/share/nginx/html/navigation-bar-app
COPY --from=builder /app/studyroom-app/dist /usr/share/nginx/html/studyroom-app
#COPY --from=builder /app/svelte-review-app/dist /usr/share/nginx/html/svelte-review-app
COPY --from=builder /app/vue-account-app/dist /usr/share/nginx/html/vue-account-app
COPY --from=builder /app/vue-ai-interview-app/dist /usr/share/nginx/html/vue-ai-interview-app
COPY --from=builder /app/spoon-word-app/dist /usr/share/nginx/html/spoon-word-app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
