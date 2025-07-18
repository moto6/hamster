export interface ApiResponse<T = unknown> {
    code: string;
    message: string;
    result: T;
}

// ============================================================
// export type DateStr8 = string & { __format: "YYYY.MM.DD" };
// export type TimeStr4 = string & { __format: "HH:MM" };
// ============================================================

// ============================================================

// YYYY.MM.DD 형식의 문자열을 표현하는 타입 DateStr8
export type DateStr8 = string & { __format: "YYYY.MM.DD" };

export function toDateStr8(value: string): DateStr8 {
    const isValid = /^\d{4}\.\d{2}\.\d{2}$/.test(value);
    if (!isValid) throw new Error(`Invalid DateStr8 format: ${value}`);
    return value as DateStr8;
}

export function formatDateToStr8(date: Date): DateStr8 {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}` as DateStr8;
}

export function parseStr8ToDate(dateStr: DateStr8): Date {
    const [yyyy, mm, dd] = dateStr.split(".").map(Number);
    return new Date(yyyy, mm - 1, dd);
}

// ============================================================

// HH:MM 형식을 표현하는 타입 TimeStr4 , 24시간 기준임 (00:00~23:59)
export type TimeStr4 = string & { __format: "HH:MM" };

export function toTimeStr4(value: string): TimeStr4 {
    const isValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    if (!isValid) throw new Error(`Invalid TimeStr4 format: ${value}`);
    return value as TimeStr4;
}

export function formatDateToTimeStr4(date: Date): TimeStr4 {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}` as TimeStr4;
}

export function parseTimeStr4ToDate(timeStr: TimeStr4, baseDate?: Date): Date {
    const [hh, mm] = timeStr.split(":").map(Number);
    const date = baseDate ? new Date(baseDate) : new Date();
    date.setHours(hh);
    date.setMinutes(mm);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

// ============================================================

// YYYY.MM.DD-HH:MM 형식
export type DateTimeStr12 = string & { __format: "YYYY.MM.DD-HH:MM" };

export function toDateTimeStr12(value: string): DateTimeStr12 {
    const isValid = /^\d{4}\.\d{2}\.\d{2}-([01]\d|2[0-3]):[0-5]\d$/.test(value);
    if (!isValid) throw new Error(`Invalid DateTimeStr12 format: ${value}`);
    return value as DateTimeStr12;
}

export function formatDateToDateTimeStr12(date: Date): DateTimeStr12 {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}-${hh}:${min}` as DateTimeStr12;
}

export function parseDateTimeStr12ToDate(dateTimeStr: DateTimeStr12): Date {
    const [datePart, timePart] = dateTimeStr.split("-");
    const [yyyy, mm, dd] = datePart.split(".").map(Number);
    const [hh, min] = timePart.split(":").map(Number);
    return new Date(yyyy, mm - 1, dd, hh, min);
}
