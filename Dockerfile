# 1단계: 빌드
FROM node:20 AS builder

WORKDIR /app

# 소스 전체 복사
COPY . .

# 빌드 실행
# npm install + 각 앱 publicPath 수정 (svelte 제외)
RUN npm install \
  && echo "\n// publicPath 수정" \
  && find . -name "rspack.config.ts" -exec sed -i "s|publicPath: \"auto\"|publicPath: '/' + __dirname.split('/').pop() + '/'|g" {} \; \
  && find . -name "rspack.config.ts" -exec sed -i "s|publicPath: \"http://localhost:[0-9]\\+/\"|publicPath: '/' + __dirname.split('/').pop() + '/'|g" {} \; \
  && find . -name "rspack.config.ts" -exec sed -i "s|publicPath: \`\${process.env.MFE_PUBLIC_SERVICE}/\`|publicPath: '/' + __dirname.split('/').pop() + '/'|g" {} \; \
  && npx lerna run build --parallel

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
# svelte 관련 앱들은 워크스페이스에서 제외됨
# COPY --from=builder /app/svelte-review-app/dist /usr/share/nginx/html/svelte-review-app
# COPY --from=builder /app/sveltekit-review-app/dist /usr/share/nginx/html/sveltekit-review-app
COPY --from=builder /app/vue-account-app/dist /usr/share/nginx/html/vue-account-app
COPY --from=builder /app/vue-ai-interview-app/dist /usr/share/nginx/html/vue-ai-interview-app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
