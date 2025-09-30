// utils/trustScoreUtils.ts

/**
 * 출석률 점수 계산
 * @param rate 출석률 (0~100)
 * @returns 점수 (최대 25)
 */
export const calcAttendanceScore = (rate: number): number =>
    Math.min(rate * 0.25, 25);

/**
 * 모의면접 점수 계산
 * @param count 완료한 모의면접 횟수
 * @returns 점수 (최대 20)
 */
export const calcInterviewScore = (count: number): number =>
    Math.min(count, 20) * 1;

/**
 * 문제풀이 점수 계산
 * @param count 문제 풀이 개수
 * @returns 점수 (최대 20)
 */
export const calcProblemScore = (count: number): number =>
    Math.min(count, 20) * 1;

/**
 * 게시글 작성 점수 계산
 * @param count 작성한 게시글 수
 * @returns 점수 (최대 15)
 */
export const calcPostScore = (count: number): number =>
    Math.min(count, 10) * 1.5;

/**
 * 스터디룸 개설 점수 계산
 * @param count 개설한 스터디룸 수
 * @returns 점수 (최대 10)
 */
export const calcStudyroomScore = (count: number): number =>
    Math.min(count, 5) * 2;

/**
 * 댓글 작성 점수 계산
 * @param count 작성한 댓글 수
 * @returns 점수 (최대 15)
 */
export const calcCommentScore = (count: number): number =>
    Math.min(count, 30) * 0.5;

/**
 * 총점 계산 (0 ~ 100)
 */
export const calcTotalScore = (params: {
    attendanceRate: number;
    monthlyInterviews: number;
    monthlyProblems: number;
    monthlyPosts: number;
    monthlyStudyrooms: number;
    monthlyComments: number;
}): number => {
    return (
        calcAttendanceScore(params.attendanceRate) +
        calcInterviewScore(params.monthlyInterviews) +
        calcProblemScore(params.monthlyProblems) +
        calcPostScore(params.monthlyPosts) +
        calcStudyroomScore(params.monthlyStudyrooms) +
        calcCommentScore(params.monthlyComments)
    );
};
