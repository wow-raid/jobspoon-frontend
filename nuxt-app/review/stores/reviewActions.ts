import * as axiosUtility from "../../utility/axiosInstance";
import type { AxiosResponse } from "axios";

export const reviewActions = {
  async requestReviewListToDjango(this: {
    reviewList: any[];
    totalItems: number;
    totalPages: number;
  }) {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      const res: AxiosResponse = await djangoAxiosInstance.get("/review/list", {
        params: { page: 1, perPage: 8 },
      });

      this.reviewList = res.data.dataList;
      this.totalItems = res.data.totalItems;
      this.totalPages = res.data.totalPages;
      console.log("📦 리뷰 목록 응답 전체:", res.data);
    } catch (error: any) {
      console.error(
        "❌ 리뷰 목록 불러오기 실패:",
        error.response?.data || error.message
      );
      alert("리뷰 목록을 불러오는 데 실패했습니다.");
    }
  },

  async requestRegisterReviewToDjango(this: any, payload: any) {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      console.log("📤 리뷰 등록 요청 데이터:", payload);
      const response: AxiosResponse = await djangoAxiosInstance.post(
        "/review/create",
        payload
      );
      console.log("✅ 리뷰 등록 응답 수신:", response.data);
      alert("리뷰가 성공적으로 등록되었습니다.");
      // ✅ 리뷰 목록 갱신
      await this.requestReviewListToDjango();
    } catch (error: any) {
      console.error(
        "❌ 리뷰 등록 실패:",
        error.response?.data || error.message
      );
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  },

  async requestReadReviewToDjango(
    this: {
      review: any;
      reviewContent: string;
    },
    reviewId: string
  ) {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      const res: AxiosResponse = await djangoAxiosInstance.get(
        `/review/read/${reviewId}`
      );
      console.log("게시글 조회 성공:", res.data);
      this.review = res.data;
      this.reviewContent = res.data.content;
      return res.data;
    } catch (error) {
      console.error("requestReadToDjango() 중 에러:", error);
      throw new Error("리뷰 불러오기 실패");
    }
  },

  async requestDeleteReviewToDjango(
    this: {
      review: any;
      reviewList: any[];
    },
    reviewId: string
  ) {
    const userToken = localStorage.getItem("userToken");
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      const res: AxiosResponse = await djangoAxiosInstance.delete(
        `/review/delete/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("삭제 완료");
      this.reviewList = this.reviewList.filter(
        (item) => item.id !== Number(reviewId)
      );
    } catch (error: any) {
      console.error(
        "requestDeleteReviewToDjango() 중 에러:",
        error.response?.data || error.message
      );
      throw new Error("삭제 실패");
    }
  },

  async requestUpdateReviewToDjango(
    this: any,
    payload: { id: string; title: string }
  ) {
    const { id, title } = payload;
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
    try {
      const userToken = localStorage.getItem("userToken");
      const res = await djangoAxiosInstance.put(`/review/update/${id}`, {
        title,
        userToken,
      });
      console.log("수정 완료:", res.data);
    } catch (error: any) {
      console.error(
        "requestUpdateReviewToDjango() 중 에러:",
        error.response?.data || error.message
      );
      throw new Error("리뷰 실패");
    }
  },
};
