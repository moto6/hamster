import type {DateStr8, DateTimeStr12, TimeStr4} from "../core/types.ts";
import type {AccountInfo} from "../core/accountInfo.ts";
//import type {MeetingRoomInfo} from "./useMeetingRoomInfos.ts"
import type {ScheduleRepeatPeriodType} from "../core/types/scheduleRepeatPeriod.ts";
import type {ScheduleStatusType} from "../core/types/scheduleStatus.ts";

export interface MeetingScheduleInfo {
    meetingScheduleId: number;
    meetingRoomId: string;
    //meetingRoom: MeetingRoomInfo;
    title: string;
    startDate: DateStr8;
    startTime: TimeStr4;
    endTime: TimeStr4;
    repeatGroupIdx: number;
    repeatStatus: ScheduleRepeatPeriodType
    repeatEndDate: DateStr8 | null;
    extendYn: "Y" | "N";
    status: ScheduleStatusType
    content: string | null;
    scheduledByAccount: AccountInfo,
    deleteYn: "Y" | "N";
    createdAt: DateTimeStr12;
    createdById: string;
    updatedAt: DateTimeStr12;
    updatedById: string;
    reserveParticipantList: AccountInfo[];
    connectCalenderYn: "Y" | "N";
}

export const fetchScheduleInfos = async (): Promise<MeetingScheduleInfo[]> => {
    //return sampleMeetingScheduleInfo;
    return new Promise(resolve =>
        setTimeout(() => resolve([sample1,]), 222)
    );
    // const response = await axios.get<DashboardInfo>(`${endpoint}/api/v0/dashboard-info`);
    // return response.data;
};

const sample1: MeetingScheduleInfo = {
    meetingScheduleId: 1001,
    meetingRoomId: "PZA_W9157",
    title: "프로젝트 킥오프 회의",
    startDate: "2025.07.22" as DateStr8,
    startTime: "10:00" as TimeStr4,
    endTime: "11:00" as TimeStr4,
    repeatGroupIdx: 0,
    repeatStatus: "NONE" as ScheduleRepeatPeriodType,
    repeatEndDate: null,
    extendYn: "N",
    status: "CONFIRMED" as ScheduleStatusType,
    content: "회의실에서 킥오프 회의를 진행합니다.",
    scheduledByAccount: {
        accountId: "qkang.marvel",
        accountName: "정복자캉",
        departmentName: "개발팀",
        departmentCode: "RNQ22340"
    } as AccountInfo,
    deleteYn: "N",
    createdAt: "2025.07.15-13:20" as DateTimeStr12,
    createdById: "qkang.marvel",
    updatedAt: "2025.07.15-13:45" as DateTimeStr12,
    updatedById: "qkang.marvel",
    reserveParticipantList: [],
    connectCalenderYn: "Y",
};