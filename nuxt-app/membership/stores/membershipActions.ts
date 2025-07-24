import * as axiosUtility from "../../utility/axiosInstance";

export const membershipAction = {
  async fetchMyMembership(userId: number) {
    const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();

    try {
      const response = await djangoAxiosInstance.get("/membership/status", {
        params: { userId },
      });

      if (response.status === 200 && response.data.membership) {
        this.myMembership = response.data.membership;
        this.errorMessage = null;
      } else {
        this.myMembership = null;
        this.errorMessage = "구독 정보가 없습니다.";
      }
    } catch (error) {
      console.error("fetchMyMembership() 오류:", error);
      this.myMembership = null;
      this.errorMessage = "구독 정보를 불러오는 중 오류가 발생했습니다.";
    }
  },
};
