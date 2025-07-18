export const ScheduleRepeatPeriod = {
    NONE: "NONE",
    DAILY: "DAILY",
    WEEKLY: "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
    // "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"; // 반복 없음, 매일, 매주, 매월, 매년
} as const
export type ScheduleRepeatPeriodType = (typeof ScheduleRepeatPeriod)[keyof typeof ScheduleRepeatPeriod]