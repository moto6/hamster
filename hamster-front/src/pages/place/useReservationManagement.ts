import {useCallback, useEffect, useState} from 'react';
import {libraryApiClient} from "@/core/http/libraryClient.ts";
import type {PlaceReservationStatus} from "@/pages/place/useSchedule.ts";

export interface PlaceReservation {
    reservationId: string;
    roomName: string;
    roomId: string;
    userName: string;
    userEmail: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    reservationStatus: PlaceReservationStatus;
    createdAt: string;
}

export const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';
export const API_URL: string = import.meta.env.VITE_API_URL; //`${API_URL}
export function useReservationManagement() {
    const [data, setData] = useState<PlaceReservation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await libraryApiClient.get<PlaceReservation[]>(`${API_URL}/api/v0/admin/places/reservations`);
            setData(response.data);
        } catch (err: unknown) {
            setError('예약 데이터를 가져오는 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchReservations(); }, [fetchReservations]);

    const updateStatus = (id: string, newStatus: string) => {
        void id;
        void newStatus;
        // TODO: implement status update
        // setData((prev:PlaceReservation[]) => prev.map(res => res.reservationId === id ? { ...res, reservationStatus: newStatus } : res));
    };

    return { data, isLoading, error, refetch: fetchReservations, updateStatus };
}