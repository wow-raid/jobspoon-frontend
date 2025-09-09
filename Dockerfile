# 1단계: 빌드
FROM node:20 AS builder

WORKDIR /app

# 소스 전체 복사
COPY . .

# 빌드 실행
# 환경 변수 설정
ENV VUE_ACCOUNT_APP=/vue-account-app/ \
    VUE_AI_INTERVIEW_APP=/vue-ai-interview-app/ \
    REACT_NAVIGATION_APP=/navigation-bar-app/ \
    REACT_STUDYROOM_APP=/studyroom-app/ \
    REACT_MYPAGE_APP=/mypage-app/ \
    REACT_SPOON_WORD_APP=/spoon-word-app/ \
    NODE_ENV=production

RUN set -eux \
  && npm install \
  && echo "\n// publicPath 수정" \
  # main-container의 publicPath 수정 및 환경 변수 설정
  && sed -i'' -e 's|publicPath: .*|publicPath: "/html-container/",|g' main-container/rspack.config.ts \
  # 환경 변수 설정을 위한 .env 파일 생성
  && echo "VUE_ACCOUNT_APP=${VUE_ACCOUNT_APP}" > main-container/.env \
  && echo "VUE_AI_INTERVIEW_APP=${VUE_AI_INTERVIEW_APP}" >> main-container/.env \
  && echo "REACT_NAVIGATION_APP=${REACT_NAVIGATION_APP}" >> main-container/.env \
  && echo "REACT_STUDYROOM_APP=${REACT_STUDYROOM_APP}" >> main-container/.env \
  && echo "REACT_MYPAGE_APP=${REACT_MYPAGE_APP}" >> main-container/.env \
  && echo "REACT_SPOON_WORD_APP=${REACT_SPOON_WORD_APP}" >> main-container/.env \
  # studyroom-app의 publicPath 수정
  && sed -i'' -e 's|publicPath: .*|publicPath: "'"${REACT_STUDYROOM_APP}"'",|g' studyroom-app/rspack.config.ts \
  # navigation-bar-app의 publicPath 수정
  && sed -i'' -e 's|publicPath: .*|publicPath: "'"${REACT_NAVIGATION_APP}"'",|g' navigation-bar-app/rspack.config.ts \
  # vue-account-app의 publicPath 수정
  && find vue-account-app -name "rspack.config.ts" -exec sed -i'' -e 's|publicPath: .*|publicPath: "'"${VUE_ACCOUNT_APP}"'",|g' {} \; \
  # vue-ai-interview-app의 publicPath 수정
  && sed -i'' -e 's|publicPath: .*|publicPath: "'"${VUE_AI_INTERVIEW_APP}"'",|g' vue-ai-interview-app/rspack.config.ts \
  # mypage-app의 publicPath 수정
  && find mypage-app -name "rspack.config.ts" -exec sed -i'' -e 's|publicPath: .*|publicPath: "'"${REACT_MYPAGE_APP}"'",|g' {} \; \
  # spoon-word-app의 publicPath 수정
  && find spoon-word-app -name "rspack.config.ts" -exec sed -i'' -e 's|publicPath: .*|publicPath: "'"${REACT_SPOON_WORD_APP}"'",|g' {} \; \
  # 각 앱의 패키지 설치 및 빌드 실행
  && cd main-container && npm install && npm run build && cd .. \
  && cd navigation-bar-app && npm install && npm run build && cd .. \
  && cd vue-account-app && npm install && npm run build && cd .. \
  && cd vue-ai-interview-app && npm install && npm run build && cd .. \
  && cd studyroom-app && npm install && npm run build && cd .. \
  && cd mypage-app && npm install && npm run build && cd .. \
  && cd spoon-word-app && npm install && npm run build && cd ..

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