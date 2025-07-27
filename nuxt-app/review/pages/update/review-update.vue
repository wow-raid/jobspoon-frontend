<template>
  <client-only>
    <v-container>
      <v-card>
        <v-card-title>리뷰 수정</v-card-title>
        <v-card-text>
          <v-text-field v-model="title" label="제목" outlined></v-text-field>
          <div class="editor-container" v-if="QuillEditor">
            <QuillEditor
              v-model="content"
              :options="editorOptions"
              ref="quillEditorRef"
            />
          </div>

          <v-card-actions class="justify-end">
            <v-btn color="primary" class="mt-3" @click="submitReview"
              >저장</v-btn
            >
            <v-btn color="secondary" class="mt-3" @click="goBack">취소</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-container>
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, markRaw } from "vue";
import { shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useReviewStore } from "../../../review/stores/reviewStore";
import {
  createAwsS3Instance,
  getSignedUrlFromS3,
} from "~/utility/awsS3Instance";
import { compressHTML } from "~/utility/compression";
import { useRuntimeConfig } from "nuxt/app";
import { PutObjectCommand } from "@aws-sdk/client-s3"; // ✅ 누락된 import 추가
import type { QuillEditor as QuillEditorType } from "@vueup/vue-quill";
import type { ComponentPublicInstance } from "vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const title = ref("");
const content = ref("");
const router = useRouter();
const route = useRoute();
const reviewStore = useReviewStore();

const QuillEditor = ref<typeof QuillEditorType | null>(null);
const quillEditorRef = shallowRef<ComponentPublicInstance<
  typeof QuillEditorType
> | null>(null);
const editorOptions = {
  theme: "snow",
  placeholder: "내용을 입력하세요...",
};

const config = useRuntimeConfig();
let originalFilename = ""; // ✅ 기존 S3 파일명을 저장할 변수 추가

onMounted(async () => {
  console.log("Mounted: Dynamically loading QuillEditor...");
  const { QuillEditor: LoadedQuillEditor } = await import("@vueup/vue-quill");
  QuillEditor.value = markRaw(LoadedQuillEditor);
  console.log("Mounted: QuillEditor loaded successfully.");

  const reviewId = route.params.reviewId as string;
  const stateReview = history.state.review;

  const loadReviewContent = async (reviewData: any) => {
    title.value = reviewData.title;
    originalFilename = reviewData.content;
    const url = await getSignedUrlFromS3(originalFilename);
    const response = await fetch(url);
    content.value = await response.text();
    nextTick(() => {
      const quillInstance = quillEditorRef.value?.getQuill?.();
      if (quillInstance) {
        quillInstance.root.innerHTML = content.value;
      }
    });
  };

  if (stateReview) {
    console.log("state review 사용");
    await loadReviewContent(stateReview);
  } else {
    console.log("서버에서 리뷰 로딩");
    const reviewData = await reviewStore.requestReadReviewToDjango(reviewId);
    if (reviewData) await loadReviewContent(reviewData);
  }
});

const uploadToS3 = async (htmlContent: string, filename: string) => {
  const s3Client = createAwsS3Instance();
  const params = {
    Bucket: config.public.AWS_BUCKET_NAME as string,
    Key: filename,
    Body: htmlContent,
    ContentType: "text/html",
  };
  console.log("📝 S3 Upload Params:", params);
  const command = new PutObjectCommand(params);
  return await s3Client.send(command);
};

const submitReview = async () => {
  console.log("🚀 Submit post started...");

  if (!title.value || !content.value) {
    alert("제목과 내용을 입력하세요.");
    return;
  }

  await nextTick(async () => {
    const quillInstance = quillEditorRef.value?.getQuill();
    const updatedContent = quillInstance?.root?.innerHTML || "";

    if (!updatedContent) {
      alert("내용을 입력해주세요.");
      return;
    }
    const compressedHTML = await compressHTML(updatedContent);

    try {
      const reviewId = route.params.reviewId as string;
      const reviewData = await reviewStore.requestReadReviewToDjango(reviewId);
      const originalTitle = reviewData.title;
      const filename = reviewData.content;

      // ✅ S3에 HTML 업데이트 (항상 실행)
      await uploadToS3(compressedHTML, filename);

      if (originalTitle !== title.value) {
        await reviewStore.requestUpdateReviewToDjango({
          id: reviewId,
          title: title.value,
        });
      }
      alert("리뷰가 수정되었습니다.");
      router.push(`/review/read/${reviewId}`);
    } catch (err) {
      console.error("리뷰 수정 실패");
      alert("수정 중 오류가 발생했습니다.");
    }
  });
};

const goBack = () => {
  router.push(`/review/read/${route.params.reviewId}`);
};
</script>
<style scoped>
.editor-container {
  margin-top: 20px;
}

.editor-container .ql-editor {
  min-height: 200px;
}

.ql-toolbar.ql-snow {
  border-radius: 8px 8px 0 0;
}

.ql-container.ql-snow {
  border-radius: 0 0 8px 8px;
}
</style>
