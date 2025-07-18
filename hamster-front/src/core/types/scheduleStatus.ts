export const ScheduleStatus = {
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    END: "END",
    // "CONFIRMED" | "CANCELLED" | "END"; // 확정, 취소, 종료
} as const;
export type ScheduleStatusType = (typeof ScheduleStatus)[keyof typeof ScheduleStatus];