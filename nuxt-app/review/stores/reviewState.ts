export const reviewState = () => ({
  reviewList: [] as any[],
  totalItems: 0,
  totalPages: 0,
  review: null as any, // 리뷰 상세 객체
  reviewContent: "" as string, // S3에서 불러온 HTML 본문 내용
  selectedReview: null as any, // 수정 페이지에서 사용될 선택된 리뷰
});
