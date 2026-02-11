export interface MeetingRoomInfo {
    meetingRoomId: string;
    meetingRoomName: string;
    capacity: number;
    locationName: string;
    buildingId: string;
    buildingFloorName: string;
    floorMapImagePath: string;
    meetingRoomResourceList: MeetingRoomResource[];
}

export interface MeetingRoomResource {
    resourceName: string;
    iconPath: string;
}

export const fetchAllMeetingRoomInfos = async (): Promise<MeetingRoomInfo[]> => {
    return new Promise(resolve =>
        setTimeout(() => resolve([sample1, sample2, sample3, sample4, sample5, sample6, sample7, sample8, sample9]), 123)
    );
};


const sample1: MeetingRoomInfo = {
    meetingRoomId: "PZA_W957",
    meetingRoomName: "PAN_W9_19",
    capacity: 14,
    locationName: "판교",
    buildingId: "W6XY4Z1",
    buildingFloorName: "판교 팡팡빌딩 A동 9층",
    floorMapImagePath: "https://imgserver.com/test.png",
    meetingRoomResourceList: [
        {
            resourceName: "화상회의",
            iconPath:
                "https://imgserver.com/test.png",
        },
        {
            resourceName: "티비",
            iconPath:
                "https://imgserver.com/test.png",
        },
        {
            resourceName: "애플 TV",
            iconPath:
                "https://imgserver.com/test.png",
        },
    ],
};

const sample2: MeetingRoomInfo = {
    meetingRoomId: "PZA_E918",
    meetingRoomName: "PAN_E9_18",
    locationName: "판교",
    capacity: 6,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_18.png",
    meetingRoomResourceList: [
        {resourceName: "화상회의", iconPath: "https://test.com/icon_meet.png"},
        {resourceName: "티비", iconPath: "https://test.com/icon_tv.png"},
        {resourceName: "애플 TV", iconPath: "https://test.com/icon_appletv.png"}
    ]
}


const sample3: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15919",
    meetingRoomName: "PAN_E9_19",
    locationName: "판교",
    capacity: 22,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: [
        {resourceName: "화상회의", iconPath: "https://test.com/icon_meet.png"},
        {resourceName: "티비", iconPath: "https://test.com/icon_tv.png"},
        {resourceName: "애플 TV", iconPath: "https://test.com/icon_appletv.png"}
    ]
}


const sample4: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15920",
    meetingRoomName: "PAN_E9_20",
    locationName: "판교",
    capacity: 4,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: [

        {resourceName: "티비", iconPath: "https://test.com/icon_tv.png"},
        {resourceName: "애플 TV", iconPath: "https://test.com/icon_appletv.png"}
    ]
}


const sample5: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15921",
    meetingRoomName: "PAN_E9_21",
    locationName: "판교",
    capacity: 16,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: [

        {resourceName: "티비", iconPath: "https://test.com/icon_tv.png"},
    ]
}

const sample6: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15900",
    meetingRoomName: "PAN_N9_00",
    locationName: "판교",
    capacity: 11,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: []
}

const sample7: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15901",
    meetingRoomName: "PAN_N9_01",
    locationName: "판교",
    capacity: 12,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: []
}

const sample8: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15902",
    meetingRoomName: "PAN_N9_02",
    locationName: "판교",
    capacity: 12,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: []
}

const sample9: MeetingRoomInfo = {
    meetingRoomId: "PZA_E15903",
    meetingRoomName: "PAN_N9_03",
    locationName: "판교",
    capacity: 11,
    buildingId: "",
    buildingFloorName: "",
    floorMapImagePath: "https://sample.com/img/PAN_E9_19.png",
    meetingRoomResourceList: []
}