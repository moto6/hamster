import React, {useEffect, useState} from 'react';
import {Card} from 'react-bootstrap';
import {
    fetchAllMeetingRoomInfos,
    type MeetingRoomInfo,
    type MeetingRoomResource
} from "../hooks/useMeetingRoomInfos.ts";
import {fetchScheduleInfos, type MeetingScheduleInfo} from "../hooks/useMeetingScheduleInfos.ts";

const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getTopFromTime = (time: Date) => {
    const startHour = 8;
    return (time.getHours() + time.getMinutes() / 60 - startHour) * 60;
};

const styles = {
    roomColumn: {
        minWidth: '180px',
        borderRight: '1px solid #ccc'
    },
    roomHeader: {
        backgroundColor: '#f8f9fa',
        textAlign: 'center' as const,
        fontWeight: 'bold' as const,
        padding: '0.5rem',
        borderBottom: '1px solid #dee2e6'
    },
    roomBody: {
        backgroundColor: '#fff',
        height: '720px',
        position: 'relative' as const
    },
    meetingCard: {
        position: 'absolute' as const,
        width: '100%',
        padding: '0.25rem 0.5rem',
        backgroundColor: '#cfe2ff',
        fontSize: '0.85rem'
    },
    resourceIcon: {
        width: 16,
        height: 16
    }
};

const MeetingRoomPage = (): React.JSX.Element => {
    const [rooms, setRooms] = useState<MeetingRoomInfo[]>([]);
    const [schedules, setSchedule] = useState<MeetingScheduleInfo[]>();

    useEffect(() => {
        fetchAllMeetingRoomInfos().then(data => {
            setRooms(Array.isArray(data) ? data : [data]);
        });
        fetchScheduleInfos().then(data => {
            setSchedule(data);
        });
    }, []);

    if (!schedules || rooms.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="d-flex overflow-auto">
            {rooms.map(room => (
                <div key={room.meetingRoomId} style={styles.roomColumn}>
                    <div style={styles.roomHeader}>
                        <div>{room.meetingRoomName}</div>
                        <div className="text-muted">{room.capacity}명</div>
                        <div className="d-flex justify-content-center gap-1 mt-1">
                            {room.meetingRoomResourceList?.map((res: MeetingRoomResource, idx: number) => (
                                <img
                                    key={idx}
                                    src={res.iconPath}
                                    alt={res.resourceName}
                                    style={styles.resourceIcon}
                                />
                            ))}
                        </div>
                    </div>
                    <div style={styles.roomBody}>
                        {schedules
                            .filter((m: MeetingScheduleInfo) => m.meetingRoomId === room.meetingRoomName)
                            .map((m: MeetingScheduleInfo, idx: number) => {
                                const start = new Date(m.startTime);
                                const end = new Date(m.endTime);
                                const top = getTopFromTime(start);
                                const height = (end.getTime() - start.getTime()) / 1000 / 60; // 분 단위 높이
                                return (
                                    <Card key={idx} style={{...styles.meetingCard, top, height}}>
                                        <div className="fw-semibold">{m.scheduledByAccount.accountName}</div>
                                        <div className="text-muted">
                                            {formatTime(m.startTime)} ~ {formatTime(m.endTime)}
                                        </div>
                                    </Card>
                                );
                            })}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default MeetingRoomPage;
