import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {RESERVATIONS_MOCK} from "@/core/mock/mockData.ts";
import type {ReservationStatus} from "@/pages/place/useSchedule.ts";

export interface Reservation {
    reservationId: string;
    roomName: string;
    roomId: string;
    userName: string;
    userEmail: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    reservationStatus: ReservationStatus;
    createdAt: string;
}

const IS_MOCK = true;

export function useReservationManagement() {
    const [data, setData] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async () => {
        try {
            setIsLoading(true);
            if (IS_MOCK) {

                setData(RESERVATIONS_MOCK);
            } else {
                const response = await axios.get<Reservation[]>('/api/reservations');
                setData(response.data);
            }
        } catch (err: unknown) {
            setError('예약 데이터를 가져오는 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchReservations(); }, [fetchReservations]);

    const updateStatus = (id: string, newStatus: ReservationStatus) => {
        setData(prev => prev.map(res => res.reservationId === id ? { ...res, reservationStatus: newStatus } : res));
    };

    return { data, isLoading, error, refetch: fetchReservations, updateStatus };
}