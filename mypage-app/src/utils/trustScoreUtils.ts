/**
 * 출석률 점수 계산 (최대 40)
 */
export const calcAttendanceScore = (rate: number): number =>
    Math.min(rate, 100) * 0.4;

/**
 * 모의면접 점수 계산 (최대 25)
 */
export const calcInterviewScore = (count: number): number =>
    Math.min(count, 10) / 10 * 25;

/**
 * 문제풀이 점수 계산 (최대 25)
 */
export const calcProblemScore = (count: number): number =>
    Math.min(count, 20) / 20 * 25;

/**
 * 스터디룸 개설 점수 계산 (최대 10)
 */
export const calcStudyroomScore = (count: number): number =>
    Math.min(count, 3) / 3 * 10;

/**
 * 총점 계산
 */
export const calcTotalScore = (params: {
    attendanceRate: number;
    monthlyInterviews: number;
    monthlyProblems: number;
    monthlyStudyrooms: number;
}): number => {
    return (
        calcAttendanceScore(params.attendanceRate) +
        calcInterviewScore(params.monthlyInterviews) +
        calcProblemScore(params.monthlyProblems) +
        calcStudyroomScore(params.monthlyStudyrooms)
    );
};
