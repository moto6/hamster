import {useCallback, useMemo, useState} from 'react';
import type {Room} from "@/pages/place/useRoomManagement.ts";
import type {Reservation} from "@/pages/place/useReservationManagement.ts";

export const RESERVATION_STATUS_LIST = [
    'BOOKED',      // 예약 완료 (체크인 대기)
    'CHECKED_IN',  // 체크인 (사용 중, 입실 완료)
    'CANCELLED',   // 취소됨
    'NO_SHOW',      // 미입실 (시작 15분 후까지 체크인 안 함)
    'CHECKED_OUT'    // 체크아웃 (사용 종료, 종료 시간 경과)
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUS_LIST)[number];
export interface TimeSlot {
    hour: number;
    label: string;
}

export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';
export const API_URL: string = import.meta.env.VITE_API_URL; //`${API_URL}

export function useSchedule() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
    const [rooms] = useState<Room[]>([]);
    const [reservations] = useState<Reservation[]>([]);
    const [buildings] = useState([]);

    const timeSlots: TimeSlot[] = useMemo(() =>
        Array.from({ length: 13 }, (_, i) => ({
            hour: i + 8,
            label: `${(i + 8).toString().padStart(2, '0')}:00`,
        })), []);

    const changeDate = useCallback((days: number) => {
        setSelectedDate(prev => {
            const next = new Date(prev);
            next.setDate(next.getDate() + days);
            return next;
        });
    }, []);

    const goToToday = useCallback(() => setSelectedDate(new Date()), []);

    // 타임라인 내 예약 바(Bar) 위치 계산
    const getReservationStyle = useCallback((startTime: string, endTime: string) => {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startOffset = startHour - 8 + startMin / 60;
        const duration = (endHour - startHour) + (endMin - startMin) / 60;

        return {
            left: `${(startOffset / 13) * 100}%`,
            width: `${(duration / 13) * 100}%`,
        };
    }, []);

    return {
        selectedDate,
        selectedBuilding,
        setSelectedBuilding,
        buildings,
        rooms,
        reservations,
        timeSlots,
        changeDate,
        goToToday,
        getReservationStyle
    };
}