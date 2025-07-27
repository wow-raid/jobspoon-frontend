<template>
  <client-only>
    <v-container>
      <v-card>
        <v-card-title>리뷰 작성</v-card-title>
        <v-card-text>
          <v-text-field v-model="title" label="제목" outlined></v-text-field>

          <div class="editor-container" v-if="QuillEditor">
            <QuillEditor
              v-model="content"
              :options="editorOptions"
              toolbar="full"
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
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useReviewStore } from "~/review/stores/reviewStore";
import { createAwsS3Instance } from "~/utility/awsS3Instance";
import { compressHTML } from "~/utility/compression";
import { useRuntimeConfig } from "nuxt/app";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { QuillEditor as QuillEditorType } from "@vueup/vue-quill";
import type { ComponentPublicInstance } from "vue";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const title = ref("");
const content = ref("");
const router = useRouter();
const reviewStore = useReviewStore();
const config = useRuntimeConfig();

const QuillEditor = ref<typeof QuillEditorType | null>(null);
const quillEditorRef = ref<ComponentPublicInstance<
  typeof QuillEditorType
> | null>(null);

const editorOptions = ref({
  theme: "snow",
  placeholder: "내용을 입력하세요...",
});

onMounted(async () => {
  console.log("Mounted: Dynamically loading QuillEditor...");
  const { QuillEditor: LoadedQuillEditor } = await import("@vueup/vue-quill");
  QuillEditor.value = LoadedQuillEditor;
  console.log("Mounted: QuillEditor loaded successfully.");
});

const uploadToS3 = async (htmlContent: string, filename: string) => {
  const s3Client = createAwsS3Instance();
  const params = {
    Bucket: config.public.AWS_BUCKET_NAME as string,
    Key: `review/${filename}`,
    Body: htmlContent,
    ContentType: "text/html",
  };
  console.log("📝 S3 Upload Params:", params);
  const command = new PutObjectCommand(params);
  return await s3Client.send(command);
};

const submitReview = async () => {
  console.log("🚀 리뷰 등록 시작");

  if (!title.value) {
    alert("제목을 입력하세요.");
    return;
  }

  await nextTick(async () => {
    const quillInstance = quillEditorRef.value?.getQuill();
    const htmlContent = quillInstance?.root?.innerHTML || "";

    if (!htmlContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    const userToken = localStorage.getItem("userToken");
    const compressedHTML = await compressHTML(htmlContent);
    const filename = `${crypto.randomUUID()}.html`;

    try {
      await uploadToS3(compressedHTML, filename);

      await reviewStore.requestRegisterReviewToDjango({
        title: title.value,
        content: `review/${filename}`,
        userToken,
      });

      alert("리뷰가 등록되었습니다.");
      router.push("/review/list");
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  });
};

const goBack = () => {
  router.push("/review/list");
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
